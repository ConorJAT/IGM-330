// main.ts - Primarily responsible for hooking up the UI to the rest of the application 
// and setting up the main event loop

// Import from local ts files.
import * as utils from './utils';
import * as audio from './audio';
import * as canvas from './canvas';
import DefaultAudio from './interfaces/defaultAudio.interface';

// Set default audio.
const defaults : DefaultAudio = {audio : "media/DifferentHeaven&SianArea-FeelLikeHorrible.mp3"};


// Initialize the program.
const init = () => {
  audio.setupWebAudio(defaults.audio);

  // Set up <canvas> element.
	let canvasElement = document.querySelector("canvas");
	setupUI(canvasElement);
  canvas.setupCanvas(canvasElement, audio.analyserNode);

  // Begin the program loop.
  loop();
};


// Sets up all UI elements on the page. 
const setupUI = (canvasElement) => {
  // 1.) - Set up full screen button.
  const fsButton = document.querySelector("#btn-fs") as HTMLButtonElement;
	
  // 1A.) - Add onClick event to full screen button.
  fsButton.onclick = e => {
    console.log("goFullscreen() called");
    utils.goFullscreen(canvasElement);
  };


  // 2.) - Set up play/pause button.
  const playButton = document.querySelector("#btn-play") as HTMLButtonElement;

  // 2A.) - Add onClick event to play/pause button.
  playButton.onclick = e => {
    const target = e.target as HTMLButtonElement;

    // 2B.) - Check if context is in suspended state (autoplay policy).
    if (audio.audioCtx.state == "suspended") {
      audio.audioCtx.resume();
    }
    // 2C.) - If track is currently paused, play it.
    if (target.dataset.playing == "no"){
      audio.playCurrentSound();
      target.dataset.playing = "yes";
    }
    // 2C.) - If track IS playing, pause it.
    else{
      audio.pauseCurrentSound();
      target.dataset.playing = "no";
    }
  };


  // 3.) - Set up track <select>.
  let trackSelect = document.querySelector("#select-track") as HTMLSelectElement;

  // 3A.) - Add onChange event to <select>.
  trackSelect.onchange = e => {
    const target = e.target as HTMLSelectElement;

    audio.loadSoundFile(target.value);

    // 3B.) - Pause the current track if playing
    if (target.dataset.playing == "yes"){
      playButton.dispatchEvent(new MouseEvent("click"));
    }
  };


  // 4.) - Set up visual style <select>.
  let visualSelect = document.querySelector("#select-visual") as HTMLSelectElement;

  // 4A.) - Add onChange event to <select>.
  visualSelect.onchange = e => { 
    const target = e.target as HTMLSelectElement;
    canvas.drawParams.visualData = target.value; 
  };


  // 5.) - Set up canvas toggle checkboxes.
  let bars = document.querySelector("#cb-planets") as HTMLInputElement;
  let circles = document.querySelector("#cb-core") as HTMLInputElement;
  let noise = document.querySelector("#cb-noise") as HTMLInputElement;
  
  // 5A.) - Add onChange event to canvas sprites.
  bars.onchange = e => { 
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showPlanets = target.checked; 
  };
  // 5B.) - Add onChange event to center circle.
  circles.onchange = e => {
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showCircles = target.checked; 
  };
  // 5C.) - Add onChange event to noise.
  noise.onchange = e => {
    const target = e.target as HTMLInputElement;
    canvas.drawParams.showNoise = target.checked; 
  };


  // 6.) - Set up visual theme <select>.
  let themeSelect = document.querySelector("#select-theme") as HTMLSelectElement;

  // 6A.) - Add onChange event to <select>.
  themeSelect.onchange = e => {
    const target = e.target as HTMLSelectElement;
    canvas.changeTheme(target.value);
  }
};


// Program loop.
const loop = () => {
  setTimeout(loop, 1000/60.0);
  canvas.draw();
};

export {init};