/*
This is used for any testing that we want to do for our backend since we won't have direct access
to a front-end to send requests to our server
*/

const assert = require("assert");
const childProcess = require("child_process");
const http = require("http");

//Create the test runner object for every test to use
const testRunner = require("./test_runner")();
const utils = require("./utils");

//Start our main server
var server = childProcess.fork("src/main.js", {
    env: {
        NODE_ENV: "development"
    }
});

var testReady = false;

//Wait until the server is ready to start testing
server.on("message", function({ ready }) {
    //Run all of our tests
    //We only want to run our tests once, so gate it with a one-time latch
    if (!testReady) {
        testReady = ready;

        testRunner.test((checkTest) => {
            utils.makeGET("/", (data) => {
                checkTest(data == "Hello World", "Not hello world")
            });
        });
    }
});

//Shutdown our server once every test is done
testRunner.whenDone(function() {
    server.kill();
    
    //Print out the results of our tests
    testRunner.summary();
});

//Recursively try to send this message to the server, checking if it's ready
//Stop sending messages when we know that the server is ready
function sendToServer() {
    server.send({ test: true }, function() {
        if (!testReady) {
            setTimeout(sendToServer, 100);
        }
    });
}
sendToServer();
