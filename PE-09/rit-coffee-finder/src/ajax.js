export const downloadFile = (url, callbackRef) => {
    const xhr = new XMLHttpRequest();

    xhr.onerror = (e) => console.log("Error reading data!");

    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;
        console.log(`headers - ${headers}`);
        console.log(`jsonString - ${jsonString}`);
        callbackRef(jsonString);
    }

    xhr.open("GET", url);

    xhr.send();
};