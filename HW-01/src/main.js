import {getRandom} from "./utils.js";

// Wait for window to load before executing script.
window.onload = () => {
    // Get reference to the button.
    const btn_1 = document.querySelector("#btn-gen-1");
    const btn_5 = document.querySelector("#btn-gen-5");

    // Generate the babble.
    const generateBabble = count =>{
        // Initialize babble.
        let babble = "";

        for (let i = 0; i < count; i++)
        {
            // Concatenate a new babble for every iteration of loop. 
            babble += `${getRandom(words1)} ${getRandom(words2)} ${getRandom(words3)}` + "<br><br>";
        }

        // Get reference and change the text of the paragraph element.
        document.querySelector("#output").innerHTML = babble;
    }

    // Add 'click' event listener to button -> Generate a babble.
    btn_1.addEventListener("click", function () { generateBabble(1); });
    btn_5.addEventListener("click", function () { generateBabble(5); });

    generateBabble(1);
};