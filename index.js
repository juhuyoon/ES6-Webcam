const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//to ask for access to photo/webcam and get the camera to show
function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}) //promise
        .then(localMediaStream => {
            //console.log(localMediaStream);
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        }) .catch(err => {
            console.error('did not long', err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    //console.log(width, height);
    canvas.width = width;
    canvas.height = height;
    //drawImage pulls the video and paints on the width and the height.
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //this is now to set up the filters, takes pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //changes them. 
        // pixels = rgbSplit(pixels);
        //puts them back into canvas
        ctx.putImageData(pixels, 0, 0);
    }, 16); //every 16 ms frames update.
}

function takePhoto(){
    //played the snap sound
     snap.currentTime = 0;
     snap.play();

     //take the data out of the canavs
    const data = canvas.toDataURL('image/jpeg');
    //console.log(data)

    const link = document.createElement('a'); //made a link
    link.href = data;
    link.setAttribute('download', 'image'); //image is the name of the photo
    link.innerHTML  = `<img src="${data}" alt="photo" />`;
    strip.insertBefore(link, strip.firstChild); //prepending
}

function redSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 100 // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50 //green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5 //blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }
  
  function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }


getVideo();

video.addEventListener('canplay', paintToCanvas); //listening on the video element
//once getVideo is played, it will emit the event canplay then canvas will run

