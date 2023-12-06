import * as firebase from "./firebase.js";

const init = () => {
    const favParksRef = firebase.ref(firebase.db, firebase.likedParksPath)
    firebase.onValue(favParksRef, firebase.updateLikedParkList);

    let parkId = document.querySelector("#input-id").value;
    let likeBtn = document.querySelector("#btn-manual-like");
    let decrementCb = document.querySelector("#cb-decrement");

    likeBtn.onclick = firebase.manualParkLike(parkId, decrementCb.checked)
};

init();