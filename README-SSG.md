# CSCI 3601 Production Template -- Spring 2018 Iteration 4 Notes
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group)
<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [LogIn Notes](#login-notes)
- [Running the Project](#running-the-project)
- [Deploying Project for Production](#deploying-project-for-production)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
- [Credits](#credits)
<!-- /TOC -->

## LogIn Notes

- Click `Sign In` on the top left corner under the `Home` button and sign in using your Google account.

## Running the Project

- The **build** task will _build_ the entire project (but not run it)
- The **run** Gradle task will still run your SparkJava server.
(which is available at ``localhost:4567``)
- The **runClient** task will build and run the client side of your project (available at ``localhost:9000``)
- The **runAllTests** task will run both the Java (server) tests and the `karma` (client-side, Angular) tests
- The **runServerTests** task will run the Java (server) tests
- The **runClientTests** task will run the `karma` (client-side, Angular) tests. 
   * The **runClientTestWithCoverage** task will run the `karma` tests and generate test coverage data which will be placed in `client/coverage`; open the `index.html` in that directory in a browser and you'll get a web interface to that coverage data.
   * The **runClientTestsAndWatch** task will run the `karma` tests, but leave the testing browser open and the tests in "watch" mode. This means that any changes you make will cause the code to recompile and the tests to be re-run in the background. This can give you continuous feedback on the health of your tests.
- The **runE2ETest** task runs the E2E (end-to-end, Protractor) tests. For this to work you _must_ make sure you have your server running, and you may need to re-seed the database to make sure it's in a predictable state.
- The **seedMongoDB** task will load the "demo" data into the Mongo database. If you want/need to change what gets loaded, the `seedMongoDB` command is defined in the top level `build.gradle` and currently loads four files, `emotions.seed.json`, `goals.seed.json`, `resources.seed.json`, and `journals.seed.json`, all of which are also in the top level of the project. To load new/different data you should create the necessary JSON data files, and then update `build.gradle` to load those files.

**build.sh** is a script that calls upon gradle build to build the entire project which creates an executable to be able to launch the
project in production mode. To run **build.sh**, go to your project directory in a terminal and enter:``./build.sh``

When **build.sh** is run, the script **.3601_run.sh** is copied to ~/**3601.sh**. When this is launched, for example, ``./3601.sh``, will run your project in production mode. The API_URL in _environment.prod.ts_ needs to be
the actual URL of the server. If your server is deployed on a droplet or virtual machine, for example, then you want something like 
`http://192.168.0.1:4567` where you replace that IP with the IP of your droplet. If you've set up a domain name for your system, you can use that instead, like `http://acooldomainname.com`.

## Deploying Project for Production

Instructions on setting up the project for production can be found here: 
[UMM CSCI 3601 Droplet Setup Instructions](https://gist.github.com/pluck011/d968c2280cc9dc190a294eaf149b1c6e)

## Testing and Continuous Integration

Testing the client:

* `runAllTests` runs both the server tests and the clients tests once.
* `runClientTests` runs the client tests once.
* `runClientTestsAndWatch` runs the client tests every time that the code changes after a save.
* `runClientTestsWithCoverage` runs the client tests and deposits code coverage statistics into a new directory within `client` called `coverage`. In there you will find an `index.html`. Right click on `index.html` and select `Open in Browser` with your browser of choice. For Chrome users, you can drag and drop index.html onto chrome and it will open it.  
* `runE2ETest` runs end to end test for the client side. NOTE: Two Gradle tasks _must_ be run before you can run the e2e tests. 
The server (`run`) needs to be on for this test to work, and you have to
need to have data in the `dev` database before running the e2e tests!
* `runServerTests` runs the server tests.

## Client Side Notes

## Developer Side Notes

## Credits

Emoji credits: 

https://www.flaticon.com/packs/emoji-3

Developing Credits:

- Aurora Codes
- David Chong
- Ethan Hamer
- Hunter Welch
- Jubair Hassan
- Rocherno De Jongh
- Yujing Song
