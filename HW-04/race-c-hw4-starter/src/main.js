import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = [];
let geojson;


// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45,0);
		map.flyTo(lnglatNYS);
	};

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3.0);
		map.setPitchAndBearing(0,0);
		map.flyTo(lnglatUSA);
	};

	refreshFavorites();
}

const getFeatureById = (id) => { return geojson.features.find((feature) => feature.id === id); };

const showFeatureDetails = (id) => { 
	console.log(`showFeatureDetails - id=${id}`); 

	const feature = getFeatureById(id);
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	let parkInfo = `
		<p><b>Address: </b>${feature.properties.address}</p>
		<p><b>Phone: </b><a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><b>Website: </b><a href="${feature.properties.url}">${feature.properties.url}</a></p>
		<div class="control py-4">`;
	
	if (favoriteIds.includes(id)){
		parkInfo += `
			<button id="btn-fav" class="button is-success" disabled>
				<span class="icon"><i class="fas fa-add"></i></span>
				<span>Favorite</span>
			</button>

			<button id="btn-del" class="button is-warning">
				<span>Delete</span>
				<span class="icon"><i class="fas fa-trash"></i></span>
			</button>`;
	}
	else {
		parkInfo += `
			<button id="btn-fav" class="button is-success">
				<span class="icon"><i class="fas fa-add"></i></span>
				<span>Favorite</span>
			</button>

			<button id="btn-del" class="button is-warning" disabled>
				<span>Delete</span>
				<span class="icon"><i class="fas fa-trash"></i></span>
			</button>`;
	}

	parkInfo += `</div>`;
	document.querySelector("#details-2").innerHTML = parkInfo;

	document.querySelector("#details-3").innerHTML = `
		<p>${feature.properties.description}</p>`;

	document.querySelector("#btn-fav").onclick = (e) => {
		if(!favoriteIds.includes(id)) {
			favoriteIds.push(id);

			refreshFavorites();
			storage.writeToLocalStorage("ctr9664", favoriteIds);

			e.target.disabled = true;
			document.querySelector("#btn-del").disabled = false;
		}
	};

	document.querySelector("#btn-del").onclick = (e) => {
		if(favoriteIds.includes(id)){
			favoriteIds = favoriteIds.filter((element) => element != id);

			refreshFavorites();
			storage.writeToLocalStorage("ctr9664", favoriteIds);

			e.target.disabled = true;
			document.querySelector("#btn-fav").disabled = false;
		}
	};
};

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");
	a.className = "panel-block";
	a.id = feature.id;
	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	}
	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}`;
	return a;
};

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";
	for (const id of favoriteIds){
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
};

const init = () => {
	if (Array.isArray(storage.readFromLocalStorage("ctr9664"))) { favoriteIds = storage.readFromLocalStorage("ctr9664"); }
  	else { favoriteIds = []; }
	
	map.initMap(lnglatNYS);
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});	
};

init();