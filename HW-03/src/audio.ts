// 1.) - Declare WebAudio context.
let audioCtx;

// 2.) - WebAudio nodes that make up the WebAudio audio routing graph.
let element, sourceNode, analyserNode, gainNode;
let highShelfbiquadFilter, lowShelfBiquadFilter;

// 3.) - Create default values.
const DEFAULTS = Object.freeze({
    gain        :   .5,
    numSamples  :   256
});

// 4.) - Create a new array of 8-bit integers (0-255).
// This is a typed array to hold the audio frequency data.
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

// Sets up web audio for the visualizer.
const setupWebAudio = (filepath) => {
    // 1.) - Initialize WebAudio context.
    const AudioContext = window.AudioContext;
    audioCtx = new AudioContext();

    // 2.) - Create an <audio> element.
    element = new Audio();

    // 3.) - Point the <audio> element at a sound file.
    loadSoundFile(filepath);

    // 4.) - Create source node that points at the <audio> element.
    sourceNode = audioCtx.createMediaElementSource(element);

    // 5.) - Create analyser node.
    analyserNode = audioCtx.createAnalyser();

    // 6.) - Apply fft (Fast Fourier Transform) to the analyser node.
    analyserNode.fftSize = DEFAULTS.numSamples;

    // 7.) - Create high shelf biquad (treble) filter.
    highShelfbiquadFilter = audioCtx.createBiquadFilter();
    highShelfbiquadFilter.type = "highshelf";
    highShelfbiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);

    // 8.) - Create low shelf biquad (bass) filter.
	lowShelfBiquadFilter = audioCtx.createBiquadFilter();
    lowShelfBiquadFilter.type = "lowshelf";
    lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);

    // 9.) - Create gain (volume) node.
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;

    // 10.) - Connect the nodes and create the audio graph.
    sourceNode.connect(highShelfbiquadFilter);
    highShelfbiquadFilter.connect(lowShelfBiquadFilter);
    lowShelfBiquadFilter.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
};

// Load in audio file via the filePath.
const loadSoundFile = (filePath) => { element.src = filePath; };

// Play the current audio.
const playCurrentSound = () => { element.play(); };

// Pause the current audio.
const pauseCurrentSound = () => { element.pause(); };

// Set the volume based on slider input.
const setVolume = (value) => {
    value = Number(value);
    gainNode.gain.value = value;
};

// Set the treble based on slider input.
const setHighshelf = (value) => {
    highShelfbiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    highShelfbiquadFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

// Set the bass based on slider input.
const setLowshelf = (value) => {
    lowShelfBiquadFilter.frequency.setValueAtTime(1000, audioCtx.currentTime);
    lowShelfBiquadFilter.gain.setValueAtTime(value, audioCtx.currentTime);
}

export {audioCtx, setupWebAudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, setHighshelf, setLowshelf, analyserNode};