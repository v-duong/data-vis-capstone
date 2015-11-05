#UCSB CS189A Fall 2015 - Winter 2016
Team: **Graphiq Content**
Project Name: **Graphiq Reality**

##Revision History
10/09/2015 - Created PRD document and basic information.
10/16/2015 - Added User Stories.
10/21/2015 - Intro expanded and High Level System Architecture added.

##Intro
**Graphiq Reality** is a website that will let you view data sets in 3-D and explore them in virtual reality using your phone. Not only can you view the data sets readily available on the website, but you can also import your own data in the form of a CSV file.

##Glossary of Terms
**Data Visualization** -  the presentation of data in a pictorial or graphical format.
**Virtual Reality** - replicates an environment that simulates physical presence
**Google Cardboard** - a cardboard apparatus that holds phones and allow them to be used as a virtual reality device.
**CSV** - comma separated values that store tabular data.
**API** -​­ Application Program Interfaces are pieces of software that interact with other pieces of software

##System Architecture: High­-Level Overview

	Graphiq Reality is a web application completely hosted on Heroku. It is written all in javascript and uses Node.js as its web server. Data is stored inside a PostgreSQL relational database. Our application will detect whether the user is accessing the website on a browser or phone and adjust the site from normal to virtual reality accordingly. When a data visualization is requested, the server will query the database for the specified data and will process the data into the interactive graphic. Filtering or altering the data through slides will also be processed by the server and the visual will adjust accordingly.

##User Stories/Use Cases
(Draft 1: Need up to 10 of use cases or user stories) (Draft 2: 20 total!!)
0. As a user I want to connect to the website so that I can view the web application.
0. As a user I want to be able to view the data visuals through my desktop so that I do not necessarily need a VR device.
0. As a user I want to be able to view the data visuals through my Google Cardboard VR Device.
0. As a user I want to interact with the data through VR in order for a fully immersive experience.
0. As a user I want to be able to switch between data sets on my desktop using a drop down menu so that I can see multiple data sets.
0. As a user I want to be able to switch between data sets on my phone using symbol tracking so that I can see multiple data sets.
0. As a user I want to (filter) change the range of parameters shown in the data visualization so that I can further analyse the data.
0. As a user I want to import data through a .csv file into the application so that I can view my data visually.
0. As a user I want to be able to choose which data corresponds to which variables inside the data visualization.
0. As a user I want to choose which type of data visualization my imported data will go through.


##Prototype Code & Test Cases
https://github.com/v-duong/data-vis-capstone
https://limitless-taiga-3899.herokuapp.com/

##System Model
(N/A)

##Technologies Employed
* Javascript
* Node.js
* Heroku
* PostgreSQL
* HTML/CSS
* Three.js
* WebVR
* Google Cardboard
