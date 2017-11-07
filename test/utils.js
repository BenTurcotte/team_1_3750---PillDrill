/*
These are utility functions that will help the testing process
*/

const http = require("http");

/**
 * Makes a request to our real server that is running on http://localhost:8000.
 * It takes the method, path and any data that you want to send with it.
 * 
 * callback is (err, data), and err will be a falsey value if no errors happen during the request.
 * data is the JSON parsed object
 */
function makeRequest(method, path, data, callback) {
    var request = http.request({
        method: method,
        host: "localhost",
        path: path,
        port: 8000
    }, (res) => {
        var rawData = "";
        res.on("data", (chunk) => rawData += chunk);
        res.on("end", () => {
            try {
                callback(undefined, JSON.parse(rawData));
            } catch (e) {
                callback(e);
            }
        });
    });
    request.on("error", (e) => {
        callback(e);
    });

    //Turn the data into JSON if it's an object
    if (typeof(data) == "object") {
        request.setHeader("Content-Type", "application/json");
        request.end(JSON.stringify(data));
    } else {
        request.end(data);
    }
}

module.exports = {
    /**
     * Makes a request to the server that is defined by method (GET, POST, etc.) to the path.
     * 
     * @see makeRequest for more documentation.
     */
    makeGET(path, callback) {
        makeRequest("GET", path, undefined, callback);
    },

    makePOST(path, data, callback) {
        makeRequest("POST", path, data, callback);
    }
};