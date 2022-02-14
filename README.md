## Project Description:
=======================

This application helps you keep your job hunt organize and easy to keep track of. I am using cells for job applications and columns as their container which represents checkpoints of course you can move stuff around and everything is customizable.

- App Screenshot:

![Job-Board-Tracker-Screenshot](https://user-images.githubusercontent.com/47344044/153897086-d2a8bf10-b95b-4da4-b065-31594da9d000.png)

## How to Use:
==============

Notes: 

This application is a web app it requires an always running server to work. fellow the installation steps and start with the back-end 

- Fork and clone or Download and extract zip file*.

- Cd to the cloned repo or navigate to the extract folder*.

- Open your terminal or command prompt and enter "npm install" then "npm run" *.

*Both (repos or folders Back-end and Front-end)


## Links:
=========

- Front-end repo [Link](https://github.com/aymammeri/job-applications-board-tacker).

- Api Deployment [Link](https://thawing-anchorage-80200.herokuapp.com).

- Github Pages [Link](https://aymammeri.github.io/job-applications-board-tacker/).


## Technologies Used:
=====================

- MongoDB/Mongoose

- ExpressJS

- ReactJS

- NodeJS

## Stretch Goals & Unsolved Problems(updated):
==============================================

- Implementation of Drag and Drop feature.

- Refactor the code base to use React Redux/toolkit.

## Wire-frames & ERD:
=====================

![JobHunt-Board-Tracker-Wireframe](https://media.git.generalassemb.ly/user/40249/files/2c026f00-88c3-11ec-8c48-d49a53dd78da)

ERDs:

![JobHunt-Board-Tracker-ERDs](https://media.git.generalassemb.ly/user/40249/files/260c8e00-88c3-11ec-8a06-24269eaf55d0)

## API Routes Catalog:
======================

GET routes:

- getBoard "/board" respond with board object.

- getColumn "/column/:id" respond with the corresponding column.

POST routes:

- signUp "/sign-up" respond with status code and success/failure message

- singIn "/sign-in" respond with status code and success/failure message

- createColumn "/column" respond with status code and success/failure message

-createCell "/cell" respond with status code and success/failure message

PATCH routes:

- changePassword "/change-password" respond with status code and success/failure message.

- editColumn "/column/:id" respond with status code and success/failure message.

- editCell "/cell/:id" respond with status code and success/failure message.

DELETE routes:

- signOut "/sign-out" respond with status code.

- deleteColumn "/column/:id" respond with status code and success/failure message.

- deleteCell "/cell/:id" respond with status code and success/failure message.
