/*
This is the entry point for our application
*/

//Require (include) any external libraries that we want to use
const express = require("express");
const https = require("https");

//This is the application that we will interact with express through
const app = express();

//Now require any of our own modules (js files)

//Load any middleware that we want running all the time
//This is so that every request will first go through these functions before getting to our own
//This json parser allows requests with a JSON body to be parsed into a normal JavaScript object
app.use(express.json());

//Disable the x-powered-by header to protect from targeted attacks
app.disable("x-powered-by");
app.disable("etag");

//Pass the express app to all of our routes

//Hello world for testing
app.get("/", function(req, res) {
    res.send("Hello World");
});

//Set up a 404 handler that catches any bad requests
app.all("*", function(req, res) {
    res.sendStatus(404);
});

//Start the server the regular HTTP or HTTPS ports
if (process.env.NODE_ENV == "development") {
    //Just listen on localhost for development and testing
    app.listen(8000, "localhost");

    process.on("message", function({ test }) {
        if (test) {
            process.send({ ready: true });
        }
    });
} else if (process.env.NODE_ENV == "production") {
    throw new Error("HTTPS not set up yet");
    // https.createServer({
    //     //These are the options for creating the HTTPS server
    //     key: ,
    //     cert: ,
    // })
}
