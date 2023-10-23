import * as main from "./main.js";

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
	}

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
		let controlList = "";
		let controls = json.controls;

		for(let c of controls){
			controlList += `${c["control-name"]}: <input type=range id=${c["control-id"]} min=${c["control-min"]} max=${c["control-max"]} value=${c["control-value"]} step=0.01>`;
			controlList += `<span id=${c["control-label"]}>???</span>`;
			controlList += " | ";
		}

		document.querySelector("#slider-controls").innerHTML = controlList;
	}

	loadData();

	// 2 - start up app
	main.init();
}