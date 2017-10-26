/*
This file will be included by other parts of our system that need access to the database
We want to keep all our database functionality close together and from a single place
*/

const sqlite = require("sqlite3");

//We need this singleton-like thing so that many files can all require this big JS file
//Make sure that we only perform init once
var init = false;
if (!init) {
    init = true;

    if (process.env.NODE_ENV == "development") {
        //Open a database in memory for testing

    } else {
        //Open the database connection

    }

    //Create any tables we need that don't exist
}

//Export an object full of functions to call on the database
module.exports = {

};