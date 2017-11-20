/*
This is the entry point for our application
*/
//Require any Node libraries
const fs = require("fs");
const https = require("https");

//Require (include) any external libraries that we want to use
const express = require("express");
const md = require("markdown-it")();

//This is the application that we will interact with express through
const app = express();

//Now require any of our own modules (js files)
const database = require("./database/database");
const utils = require("./utils");

const userRouter = require("./api/user");

//Load any middleware that we want running all the time
//This is so that every request will first go through these functions before getting to our own
//This json parser allows requests with a JSON body to be parsed into a normal JavaScript object
app.use(express.json());

//Disable the x-powered-by header to protect from targeted attacks
app.disable("x-powered-by");
app.disable("etag");

app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.options("*", function(req, res) {
    res.sendStatus(200);
});

//Setup all of our routes
app.use("/users", userRouter);

//Be able to render our public API as HTML
app.get("/", function(req, res) {
    fs.readFile("api.md", "utf8", (err, data) => {
        if (err) res.sendStatus(400);

        res.send(md.render(data));
    });
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
    console.log("Listening on http://localhost:8000");

    //Let the testing know that the server is ready
    process.on("message", function({ test }) {
        if (test) {
            process.send({ ready: true });
        }
    });
} else if (process.env.NODE_ENV == "production") {
    /*
    var server = https.createServer({
        //These are the options for creating the HTTPS server
        key: fs.readFileSync("ssl/server.key"),
        cert: fs.readFileSync("ssl/server.crt"),
    }, app);
*/
    //Starts the server on the port and address that we give it
    var server = app.listen(Number(process.argv[3]), process.argv[2]);
    //server.listen(Number(process.argv[3]), process.argv[2]);
    console.log(`Listening on https://${process.argv[2]}:${process.argv[3]}`)
}

//Do anything that we need to before exiting
server.on("close", function() {
    console.log("db closed");
    database.close();
});
