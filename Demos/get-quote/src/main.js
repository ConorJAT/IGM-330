// import {} from "./utils.js";
import * as utils from "./utils.js";

// START CODE
// https://www.brainyquote.com/topics/education-quotes
let quoteIndex = 0;
	
const displayQuote = (index) => {
	document.querySelector("#lbl-output").innerHTML = utils.getQuote(index);
};

const displayPagination = (index) => {
	document.querySelector("#lbl-pagination").innerHTML = `${index+1} of ${utils.quotes.length}`;
};
	
const nextQuote = () => {
	quoteIndex += 1;
	if (quoteIndex >= utils.quotes.length){
		quoteIndex = 0;
	}
	displayQuote(quoteIndex);
	displayPagination(quoteIndex);
};

const prevQuote = () => {
	quoteIndex -= 1;
	if (quoteIndex < 0){
		quoteIndex = utils.quotes.length - 1;
	}
	displayQuote(quoteIndex);
	displayPagination(quoteIndex);
};

const init = () => {
	displayQuote(quoteIndex);
	displayPagination(quoteIndex);
	document.querySelector("#btn-prev").onclick = prevQuote;
	document.querySelector("#btn-next").onclick = nextQuote;
};


init();
	