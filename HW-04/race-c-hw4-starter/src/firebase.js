import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, get, update, push, onValue } from  "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

// Your web app's Firebase configuration
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

  const addNewFavoritePark = (parkId, name, likes) => {
    const db = getDatabase();
    const dbPath = ref(db, 'park-favorites/' + parkId);
    push(dbPath, {
        parkId,
        name,
        likes
    });
  };

  export { getDatabase, ref, set, get, update, push, onValue, addNewFavoritePark };