#UCSB CS189A Fall 2015 - Winter 2016
Team: **Graphiq Content**  
Project Name: **Graphiq Reality**

##Revision History
10/9/2015 - Created PRD document and basic information.
10/16/2015 - Added User Stories.
10/21/2015 - Intro expanded and High Level System Architecture added.
11/23/2015 - Added more User Stories
11/24/2015 - Added UML Diagram


##Intro
**Graphiq Reality** is a website that will let you view data sets in 3-D and explore them in virtual reality using your phone. Not only can you view the data sets readily available on the website, but you can also import your own data in the form of a CSV file.

##Glossary of Terms
**Data Visualization** -  the presentation of data in a pictorial or graphical format.  
**Virtual Reality** - replicates an environment that simulates physical presence.  
**Google Cardboard** - a cardboard apparatus that holds phones and allow them to be used as a virtual reality device.  
**CSV** - comma separated values that store tabular data.  
**API** -​­ Application Program Interfaces are pieces of software that interact with other pieces of software.

##System Architecture: High­-Level Overview

Graphiq Reality is a web application hosted on Heroku. It is written entirely in javascript and uses Node.js and Express framework as its web server. The front end is made with Foundation framework. Data is stored inside a PostgreSQL relational database.

When a data visualization is requested, the server will query the database for the specified data and the data will be processed visually on the client-side. Filtering or altering the data through slides will also be processed by the server in the form of a database query and the visual will adjust accordingly. The user can also upload their own data in the form of a .csv file into the server temporarily and visualize it through our app.

For virtual reality, there is no separate Android or iPhone app necessary, as everything is contained in javascript through the browser. The user only need to go to the website through their phone, select their dataset and visualization model, and select the VR button. Then they are able to put their phone into a Google Cardboard device and interact with the visual through virtual reality.

##Technologies Employed
* CSS
* Express
* Foundation
* Google Cardboard
* Heroku
* HTML
* Javascript
* Node.js
* PostgreSQL
* Three.js
* WebVR

