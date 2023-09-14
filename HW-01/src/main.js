import {getRandom} from "./utils.js";

const init = () => {
    // Get reference to the button.
    const btn_1 = document.querySelector("#btn-gen-1");
    const btn_5 = document.querySelector("#btn-gen-5");

    const loadBabble = (count, callback) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = e => {
            console.log(`In onLoad - HTTP Status Code - ${e.target.status}`);

            callback(count, e);
        }

        xhr.onerror = e => console.log(`In onError - HTTP Status Code = ${e.target.status}`);
        xhr.open("GET", "data/babble-data.json");
        xhr.send();
    }

    // Generate the babble(s).
    const babbleLoaded = (count, evt) => {
        let json;
            
        // JSON Guard Code (Try/Catch)
        try{
            json = JSON.parse(evt.target.responseText);
        }catch{
            document.querySelector("#output").innerHTML = "JSON.parse() Failed!";
            return;
        }
        
        let w1 = json.words1;
        let w2 = json.words2;
        let w3 = json.words3;

        // Initialize babble.
        let html = "";
        // Concatenate a new babble for every iteration of loop. 
        for (let i = 0; i < count; i++) html += `${getRandom(w1)} ${getRandom(w2)} ${getRandom(w3)}<br><br>`;

        // Get reference and change the text of the paragraph element.
        document.querySelector("#output").innerHTML = html;
    }

    // Add 'click' event listener to button -> Generate a babble.
    btn_1.onclick = () => loadBabble(1, babbleLoaded);
    btn_5.onclick = () => loadBabble(5, babbleLoaded);
};

init();