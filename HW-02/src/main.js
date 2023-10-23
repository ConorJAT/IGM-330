/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
  visualData    : "frequency",
  showGradient  : true,
  showBars      : true,
  showCircles   : true,
  showNoise     : false,
}

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/DifferentHeaven&SianArea-FeelLikeHorrible.mp3"
});


const init = () => {
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

  audio.setupWebAudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
};


const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs");
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };


  // B - add .onclick event to "Play/Pause" button
  const playButton = document.querySelector("#btn-play");

  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
        audio.audioCtx.resume();
    }

    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (e.target.dataset.playing == "no"){
        // if track is currently paused, play it
        audio.playCurrentSound();
        e.target.dataset.playing = "yes";  // CSS will set the text to "Pause"
    }
    else{
        // if track IS playing, pause it
        audio.pauseCurrentSound();
        e.target.dataset.playing = "no";  // CSS will set the text to "Play"
    }
  };


  // C - hookup volume slider & label
  let volumeSlider = document.querySelector("#slider-volume");
  let volumeLabel = document.querySelector("#label-volume");

  // add .oninput event to slider
  volumeSlider.oninput = e => {
    // set the gain
    audio.setVolume(e.target.value);

    // update value of label to match the value of slider
    volumeLabel.innerHTML = Math.round((e.target.value/2 * 100));
  };

  // set value of label to match initial value of slider
  volumeSlider.dispatchEvent(new Event("input"));
	

  let trebleSlider = document.querySelector("#slider-treble");
  let trebleLabel = document.querySelector("#label-treble");

  trebleSlider.oninput = e => {
    audio.setHighshelf(e.target.value);
    trebleLabel.innerHTML = Math.round((e.target.value/20 * 100));
  }

  trebleSlider.dispatchEvent(new Event("input"));


  let bassSlider = document.querySelector("#slider-bass");
  let bassLabel = document.querySelector("#label-bass");

  bassSlider.oninput = e => {
    audio.setLowshelf(e.target.value);
    bassLabel.innerHTML = Math.round((e.target.value/20 * 100));
  }

  bassSlider.dispatchEvent(new Event("input"));


  // D - hookup track <select>
  let trackSelect = document.querySelector("#select-track");

  // add .onchange event to <select>
  trackSelect.onchange = e => {
    audio.loadSoundFile(e.target.value);

    // pause the current track if playing
    if (e.target.dataset.playing == "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
    }
  }

  let visualSelect = document.querySelector("#select-visual");

  visualSelect.onchange = e => { drawParams.visualData = e.target.value; }

  // E - hookup canvas toggles
  let gradient = document.querySelector("#cb-gradient");
  let bars = document.querySelector("#cb-bars");
  let circles = document.querySelector("#cb-circles");
  let noise = document.querySelector("#cb-noise");
  
  gradient.onchange = e => drawParams.showGradient = e.target.checked;
  bars.onchange = e => drawParams.showBars = e.target.checked;
  circles.onchange = e => drawParams.showCircles = e.target.checked;
  noise.onchange = e => drawParams.showNoise = e.target.checked;
}; // end setupUI


const loop = () => {
    requestAnimationFrame(loop);
    canvas.draw(drawParams);
};

export {init};