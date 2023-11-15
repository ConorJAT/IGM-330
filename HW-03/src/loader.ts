// Import from local ts files.
import * as main from "./main";
import * as audio from "./audio";

// Upon load, read in JSON data and construct page.
window.onload = () => {
	console.log("window.onload called");

	// 1.) - Create XHR request and load data from JSON.
	const loadData = () => {
		const xhr = new XMLHttpRequest();
		
		xhr.onload = e => {
			avDataLoaded(e);
		}

		xhr.open("GET", "./data/av-data.json");
		xhr.send();
	};

	// 2.) - Parse JSON file and set up HTML via its contents.
	const avDataLoaded = (e) => {
		let json;

		// 2A.) - Try/catch for parsing JSON file.
		try{ json = JSON.parse(e.target.responseText); }
		catch{ 
			console.log("JSON parse error!"); 
			return;
		}

		// 2B.) - Load title of application.
		document.querySelector("title").innerHTML = json.title;

		// 2C.) - Load track list.
		let trackList = "";
		let tracks = json.tracks;

		for(let t of tracks){ trackList += `<option value=${t["track-url"]}>${t["track-name"]}</option>`; }

		document.querySelector("#select-track").innerHTML = trackList;

		// 2D.) - Load slider controls.
		let controlList = "| ";
		let controls = json.controls;

		for(let c of controls){
			controlList += `${c["control-name"]}: <input type=range id=${c["control-id"]} min=${c["control-min"]} max=${c["control-max"]} value=${c["control-value"]} step=0.01>`;
			controlList += `<span id=${c["control-label"]}>???</span>`;
			controlList += " | ";
		}

		document.querySelector("#slider-controls").innerHTML = controlList;

		// 2E.) - Set up UI for new sliders.
		setupSliderUI();

		// 2F.) - Load header region of application.
		document.querySelector("header").innerHTML = `<h1 class="title">${json.title}</h1><p class="is-size-5">${json.instructions}</p>`;
	};

	// 3.) - Set up the slider UI on the page.
	const setupSliderUI = () => {
		// 4.) - Set up volume slider.
		let volumeSlider = document.querySelector("#slider-volume") as HTMLInputElement;
  		let volumeLabel = document.querySelector("#label-volume");

  		// 4A.) - Add onInput event to slider.
  		volumeSlider.oninput = e => {
    		const target = e.target as HTMLInputElement;
			
			// 4B.) - Set the gain.
    		audio.setVolume(target.value);

    		// 4C.) - Update value of label to match the value of slider.
    		volumeLabel.innerHTML = String(Math.round((+target.value/2 * 100)));
		};

		volumeSlider.dispatchEvent(new Event("input"));

		// 5.) - Set up treble slider.
		let trebleSlider = document.querySelector("#slider-treble") as HTMLInputElement;
  		let trebleLabel = document.querySelector("#label-treble");

		// 5A.) - Add onInput event to slider.
  		trebleSlider.oninput = e => {
			const target = e.target as HTMLInputElement;

			// 5B.) - Set the treble.
    		audio.setHighshelf(target.value);

			// 5C.) - Update value of label to match the value of slider.
    		trebleLabel.innerHTML = String(Math.round((+target.value/20 * 100)));
  		};

  		trebleSlider.dispatchEvent(new Event("input"));
		
		// 6.) - Set up bass slider.
		let bassSlider = document.querySelector("#slider-bass") as HTMLInputElement;
		let bassLabel = document.querySelector("#label-bass");
		
		// 6A.) - Add onInput event to slider.
		bassSlider.oninput = e => {
			const target = e.target as HTMLInputElement;

			// 6B.) - Set the bass.
			audio.setLowshelf(target.value);
			
			// 6C.) - Update value of label to match the value of slider.
			bassLabel.innerHTML = String(Math.round((+target.value/20 * 100)));
		};
		
		bassSlider.dispatchEvent(new Event("input"));
	};

	// Call loadData.
	loadData();

	// Start up app.
	main.init();
};