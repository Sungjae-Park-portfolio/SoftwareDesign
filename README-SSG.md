# CSCI 3601 Production Template -- Spring 2018 Iteration 4 Notes
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group)
<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [LogIn Notes](#login-notes)
- [Running the Project](#running-the-project)
- [Deploying Project for Production](#deploying-project-for-production)
- [Testing and Continuous Integration](#testing-and-continuous-integration)
- [Client Side Notes](#client-side-notes)
- [Developer Side Notes](#developer-side-notes)
- [To-do list/Future improvement](#to-do-list-future-improvement)
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

#### Emoji Carousel:

This feature is the main function of the website. This allows users to select an emotion from a selection of five by navigating left or right. From the selected emotion the user can then select an intensity by navigating up or down. 
The user is able to either use the arrow buttons to navigate through or by 'swiping' through by click and dragging within the emoji selection area. This function makes more sense on a phone but still works on either.
Once a user has selected an emoji they are able to submit it. Once submitted the entry is saved in the database and the user is prompted in a popup window that allows them to view a youtube video if they would like.
Each different emoji including the various intensity is assigned a text that is displayed below to clarify what each emoji represents.

Each time a emoji is sent to the database these fields are stored:
    _id: string;
    userID: string;
    ownerFirstName: string;
    mood: number;
    intensity: number;
    date: Date;
These parameters are defined within the emoji.ts file

The function of moving through the moods as well as intensity can be found in the home.component.html (see Control Gestures in html)
The function of wrapping around for moods and intensity can be found in the home.component.ts (see parseSwipeDirection and parseEmotionIntensity)

Files related to this function can be found within:
home.component.html
home.component.ts
home.service.ts

#### Responses:

Responses are given to the user after they submit an emotion on the home page and click the "Get a Response" button. 

A response is a link (as of now, only YouTube videos, but it could be changed to accommodate any kind of link) that is helpful to the user in some way. There is a set of default responses seeded into the database that is accessed by default whenever the user gets a response. 


The system accounts for possible bad links by checking the URL with commons-validator. It also converts YouTube watch links to embedded links so they can be viewed in the webpage itself.

The user can also add responses that can show up for themselves only, but have a random chance to be selected. 

Note that in order to have getting a random response to work correctly, MongoDB on your deployed server needs to be at least version 3.6, because of the way that the random responses work. 

#### Reports:

Reports provided the line chart and stacked bar plot based on users’ emotion selection in home page.  Stacked bar plot shows up when click tab “Bar plot”, click tab “Line chart” if want to switch to check the line chart.

Both line chart and bar plot are default to show the frequency of users’ chosen emotion in each day of this week (Monday to Sunday).  Different colors of lines/bars response to different emotions, legends on the top of each plot shows the correspondence between colors and emotions.  Click the legends can filter the relative emotions in the current plot.  For getting the yearly report, choose “year” in the dropdown above the plots tab, then click “submit”.  For getting more flexible historical report, please choose “start date” and “end date” first, then using dropdown to choose “year” or “week”, click “submit”.

We used “chart.js” for making both plots, scripted it in html file with src: https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js  
Bar plot and line chart are using the same canvas but with different type (Line chart with type “line”, but bar plot with type “bar” and set stacked as “ture” in both x-axes and y-axes).  

Filtering by “date” and “mood” in “emoji” stored in the database and get the length of emoji list left after filtering to get the frequency of a emotion.  Noticed that date filter happened before mood filter, and get frequency of all emotions in current week is a default setting.  


## To-do list/Future improvement

#### Reports:

1. Providing more time filters.  We have weekly and yearly report so for in report page, we will provide monthly and hourly filter in the future.

2. Scatter plot will be provided to show the intensity information.  We have two plots to show the emotional frequency, but users cannot check the intensity history report, we will provide a scatter plot to show the historical intensity of each emotion.



## Credits

Emoji credits: 

https://www.flaticon.com/packs/emoji-3

Developing Credits:

- Aurora Codes
- Blake Bellamy
- Chuck Menne
- David Chong
- Ethan Hamer
- Hunter Welch
- Isaac Yoakm
- Jubair Hassan
- Khondoker Prio
- Kyle Foss
- Matthew Munns
- Rocherno De Jongh
- Yujing Song

Built on code from:
- Brian Caravantes
- K.K. Lamberty
- Joseph Thelen
- Nic McPhee
- Nick Bushway
- Nick Plucker
- Paul Friederichsen
- Shawn Seymour
