# CSCI 3601 Production Template -- Spring 2018 Iteration 4 Notes
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group)
<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [LogIn Notes](#login-notes)
- [Running the Project](#running-the-project)
- [Deploying Project for Production](#deploying-project-for-production)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
- [Google Login](#google-login)
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

Instructions on setting up the project for production can be found below. Note, in order to have the latest version of mongo on your deployment, which is necessary with this version of the project, instead of running wget with the url given in the following instructions, run 'wget https://gist.githubusercontent.com/hamer073/55c17e713b4652b644940a3ee2e6287e/raw/6729067ae8e39dc3952859521728bd71b7f78c38/3601-Setup-V2.sh' 
[UMM CSCI 3601 Droplet Setup Instructions](https://gist.github.com/pluck011/d968c2280cc9dc190a294eaf149b1c6e)

After following the above instructions, you'll need to upload your client secret to the droplet or other deployment environment.
1. Decide where you want the client secret to be located. It doesn't matter a ton where this goes, but you'll have to change the path in the Server.java file to reflect wherever you put it.
2. After deciding where you want the client secret json file (the one you get by following the instructions in the developer side notes under Google Login. You may want to do this first.) to go you're going to want to FTP into your deployment. There are desktop applications to help with this, but I'm going to be using instructions for command line interfaces.
3. Opening up your terminal (assuming your using linux) and type 'sftp deploy-user@[your-ip-here]'. Do whatever you would need to do to ssh into your deployment.
4. Next navigate to the directory where you want to put your client secret. To do this use cd [path] to navigate to the directory you want. You can use ls to see what folders and files are in the current directory. If you need to make a new folder for it, you can create one from the command line by using mkdir [new-file-name].
5. Now you need to navigate to wherever the client secret is stored on your local machine. To do this you use lcd [path] to change the directory your local machine is looking at. To see the folders and files in the current directory use ls.
6. Once you've gotten to the directory you want the client secret to be in on your deployment and have located the client secret on your local machine,  type 'put [your file name] [new file name]'. The second argument in brackets is optional, but helpful if your client secret is named one thing and you want it to be named something else on your deployment.
7. Now exit out of the sftp session using exit and ssh into your deployment as usual. Reboot the server following the instructions in droplet setup instructions above.

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

## Google Login

Google Login is how we're providing user authentication. We're using the gapi library imported from gapi-client. For instructions from Google on setting all this up you can check these links: https://developers.google.com/identity/sign-in/web/sign-in and https://developers.google.com/identity/sign-in/web/server-side-flow

For a basic run down of setting up Google login however:

1. Go to console.developers.google.com and select create a project if you don't have any existing ones or click on the dropdown to select a project at the top and add click the plus to create a new project.

2. Name your project and select any organizations you want linked to it. Click create.

3. Select the Credentials tab on the sidebar of your dashboard. Go to the OAuth Consent Screen tab and enter your product name you want to show and the website url.

4.  Now go to the credentials tab and select Create Credentials choosing OAuth Client ID.

5. Select Web Application, filling out the fields. Authorized Javascript Origins refers to your web url. Both Authorized Javascript Origins and Authorized Redirect URIs should be the same.

6. Now that your credentials are setup you want to download your client secret file. Select your project in the credentials screen and click the Download JSON button at the top. This will give you a file copy of your client secret. DO NOT SHARE THIS WITH ANYONE WHO SHOULDN'T HAVE ACCESS TO THE SITE! It is very very important that this file remains secure, so do not put it into a github repository.

7. For instructions on how to get the client secret onto your deployment, see the deployment instructions above. 

