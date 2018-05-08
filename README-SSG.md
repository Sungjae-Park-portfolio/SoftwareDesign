# CSCI 3601 Production Template -- Spring 2018 Iteration 4 Notes
[![Build Status](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group.svg?branch=master)](https://travis-ci.org/UMM-CSci-3601-S18/iteration-4-secure-super-group)
<!-- TOC depthFrom:1 depthTo:5 withLinks:1 updateOnSave:1 orderedList:0 -->
## Table of Contents
- [Project Description](#project-description)
- [LogIn Notes](#login-notes)
- [Developer Side Notes](#developer-side-notes)
- [Future Improvement](#future-improvement)
- [Pamphlet](#pamphlet)
- [Credits](#credits)
<!-- /TOC -->

## Project Description
Sunshine Journal is a web app where users can log and track their mood, set goals and write journals. Sunshine journal is meant for anybody who thinks keeping track of their mood is beneficial, and/or helping they keep up with certain goals and express themselves by writing journals.

### Tools Used
The tools we used consisted primarily of HTML, CSS, and Typescript was used in conjunction with Angular 5.  Angular Material were used with HTML and CSS for design.
For the backend, we have used Java, where a Java Spark server interacts with MongoDB. Java unit testing was used for the backend. 
Angular CLI and Yarn were used to manage builds and dependencies. And, Karma and Jasmine were used for front end testing.
Gradle have been used to manage launching local tasks.

## LogIn Notes

- Click `Sign In` on the top left corner under the `Home` button and sign in using your Google account.

## Developer Side Notes

#### Emoji Carousel:

This feature is the main function of the website. This allows users to select an emotion from a selection of five by navigating left or right. From the selected emotion the user can then select an intensity by navigating up or down. 
The user is able to either use the arrow buttons to navigate through or by 'swiping' through by click and dragging within the emoji selection area. This function makes more sense on a phone but still works on either.
Once a user has selected an emoji they are able to submit it. Once submitted the entry is saved in the database and the user is prompted in a popup window that allows them to view a YouTube video if they would like.
Each different emoji including the various intensity is assigned a text that is displayed below to clarify what each emoji represents.

Each time an emoji is sent to the database these fields are stored:
- `_id: string;`
- `userID: string;`
- `ownerFirstName: string;`
- `mood: number;`
-  `intensity: number;`
- `date: Date;` <br />
<br />
These parameters are defined within the `emoji.ts` file

The function of moving through the moods as well as intensity can be found in the `home.component.html` (see Control Gestures in html)
The function of wrapping around for moods and intensity can be found in the `home.component.ts` (see `parseSwipeDirection` and `parseEmotionIntensity`)

Files related to this function can be found within:
- `home.component.html`
- `home.component.ts`
- `home.service.ts`

#### Responses:

Responses are given to the user after they submit an emotion on the home page and click the `Get a Response` button. 

A response is a link (as of now, only YouTube videos, but it could be changed to accommodate any kind of link) that is helpful to the user in some way. There is a set of default responses seeded into the database that is accessed by default whenever the user gets a response. 


The system accounts for possible bad links by checking the URL with commons-validator. It also converts YouTube watch links to embedded links so they can be viewed in the webpage itself.

The user can also add responses that can show up for themselves only, but have a random chance to be selected. 

Note that in order to have getting a random response to work correctly, MongoDB on your deployed server needs to be at least version 3.6, because of the way that the random responses work. 

#### Reports:

Reports provides a line chart and a stacked bar plot based on users’ emotion selection in home page.  Stacked bar plot shows up when the tab “Bar plot” is selected, and if you want to switch to check the line chart, select the “Line chart” tab.

Both line chart and bar plot are default to show the frequency of users’ chosen emotion in each day of this week (Monday to Sunday).  Different colors of lines/bars response to different emotions, legends on the top of each plot shows the correspondence between colors and emotions.  Click the legends can filter the relative emotions in the current plot.  For getting the yearly report, choose `year` in the dropdown above the plots tab, then click `submit`.  For getting more flexible historical report, please choose `start date` and `end date` first, then using dropdown to choose `year` or `week` click `submit`.

We used `chart.js` for making both plots, scripted it in html file with src: https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js  
Bar plot and line chart are using the same canvas but with different type (Line chart with type `line`, but bar plot with type `bar` and set stacked as `true` in both x-axes and y-axes).  

Filtering by `date` and `mood` in `emoji` stored in the database and get the length of emoji list left after filtering to get the frequency of a emotion.  Noticed that date filter happened before mood filter, and get frequency of all emotions in current week is a default setting.

#### Goals:

The Goals' page is where users can set up goals that they want to do. To set up a new a goal is really easy, the user needs to just click on `Add a Goal` button, where a dialog will pop up. Here, users need to choose a name for their goal, choose a start and end date, choose a category for their goal (The four categories you can choose from are: Chores, Health, Social, Other), and lastly, they need  to choose the frequency of the goal. For the fields of Goal, only `Name`is a required field, all the other fields are optional. 

The Goals' page contains three tabs `Incomplete Goals`, `All Goals`, and `Completed Goals`. As the names suggest, under `Incomplete Goals`, the user will find goals that are not completed, under `Completed Goals`, the user will find goals that have been completed, and under `All Goals`, the user will find all of the goals that the user has created.

To complete a goal, users need to click on the checkmark button on the goal. Users can also edit goals that have not been completed, by clicking on the edit button on the goal. Users can edit all of the fields of the goal that they want to.

Lastly, there is also a filter on the Goals' page, where users can filter goals by the fields in the goal. When users input some text in the filter, it will look for the inputted text in `Name`, `Category`, and `Frequency` of the goals simultaneously. So, it will return the goals where their `Name`, `Category`, or `Frequency` contains the inputted text, according to the tab that is selected.

#### Journaling:

Journals provide a place where users can post their journals. So, users can write why they were happy or angry that day and which makes them angry or happy, or they can just write anything in general. Users can easily add a journal by clicking the `Add a New Journal` button. When you are writing a journal, you can write as much as you want, without having to worry that your text entry will exceed the text box, also we have a scrolling bar that makes it easy to navigate through your entered text when writing a journal.

Users can view their submitted journals, by clicking on the `View` button, and edit their journals, by clicking on the `Edit` button, when they want to.

Users can search through their journals by `Subject` of the journal and by `Body`, which is the text entered for a journal. Another feature that we have for the Journaling page, is that we have navigation buttons. At most 10 journals will be shown on the Journaling page each time. Users can click on the right and left arrow to move to the next and previous page, respectively. We also have a "go the first page" button, and a "go to the last page" button, which are the left most and right most navigation buttons, respectively. 

#### Resources:

This page has all the three important phone numbers. Clients can refer to them whenever they want to.

It also has some basic page links that helps you if you are feeling anxiety to anger.

The goal was to consolidate the resource page where you could add your own resource pages and your own sets of contacts so that it would show up in one page.

#### Contact:

In the contact's page, users can find all of their contacts. Users can easily add a contact by clicking the `Add your own contact` button. When this button is clicked, a dialog will pop up where users can put in the name of the contact, email of the contact, and the phone number of the contact. Users can edit the contact, and users can also delete the contact by clicking the `Delete Contact` button. An additional feature that we have is that users can favorite the contact by clicking the heart button on the contact. When the contact is favorite, the contact will appear in the `crisis` button pop up. If users do not want a contact to appear in the `crisis` button pop up anymore, users can do this easily by removing the contact from favorites, by simply clicking the heart button on the contact again. It is easy to check when a contact is favorited, because the heart on the contact looks darker, so it looks like that it has been clicked. 

#### Crisis:

When the bright red `crisis` button is clicked, it will show a pop up containing the suicide prevention lifleline, and the crisis hotline. Additionally, all of the users' favorited contacts will also show up in this pop up.

## Future Improvement

#### Reports:

1. Providing more time filters.  We have weekly and yearly report so for in report page, we will provide monthly and hourly filter in the future.

2. Scatter plot will be provided to show the intensity information.  We have two plots to show the emotional frequency, but users cannot check the intensity history report, we will provide a scatter plot to show the historical intensity of each emotion.

#### Mobile Optimization:

1. Remove/hide the navigation buttons on the home page when a user is on mobile. We have the swipe feature and it would free up space.

2. Improve the sizing for charts on mobile. The actual chart part looks ok but the filter area could use some work.

3. Possibly change view of goals on mobile. Currently card view is used but that uses a lot of space so you are only able to view one or two goals at a time depending on the size of your mobile screen.

4. Journal mat-card-main. This needs to be fixed so that it fits around all of the journals being displayed. This has a similar issue to the goals as both are card view.

5. Change menu to a more standard mobile navigation. As is on small devices we run out of space with separate icons for each menu item. We also have a duplicate phone icon, one for crisis button and one for contacts. I feel like this is confusing to the user and should be changed in the future.

6. Fix the window centering for adding new items. When a new goal or new response window opens it is justified left. This should be changed to be centered.

7. Simplify goals on mobile. There are many options for goals right now. I think it would be nice to have a simple title and category with a show more options to save on space.

8. Give the embedded videos an option to go to fullscreen.

9. The user has to scroll to fully see the embedded video, this needs to be changed so it shows the entire video without the need of scrolling.

#### Resource Page:

1. Have a section for users to view/delete videos they have added to embedded videos.

2. Give users the option to create/select different playlists for their embedded videos.

3. We want to also integrate the contact page with the resource page such that the users can find all useful information in one place. 

#### Goals Page:

1. We want to make it that users can get notifications/reminders for their daily goals. 

2. Additionally, for a goal that is getting close to the end date, we want to make it possible that users receive push notifications that the end day of their goal is getting close.

#### Journaling Page:

1. Update the journals such that they look more consistent with the rest of web page.

2. Make the `Subject` and `Body` filter into one combo filter, so when a text is entered in the filter, it looks through both the subject and body of the journals simultaneously.

#### Contact Page:

1. Update the contacts to show them in a more useful way.

2. Make it such that when a contact is favorited, the heart turns red, instead of a darker grey.

#### HTTPS Support:

Unfortunately, we weren't able to get https to work on our project. If in the future someone wants to add https to the project, [click here to go to that documentation](https://github.com/UMM-CSci-3601-S18/iteration-4-megabittron/blob/master/Documentation/HTTPS.md)

## Pamphlet

Link: https://docs.google.com/document/d/1mRzK-fZytXP5xbv3Fp5vLWHSLybcmTmnJOCOY430QX0/edit?usp=sharing

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
- Rocherno de Jongh
- Yujing Song
- Sungjae Park

Built on code from:
- Brian Caravantes
- K.K. Lamberty
- Joseph Thelen
- Nic McPhee
- Nick Bushway
- Nick Plucker
- Paul Friederichsen
- Shawn Seymour
