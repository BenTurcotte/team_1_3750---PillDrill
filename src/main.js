/*
This is the entry point for our application
*/

//Require (include) any external libraries that we want to use
const express = require("express");
const https = require("https");

//This is the application that we will interact with express through
const app = express();

//Now require any of our own modules (js files)
const database = require("./database/database");
const utils = require("./utils");

const userRouter = require("./user/user");

//Load any middleware that we want running all the time
//This is so that every request will first go through these functions before getting to our own
//This json parser allows requests with a JSON body to be parsed into a normal JavaScript object
app.use(express.json());

//Disable the x-powered-by header to protect from targeted attacks
app.disable("x-powered-by");
app.disable("etag");

//Setup all of our routes
app.use("/users", userRouter);

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
    //Have an error handler that will send back the call stack
    app.use(function(err, req, res, next) {
        res.status(500).json(utils.createErrorObject(err.stack));
    });

    //Just listen on localhost for development and testing
    var server = app.listen(8000, "localhost");

    //Let the testing know that the server is ready
    process.on("message", function({ test }) {
        if (test) {
            process.send({ ready: true });
        }
    });
} else if (process.env.NODE_ENV == "production") {
    throw new Error("HTTPS not set up yet");
    var server = https.createServer({
        //These are the options for creating the HTTPS server
        // key: ,
        // cert: ,
    }, app);

    //Starts the server on the general HTTPS port at the address that we give it
    server.listen(443, process.argv[2]);
}

//Do anything that we need to before exiting
server.on("close", function() {
    console.log("db closed");
    database.close();
});
