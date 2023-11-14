import { useState } from "react";
import './App.css'

// app "globals" and utils
const baseurl = "https://www.amiiboapi.com/api/amiibo/?name=";

const loadXHR = (url, callback) => {
  // set up the connection
  let xhr = new XMLHttpRequest();

  // when the data loads, invoke the callback function and pass it the `xhr` object
  xhr.onload = callback;

  xhr.open("GET", url);
  xhr.send();
};

const searchAmiibo = (name, callback) => {
  loadXHR( `${baseurl}${name}`, callback);
};

const parseAmiiboResult = xhr => {
  // get the responseText string
  let data = xhr.target;

  // declare a json variable
  let json;

  // try to convert to a json object
  try{
    json = JSON.parse(data.responseText);
    console.log(json);
  }catch(error){
    console.log("Error in data retrieval!");
    return;
  }

  // log out number of results (length of json.amiibo)
  console.log(`Number of results=${json.amiibo.length}`);
  
  // loop through json.amiibo and log out character name
  for (let amiibo of json.amiibo) { console.log(amiibo.character); }
};

// call searchAmiibo() with "mario" and our callback function
//searchAmiibo("mario", parseAmiiboResult); // DONE

const App = () => {
  const [term, setTerm] = useState("mario");

  return <>
    <header>
      <h1>Amiibo Finder</h1>
    </header>
    <hr />
    <main>
      <button onClick={(e) => searchAmiibo(term, parseAmiiboResult)}>Search</button>
      <label>
        Name: 
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value.trim())}
        />
      </label>
    </main>
    <hr />
    <footer>
      <p>&copy; 2023 Ace Coder</p>
    </footer>
  </>;
};

export default App;