/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './canvas';

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/DifferentHeaven&SianArea-FeelLikeHorrible.mp3"
});


const init = () => {
	console.log("init called");
  
  audio.setupWebAudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);

  canvas.setupCanvas(canvasElement, audio.analyserNode);
  loop();
};


const setupUI = (canvasElement) => {
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#btn-fs") as HTMLButtonElement;
	
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };


  // B - add .onclick event to "Play/Pause" button
  const playButton = document.querySelector("#btn-play") as HTMLButtonElement;

  playButton.onclick = e => {
    console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

    const target = e.target as HTMLButtonElement;

    // check if context is in suspended state (autoplay policy)
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }

    console.log(`audioCtx.state after = ${audio.audioCtx.state}`);
    if (target.dataset.playing == "no"){
      // if track is currently paused, play it
      audio.playCurrentSound();
      target.dataset.playing = "yes";  // CSS will set the text to "Pause"
    }
    else{
      // if track IS playing, pause it
      audio.pauseCurrentSound();
      target.dataset.playing = "no";  // CSS will set the text to "Play"
    }
  };


  // C - hookup track <select>
  let trackSelect = document.querySelector("#select-track") as HTMLSelectElement;

  // add .onchange event to <select>
  trackSelect.onchange = e => {
    const target = e.target as HTMLSelectElement;

    audio.loadSoundFile(target.value);

    // pause the current track if playing
    if (target.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };

  let visualSelect = document.querySelector("#select-visual") as HTMLSelectElement;

  visualSelect.onchange = e => { 
    const target = e.target as HTMLSelectElement;
    canvas.drawParams.visualData = target.value; 
  };


  // D - hookup canvas toggles
  let bars = document.querySelector("#cb-planets") as HTMLInputElement;
  let circles = document.querySelector("#cb-core") as HTMLInputElement;
  let noise = document.querySelector("#cb-noise") as HTMLInputElement;
  
  bars.onchange = e => { 
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showPlanets = target.checked; 
  };

  circles.onchange = e => {
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showCircles = target.checked; 
  };

  noise.onchange = e => {
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showNoise = target.checked; 
  };


  let themeSelect = document.querySelector("#select-theme") as HTMLSelectElement;

  themeSelect.onchange = e => {
    const target = e.target as HTMLSelectElement;
    canvas.changeTheme(target.value);
  }
}; // end setupUI


const loop = () => {
  setTimeout(loop, 1000/60.0);
  canvas.draw();
};

export {init};