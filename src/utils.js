/*
This is a file full of utility functions
*/

module.exports = {
    /**
     * Checks the parameters in body of the request object
     * If they don't exist, it returns false.
     * If they do exist, it returns an object filled with the parameters that were requested.
     * The parameters are essentially a C-like var args (variable number of arguments)
     */
    checkParameters(req, ...parameters) {
        var params = {};

        //Test if every parameter exists
        //At the same time, add them to the params object
        var allExist = parameters.every(function(param) {
            if (req.body[param]) {
                params[param] = req.body[param];
                return true;
            } else {
                return false;
            }
        });

        if (allExist) {
            return params;
        }

        return false;
    },

    /**
     * Creates an error object that can be sent in a response
     */
    createErrorObject(message) {
        //If there is no message, return will the error being null (no error)
        if (!message) {
            return {
                error: null
            }
        }

        return {
            error: message
        }
    },

    /**
     * Creates an success object that can be sent in a response
     */
    createResponseObject(object) {
        //Create a basic success object
        var newObject = this.createErrorObject();

        //Put all of the same key:values that are in object in the correct one
        for (name in object) {
            newObject[name] = object[name];
        }

        return newObject;
    }
};