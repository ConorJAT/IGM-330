import * as map from "./map.js";
import * as ajax from "./ajax.js";

let poi;

export const init = () => {
    map.initMap();
    map.loadMarkers();
    map.addMarkersToMap();
    setupUI();
};

const setupUI = () => {
    const lnglatRIT = [-77.67454147338866, 43.08484339838443];
    const lnglatIGM = [-77.67990589141846, 43.08447511795301];
    
    // RIT Zoom 15.5
    btn1.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatRIT);
    };

    // RIT Isometric View
    btn2.onclick = () => {
        map.setZoomLevel(15.5);
        map.setPitchAndBearing(45, 0);
        map.flyTo(lnglatRIT);
    };

    // World Zoom 0
    btn3.onclick = () => {
        map.setZoomLevel();
        map.setPitchAndBearing(0, 0);
        map.flyTo();
    };

    // IGM Zoom 18
    btn4.onclick = () => {
        map.setZoomLevel(18);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatIGM);
    };

    // Load Some Markers
    btn5.onclick = () => { if(!poi) { loadPOI(); } };
};

const loadPOI = () => {
    const url = "https://people.rit.edu/~acjvks/shared/330/igm-points-of-interest.php";

    const poiLoaded = (jsonString) => {
        poi = JSON.parse(jsonString);
        console.log(poi);

        for (let p of poi){
            map.addMarker(p.coordinates, p.title, "A POI!", "poi");
        }
    };

    ajax.downloadFile(url, poiLoaded);
};