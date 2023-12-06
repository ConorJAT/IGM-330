import * as firebase from "./firebase.js";

const init = () => {
    const favParksRef = firebase.ref(firebase.db, firebase.likedParksPath)
    firebase.onValue(favParksRef, firebase.updateLikedParkList);
};

init();