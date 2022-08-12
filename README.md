<p>
  <h1 align="center">Sports day organiser</h1>
</p>

A comprehensive web application built for organising and signing up for sports days.

The project was built as an individual school project in consultation with a user. A comprehensive design document with design sketches, rationale and much more was made during the build process (synthesised in this README).

## 📝 Table of Contents

- [📝 Table of Contents](#-table-of-contents)
- [📔 Design Sketches <a name = "design"></a>](#-design-)
- [🖼️ Project Images <a name = "project_images"></a>](#-project-images-)
- [🚀 Future Scope <a name = "future_scope"></a>](#-future-scope-)
- [🏁 Getting Started <a name = "getting_started"></a>](#-getting-started-)
  - [Prerequisites <a name = "prerequisites"></a>](#prerequisites-)
  - [Running the project <a name = "running"></a>](#running-the-project-)
- [⛏️ Built With <a name = "tech_stack"></a>](#️-built-with-)
- [✍️ Author <a name = "author"></a>](#️-author-)

## 📔 Design Sketches <a name = "design"></a>

<p align="center"><img src="./images/Index.png" alt="Design sketch image 1" width="600"/></p>
<p>Home page (logged in as admin user)</p>

<details>
<summary>See More Images</summary>
<br>
<p align="center"><img src="./images/IndexStudent.png" alt="Design sketch image 2" width="600"/></p>
<p>Home page (not logged in)</p>
<p align="center"><img src="./images/ShowOld.png" alt="Design sketch image 3" width="600"/></p>
<p>Original sports day show page design</p>
<p align="center"><img src="./images/Show.png" alt="Design sketch image 4" width="600"/></p>
<p>Final sports day show page design (logged in as admin user)<br>After user consultation, legal GDPR requirements of only showing students their own data, as well as displaying and enforcing participant limits per house were brought to my attention, prompting changes in design
</p>
<p align="center"><img src="./images/New.png" alt="Design sketch image 5" width="600"/></p>
<p>Original new sports day page design (only accessible by admin)</p>
<p align="center"><img src="./images/NewCards.png" alt="Design sketch image 6" width="600"/></p>
<p>Final new sports day page design (only accessible by admin)<br>Based upon user feedback, suggesting that the app may be used on small screen sizes, the table layout was redesigned into a more responsive card layout</p>
<p align="center"><img src="./images/EventShowOld.png" alt="Design sketch image 7" width="600"/></p>
<p>Original event show page design</p>
<p align="center"><img src="./images/EventShow.png" alt="Design sketch image 8" width="600"/></p>
<p>Final event show page design (logged in as admin user)</p>
<p align="center"><img src="./images/EventShowStudent.png" alt="Design sketch image 9" width="600"/></p>
<p>Final event show page design (logged in as student)<br>The initial design proposed a login system only for admin users for permission purposes, however after legal requirements were considered, a login system for both students and teachers was designed</p>
<p align="center"><img src="./images/EntityRelationship.png" alt="Design sketch image 10" width="600"/></p>
<p>Application database relationship diagram</p>
</details>

## 🖼️ Project Images <a name = "project_images"></a>

Hello

## 🚀 Future Scope <a name = "future_scope"></a>

I may decide to add some of the following features in the future:
- ℹ️ Application home page with explanation of the application functionality as well as contact details could be added
- 📝 Export sports day to Excel or CSV file functionality. App should create spreadsheet including students names, houses...
- ⏱️ Scoring of sports day events
- 🎨 Alternative color schemes

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites <a name = "prerequisites"></a>

You must have node, npm, MongoDB and a browser downloaded. To be able to run the website, first you need to install the required dependencies with:

```
npm install 
```

### Running the project <a name = "running"></a>

You must first set up a master password using: 

```
node setup.js
```
To run the website you need to run the server using node:

```
node server.js
```
Messages verifying successful connection to the database and connection to localhost should be displayed. Then navigate to the website in the browser. Type the following url into the browser:

```
http://localhost:3000/
```
The website should be served to you by the server to view and use. You may also wish to seed the database with template events and some sports days: 

```
node seeds.js
```


## ⛏️ Built With <a name = "tech_stack"></a>

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - Programming language
- [NodeJS](https://nodejs.org/en/) - JS runtime environment
- [ExpressJS](https://expressjs.com/) - Server
- [EJS](https://ejs.co/) - Javascript templating engine
- [Bootstrap](https://getbootstrap.com/) - Styling
- [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) - Fancy animal icon buttons using hidden radio buttons
- [Mongoose](https://mongoosejs.com/) - Interface between JS and MongoDB database
- [PassportJS](https://www.passportjs.org/) - Authentication for Node.js
- [Joi](https://joi.dev/) - Server-side data validation
- [Sanitize-html](https://www.npmjs.com/package/sanitize-html) - HTML sanitisation API
- [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing library
- [Dotenv](https://www.npmjs.com/package/dotenv) - Loads environment variables for Node.js

## ✍️ Author <a name = "author"></a>

- [JakubRichardson](https://github.com/JakubRichardson)