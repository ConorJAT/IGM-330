import { useEffect, useMemo, useState } from "react";
import './App.css'
import { readFromLocalStorage, writeToLocalStorage } from "./storage";
import Footer from "./Footer";

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


const App = () => {
  const savedTerm = useMemo(() => readFromLocalStorage("term") || "", []);
  const [term, setTerm] = useState(savedTerm);
  const [results, setResults] = useState([]);
  useEffect(() => {
    writeToLocalStorage("term", term);
  }, [term]);

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
      // console.log(json);
    }catch(error){
      console.log("Error in data retrieval!");
      return;
    }

    setResults(json.amiibo);

    // log out number of results (length of json.amiibo)
    // console.log(`Number of results=${json.amiibo.length}`);

    // loop through json.amiibo and log out character name
    // for (let amiibo of json.amiibo) { console.log(amiibo.character); }
  };

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
    {results.map(amiibo => (
        <span key={amiibo.head + amiibo.tail} style={{color:"green"}}>
          <h4>{amiibo.name}</h4>
          <img 
            width="100" 
            alt={amiibo.character}
            src={amiibo.image}
          />
        </span>
      ))}
    <hr />
    <Footer 
      name="Ace Coder"
      year={new Date().getFullYear()}
    />
  </>;
};

export default App;