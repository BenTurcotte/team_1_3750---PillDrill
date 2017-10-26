/*
These are utility functions that will help the testing process
*/

const http = require("http");

function makeRequest(method, path, data, resFn) {
    var request = http.request({
        method: method,
        host: "localhost",
        path: path,
        port: 8000
    }, (res) => {
        var rawData = "";
        res.on("data", (chunk) => rawData += chunk);
        res.on("end", () => {
            resFn(rawData);
        });
    });
    request.end(data)
}

module.exports = {
    /**
     * Makes a request to the server that is defined by method (GET, POST, etc.) to the path
     * 
     * It takes a function that will be called with the results of the request (which is a string)
     */
    makeGET(path, resFn) {
        makeRequest("GET", path, undefined, resFn);
    }
};