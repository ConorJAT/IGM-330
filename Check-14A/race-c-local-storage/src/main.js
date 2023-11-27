import * as storage from "./storage.js"
let items = ["???!!!"];


// I. declare and implement showItems()
// - this will show the contents of the items array in the <ol>
const showItems = () => {
  // loop though items and stick each array element into an <li>
  // use array.map()!
  // update the innerHTML of the <ol> already on the page
  let html = `${items.map((element) => `<li>${element}</li>`).join("")}`;
  document.querySelector("ol").innerHTML = html;
};

// II. declare and implement addItem(str)
// - this will add `str` to the `items` array (so long as `str` is length greater than 0)
const addItem = str => {
  if (str) { items.push(str); }
};


// Also:
// - call `addItem()`` when the button is clicked, and also clear out the <input>
// - and be sure to update .localStorage by calling `writeToLocalStorage("items",items)`
const setupUI = () => {
  const addButton = document.querySelector("#btn-add");
  const clearButton = document.querySelector("#btn-clear");
  let input = document.querySelector("#thing-text");

  addButton.onclick = () => {
    addItem(input.value);
    input.value = "";
    showItems();

    storage.writeToLocalStorage("ctr9664", items);
  };

  clearButton.onclick = () => {
    items = [];
    input.value = "";
    showItems();

    storage.writeToLocalStorage("ctr9664", items);
  };
};
  

// When the page loads:
// - load in the `items` array from storage.js and display the current items
// you might want to double-check that you loaded an array ...
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
// ... and if you didn't, set `items` to an empty array
const init = () => {
  if (Array.isArray(storage.readFromLocalStorage("ctr9664"))) { items = storage.readFromLocalStorage("ctr9664"); }
  else { items = []; }

  showItems();
  setupUI();
};

init();
// Got it working? 
// - Add a "Clear List" button that empties the items array
