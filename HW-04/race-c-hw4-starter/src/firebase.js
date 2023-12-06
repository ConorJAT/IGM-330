import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment } from  "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Web app Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCY0ODmP0IOSJwHcF9NLIAacEks3zOSog8",
    authDomain: "high-scores-d8764.firebaseapp.com",
    projectId: "high-scores-d8764",
    storageBucket: "high-scores-d8764.appspot.com",
    messagingSenderId: "951012188225",
    appId: "1:951012188225:web:0f0c2c7f009870785de6c0"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  console.log(app);
  const db = getDatabase();

  const likedParksPath = "fav-parks/";

  // Pushes new liked park data to Firebase cloud
  const pushLikedParkToCloud = (park, counterValue) => {
    const favRef = ref(db, `${likedParksPath}${park.id}`);
    set(favRef, {
      id: park.id,
      name: park.properties.title,
      likes: increment(counterValue)
    });
  };

  const manualParkLike = (park, isDecrement) => {
    if(park){
      let incrementVal = 1;
      if(isDecrement) incrementVal *= -1;
      pushLikedParkToCloud(park, incrementVal);
    }
  };

  // Updates display list of parks and their likes data
  const updateLikedParkList = (snapshot) => {
    let favParks = document.querySelector("#fav-parks-list");
    favParks.innerHTML = "";

    snapshot.forEach(fav => {
      const parkKey = fav.key;
      const parkData = fav.val();
      console.log(parkKey, parkData);
  
      favParks.innerHTML += `<li class="has-text-light ml-5 mb-2"><b>${parkData.name} (${parkData.id})</b> - Likes: ${parkData.likes}</li>`;
    });
  };

  export { db, likedParksPath, ref, set, push, onValue, pushLikedParkToCloud, manualParkLike, updateLikedParkList };