import * as main from "./main";
import * as audio from "./audio";

window.onload = () => {
	console.log("window.onload called");

	// 1 - do preload here - load fonts, images, additional sounds, etc...
	const loadData = () => {
		const xhr = new XMLHttpRequest();
		
		xhr.onload = e => {
			avDataLoaded(e);
		}

		xhr.open("GET", "./data/av-data.json");
		xhr.send();
	};

	const avDataLoaded = (e) => {
		let json;

		try{ json = JSON.parse(e.target.responseText); }
		catch{ 
			console.log("JSON parse error!"); 
			return;
		}

		// Load title of application
		document.querySelector("title").innerHTML = json.title;

		// Load track list
		let trackList = "";
		let tracks = json.tracks;

		for(let t of tracks){
			trackList += `<option value=${t["track-url"]}>${t["track-name"]}</option>`;
		}

		document.querySelector("#select-track").innerHTML = trackList;

		// Load slider controls
		let controlList = "| ";
		let controls = json.controls;

		for(let c of controls){
			controlList += `${c["control-name"]}: <input type=range id=${c["control-id"]} min=${c["control-min"]} max=${c["control-max"]} value=${c["control-value"]} step=0.01>`;
			controlList += `<span id=${c["control-label"]}>???</span>`;
			controlList += " | ";
		}

		document.querySelector("#slider-controls").innerHTML = controlList;

		// Set up UI for new sliders
		setupSliderUI();

		// Load header region of application
		document.querySelector("header").innerHTML = `<h1>${json.title}</h1><p>${json.instructions}</p>`;
	};

	const setupSliderUI = () => {
		// Set up volume slider
		let volumeSlider = document.querySelector("#slider-volume") as HTMLInputElement;
  		let volumeLabel = document.querySelector("#label-volume");

  		// add .oninput event to slider
  		volumeSlider.oninput = e => {
    		const target = e.target as HTMLInputElement;
			
			// set the gain
    		audio.setVolume(target.value);

    		// update value of label to match the value of slider
    		volumeLabel.innerHTML = String(Math.round((+target.value/2 * 100)));
		};

		// Set up treble slider
		let trebleSlider = document.querySelector("#slider-treble") as HTMLInputElement;
  		let trebleLabel = document.querySelector("#label-treble");

  		trebleSlider.oninput = e => {
			const target = e.target as HTMLInputElement;

    		audio.setHighshelf(target.value);

    		trebleLabel.innerHTML = String(Math.round((+target.value/20 * 100)));
  		};

		// Set up bass slider
  		trebleSlider.dispatchEvent(new Event("input"));

		let bassSlider = document.querySelector("#slider-bass") as HTMLInputElement;
		let bassLabel = document.querySelector("#label-bass");
		
		bassSlider.oninput = e => {
			const target = e.target as HTMLInputElement;

			audio.setLowshelf(target.value);
			
			bassLabel.innerHTML = String(Math.round((+target.value/20 * 100)));
		};
		
		bassSlider.dispatchEvent(new Event("input"));
	};

	loadData();

	// 2 - start up app
	main.init();
}