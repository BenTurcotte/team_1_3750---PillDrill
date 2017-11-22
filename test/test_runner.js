/*
This is the test runner to run all of the tests and have some reporting
*/

//Call this function to get a test runner object
//It should also only be called once in the main test file, then passed to every other one
module.exports = function() {
    return {
        //These are the tests in the queue
        testQueue: [],
        
        /**
         * First, the test must have a title
         * Tests the given function callback
         * Calls the function with a function that can test a condition
         * If that condition fails, then the test is also failed
         * The check function cannot be called more than once
         * Call checkTest(value to test, message if it fails)
         * 
         * dependsOn is the title of another test that must be run after that one
        */
        queueTest(title, callback, dependsOn) {
            //Put an object in the test queue to keep track of everything
            this.testQueue.push({
                //Create a testing function to return a Promise so that we can test this asynchronously
                test() {
                    return new Promise((resolve, reject) => {
                        var alreadyChecked = false;

                        //Call the callback with the testing function
                        callback((value, message) => {
                            if (!alreadyChecked) {
                                alreadyChecked = true;

                                //Reject the promise if the test fails
                                if (!value) {
                                    reject({
                                        //Return the current test with the message
                                        test: this,
                                        message,
                                    });
                                } else {
                                    resolve(this);
                                }
                            }
                        });
                    });
                },
                title,
                dependsOn,
                dependencies: [],

                /**
                 * Recursively counts all of the dependencies of this test
                 * theFailedTest is true only on the first call so that it doesn't count the
                 * failed test.
                 */
                countMissedTests(theFailedTest) {
                    let thisTest = theFailedTest ? 0 : 1;

                    //Finally return normally once we reach the end of a dependency chain
                    if (this.dependencies.length == 0) {
                        return thisTest;
                    }

                    //Go through all of the tests and count their dependencies too
                    //Make sure to count the current test too (the initial value to accumulate)
                    return this.dependencies.reduce(function(acc, test) {
                        return acc + test.countMissedTests(false);
                    }, thisTest);
                },
            });
        },

        /**
         * Starts the tests that have been queued
         * 
         * Calls the doneCallback when all of the tests have been executed.
         * It has no arguments.
         */
        startTests(doneCallback) {
            //These are the stats for the tests
            var testStats = {
                total: this.testQueue.length,
                passed: 0,
                failed: 0,
                missed: 0,
                
                errorList: [],

                //Start counting when the tests are actually started
                startTime: process.hrtime(),

                /**
                 * If all of the tests are done, will return true
                 */
                isDone() {
                    return this.total == this.passed + this.failed + this.missed;
                },

                /**
                 * Prints out the summary stats for the testing
                 */
                printSummary() {
                    doneCallback();
                    
                    const elapsed = process.hrtime(this.startTime);
                    console.log(`Tests run in ${elapsed[0] + elapsed[1]/1e9} seconds`);
                    console.log(`${testStats.passed} tests passed`);
                    console.log(`${testStats.failed} tests failed`);
                    console.log(`${testStats.missed} tests missed because of failing tests`);
                    console.log();
                    
                    this.errorList.forEach(([title, message]) => {
                        console.log("**Failed:", title);
                        console.log(message);
                        console.log();
                    });
                },
            };

            console.log(`Running ${testStats.total} tests...`);
            
            const noDependencies = this.testQueue.filter(function(value) {
                return !value.dependsOn;
            });
            
            if (noDependencies.length == 0) {
                //Log an error if there are no tests that have any any dependencies
                console.error("There must be a test that doesn't depend on any other test");
                doneCallback();
                return;
            } else {
                //Make a map of titles to the test
                let titles = {};
                this.testQueue.forEach(function(test) {
                    titles[test.title] = test;
                });

                //Make dependency chains on the ones with no dependencies
                let goodToGo = this.testQueue.every(function(test) {
                    //We don't need to do anything with the dependencies if it doesn't depend on
                    // anything
                    if (test.dependsOn == undefined) {
                        return true;
                    }

                    //Make sure that the dependsOn test title exists
                    if (titles[test.dependsOn]) {
                        //Add the test to the parent test's dependencies
                        titles[test.dependsOn].dependencies.push(test);
                        return true;
                    }

                    //Log an error when a test's dependsOn is bad
                    console.error(`"${test.title}" depends on a bad test title, "${test.dependsOn}"`);
                    return false;
                });

                //Log and stop testing something went wrong
                if (!goodToGo) {
                    console.error("Coundn't start testing");
                    doneCallback();
                    return;
                }

                //Recursively run through each test
                var runTest = function(test) {
                    test.test()
                        //Create a callback for passing a test, then when one fails
                        .then((passedTest) => {
                            testStats.passed++;

                            //There aren't any other dependencies to run if everything has been run
                            if (testStats.isDone()) {
                                testStats.printSummary();
                            } else {
                                passedTest.dependencies.forEach((childTest) => {
                                    runTest(childTest);
                                });
                            }
                        }, (failedObject) => {
                            testStats.failed++;
                            testStats.errorList.push(
                                [failedObject.test.title, failedObject.message]
                            );

                            //Count any missed tests
                            testStats.missed += failedObject.test.countMissedTests(true);

                            //Print out the stats if this one failed
                            if (testStats.isDone()) {
                                testStats.printSummary();
                            }
                        });
                };
                
                //Run the tests with no dependencies
                noDependencies.forEach((test) => {
                    runTest(test);
                });
            }
        },
    };
};
