const video = document.querySelector('.player')
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// Let's go!
function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(function(localMediaStream) {
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    });
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.height = height;
  canvas.width = width;
  setInterval(function() {
    ctx.drawImage(video, 0,0,width,height);
    let pixels = ctx.getImageData(0,0,width,height);
    pixels = otherEffectRGBGrid(pixels);
    pixels = otherEffectBlueGrid(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 32);

}

function redEffect(pixels) {
  for(var i = 0; i < pixels.data.length; i=i+4) {
    pixels.data[i] = pixels.data[i] + 100;
    pixels.data[i+1] = pixels.data[i+1] - 50;
    pixels.data[i+2] = pixels.data[i+2] * 0.5 ;
  }
  return pixels;
}

function otherEffect(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[l-(i)];
    pixels.data[i+1] = pixels.data[l-(i+1)];
    pixels.data[i+2] = pixels.data[l-(i+2)];
  }

  return pixels;
}

function otherEffectStaticyGrey(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[(i+2)];
    pixels.data[i+1] = pixels.data[(i)];
    pixels.data[i+2] = pixels.data[(i+1)];
  }

  return pixels;
}

function otherEffectBlueGrid(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[(0.5*i)%l+Math.sin(i)];
    pixels.data[i+1] = pixels.data[(1.5*i)%l+2*Math.sin(i)];
    pixels.data[i+2] = pixels.data[(2.5*i)%l];
  }

  return pixels;
}

function otherEffectRGBGrid(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[(0.5*i)%l+1];
    pixels.data[i+1] = pixels.data[(1.5*i)%l+2];
    pixels.data[i+2] = pixels.data[(2.5*i)%l];
  }

  return pixels;
}

function otherEffectColourGrid(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[(2*i)%l+1];
    pixels.data[i+1] = pixels.data[(2*i)%l+2];
    pixels.data[i+2] = pixels.data[(2*i)%l];
  }
  return pixels;
}

function otherEffectMirror(pixels) {
  var l = pixels.data.length;

  for(var i = 0; i < l; i=i+4) {
    pixels.data[i] = pixels.data[(i+l/2)%l+1];
    pixels.data[i+1] = pixels.data[(i+l/2)%l+2];
    pixels.data[i+2] = pixels.data[(i+l/2)%l];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  [...document.querySelectorAll('.rgb input')].forEach((input)=> {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i=i+4) {
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
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
function greenScreen(pixels) {
  const levels = {};

  [...document.querySelectorAll('.rgb input')].forEach((input)=> {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i=i+4) {
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
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  //invert canvas to base64 image
  const data = canvas.toDataURL('image/png');
  
  //create a link to image so we can download it
  const link = document.createElement('a');
  link.setAttribute('download',  'handsome');
  link,href = data;
  link.innerHTML = `<img src="${data}">`;
  strip.insertBefore(link, strip.firstChild);
}

video.addEventListener('canplay', function() {
  paintToCanvas();
});

getVideo();
