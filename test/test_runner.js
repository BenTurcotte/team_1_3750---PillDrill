/*
This is the test runner to run all of the tests and have some reporting
*/

//Call this function to get a test runner object
//It should also only be called once in the main test file, then passed to every other one
module.exports = function() {
    return {
        startTime: process.hrtime(),
        testsStarted: 0,
        testsDone: 0,
        errorList: [],
        doneCallbacks: [],
        
        /**
         * Tests the given function
         * Calls the function with a function that can test a condition
         * If that condition fails, then the test is also failed
         * The check function cannot be called more than once
         * Call checkTest(value to test, message if it fails)
        */
        test(fn) {
            this.testsStarted++;
            var alreadyChecked = false;
            
            //We are using a closure here so that it captures the value of "this" (the testRunner)
            var checkTest = (value, message) => {
                alreadyChecked = true;
                
                if (!alreadyChecked && !value) {
                    this.errorList.push(message);
                }
                this.testsDone++;

                //Check to see if every test is done
                if (this.testsDone == this.testsStarted) {
                    this.doneCallbacks.forEach((callback) => {
                        callback();
                    });
                }
            };
            fn(checkTest);
        },

        /**
         * Prints out the results of the testing
         */
        summary() {
            const elapsed = process.hrtime(this.startTime);
            console.log(`${this.testsDone} tests run in ${elapsed[0] + elapsed[1]/1e9} seconds`);
            console.log(`${this.errorList.length} tests failed\n`);
            
            this.errorList.forEach((message) => console.log(message));
        },

        /**
         * Registers a callback to be called when the testing is done
         */
        whenDone(callback) {
            this.doneCallbacks.push(callback);
        },
    };
};