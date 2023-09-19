import {getRandom} from "./utils.js";

const init = () => {
    // Declare babble arrays.
    let words1, words2, words3;
    
    // Declare + initialize buttons.
    const btn_1 = document.querySelector("#btn-gen-1");
    const btn_5 = document.querySelector("#btn-gen-5");

    // Declare loadBabble.
    const loadBabble = () => {
        // Initialize XHR request.
        const xhr = new XMLHttpRequest();

        xhr.onload = e => {
            console.log(`In onLoad - HTTP Status Code - ${e.target.status}`);

            // Parse and retrieve data from JSON.
            babbleLoaded(e);
        }

        xhr.onerror = e => console.log(`In onError - HTTP Status Code = ${e.target.status}`);
        xhr.open("GET", "data/babble-data.json");
        xhr.send();
    };

    // Declare babbleLoaded.
    const babbleLoaded = evt => {
        let json;
            
        // JSON Guard Code (Try/Catch)
        try{
            json = JSON.parse(evt.target.responseText);
        }catch{
            document.querySelector("#output").innerHTML = "JSON.parse() Failed!";
            return;
        }
        
        // Initialize babble arrays.
        ({words1, words2, words3} = json);

        // Add onClick event handlers onto buttons.
        btn_1.onclick = () => { generateBabble(1); };
        btn_5.onclick = () => { generateBabble(5); };

        // Always load webpage with one randomized babble.
        generateBabble(1);
    };

    // Create babble(s).
    const generateBabble = count => {
        // Initialize babble.
        let babble = "";

        for (let i = 0; i < count; i++){
            // Concatenate a new babble for every iteration of loop. 
            babble += `${getRandom(words1)} ${getRandom(words2)} ${getRandom(words3)}<br><br>`;
        }

        // Get reference and change the text of the paragraph element.
        document.querySelector("#output").innerHTML = babble;
    };

    // Call loadBabble() - Retrieves and parses JSON only once!
    loadBabble();
};

init();