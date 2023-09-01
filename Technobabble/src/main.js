"use strict";
	
// Wait for window to load before executing script.
window.onload = () => {
    const words1 = ["Acute", "Aft", "Anti-matter", "Bipolar", "Cargo", "Command", "Communication", "Computer", "Deuterium", "Dorsal", "Emergency", "Engineering", "Environmental", "Flight", "Fore", "Guidance", "Heat", "Impulse", "Increased", "Inertial", "Infinite", "Ionizing", "Isolinear", "Lateral", "Linear", "Matter", "Medical", "Navigational", "Optical", "Optimal", "Optional", "Personal", "Personnel", "Phased", "Reduced", "Science", "Ship's", "Shuttlecraft", "Structural", "Subspace", "Transporter", "Ventral"];
    const words2 = ["Propulsion", "Dissipation", "Sensor", "Improbability", "Buffer", "Graviton", "Replicator", "Matter", "Anti-matter", "Organic", "Power", "Silicon", "Holographic", "Transient", "Integrity", "Plasma", "Fusion", "Control", "Access", "Auto", "Destruct", "Isolinear", "Transwarp", "Energy", "Medical", "Environmental", "Coil", "Impulse", "Warp", "Phaser", "Operating", "Photon", "Deflector", "Integrity", "Control", "Bridge", "Dampening", "Display", "Beam", "Quantum", "Baseline", "Input"];
    const words3 = ["Chamber", "Interface", "Coil", "Polymer", "Biosphere", "Platform", "Thruster", "Deflector", "Replicator", "Tricorder", "Operation", "Array", "Matrix", "Grid", "Sensor", "Mode", "Panel", "Storage", "Conduit", "Pod", "Hatch", "Regulator", "Display", "Inverter", "Spectrum", "Generator", "Cloud", "Field", "Terminal", "Module", "Procedure", "System", "Diagnostic", "Device", "Beam", "Probe", "Bank", "Tie-In", "Facility", "Bay", "Indicator", "Cell"];
	
    // Get reference to the button.
    const one_btn = document.querySelector("#myButton");
    const five_btn = document.querySelector("#giveMe5");
	
    // Add 'click' event listener to button -> Generate a babble.
    one_btn.addEventListener("click", function () { generateBabble(1); });
    five_btn.addEventListener("click", function () { generateBabble(5); });

    // Generate the babble.
    function generateBabble(count)
    {
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
	
    // Return a random int based on an array length parameter.
	function getRandom(array)
	{
		return array[Math.floor(Math.random() * array.length)];
	}

    console.log(words1[0]);
    generateBabble(1);
};