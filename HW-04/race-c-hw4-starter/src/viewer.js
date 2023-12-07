import * as ajax from "./ajax.js";
import * as firebase from "./firebase.js";

let geojson;

const init = () => {
    const favParksRef = firebase.ref(firebase.db, firebase.likedParksPath)
    firebase.onValue(favParksRef, firebase.updateLikedParkList);

    let likeBtn = document.querySelector("#btn-manual-like");
    let decrementCb = document.querySelector("#cb-decrement");

    ajax.downloadFile("data/parks.geojson", (str) => { 
        geojson = JSON.parse(str); 
        likeBtn.onclick = () => { 
            let parkId = document.querySelector("#input-id").value;
            firebase.manualParkLike(geojson, parkId, decrementCb.checked); 
        };
    });	
};

init();