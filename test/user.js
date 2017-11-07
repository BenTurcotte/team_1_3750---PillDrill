/*
This will test all of the user functionality
*/

const utils = require("./utils");

module.exports = function(testRunner) {
    const EMAIL = "test@test.ca"
    const PASSWORD = "goodTestPassword";

    //Try to create an account first
    testRunner.queueTest("Create test account", function(checkTest) {
        utils.makePOST("/users/createAccount", {
            email: EMAIL,
            password: PASSWORD,
            accountType: "Admin"
        }, function(err, data) {
            if (err) {
                checkTest(false, err.stack);
                return;
            }
            
            if (data.error) {
                checkTest(false, data.error);
                return;
            }

            checkTest(true);
        });
    });

    //Try to get a token for this account
    testRunner.queueTest("Login to test account", function(checkTest) {
        utils.makePOST("/users/login", {
            email: EMAIL,
            password: PASSWORD
        }, function(err, data) {
            if (err) {
                checkTest(false, err.stack);
                return;
            }

            if (data.error) {
                checkTest(false, data.error);
                return;
            }

            //Make sure that we have a login token
            checkTest(data.loginToken, "The login token doesn't exist");
        });
    }, "Create test account");
};
