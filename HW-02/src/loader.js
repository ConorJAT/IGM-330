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

		document.querySelector("title").innerHTML = json.title;

		let trackList = "";
		let tracks = json.tracks;

		for(let t of tracks){
			trackList += `<option value=${t["track-url"]}>${t["track-name"]}</option>`;
		}

		document.querySelector("#select-track").innerHTML = trackList;
	}

	loadData();

	// 2 - start up app
	main.init();
}