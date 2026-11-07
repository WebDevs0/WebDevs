# ResolveIT

## Authors And Individual Roles

- **Joshua McNealy:** Frontend Developer/UI Designer for Student Side; Scrum Leader
- **Samuel Afon:** Backend/Database Developer for Staff Side; Documentation
- **Darold Amanor:** Frontend/UI Designer for Staff Side
- **Jordan Bussa:** Backend/Database Developer for Student Side

## Course Information WebDevs

- **Course:** CSCE 4905
- **Section:** Section 001
- **Semester:** Fall 2026
- **SCRUM Meeting Times:** MON 1:50 PM - 2:05 PM & WED 6:30 PM - 6:45 PM
- **Trello Board:** https://trello.com/invite/b/6aa1b7ca4a5962c96f11066e/ATTI33bb527354e13a5ca3a0bce35cd4e99144E41091/webdevs-trello

## Overview

ResolveIT is a campus IT helpdesk for UNT. Students can sign in with their my.unt.edu email, submit an IT support ticket in a few short steps, and choose whether it's a physical issue (like a broken lab computer or projector) or a general issue (like Wi-Fi or account access). IT staff can see submitted tickets in a staff queue and search and filter them to find what they need.

## Tech Stack

- **HTML, CSS, JavaScript:** Used for the student pages, staff dashboard, and sign in pages
- **Node.js:** Used as the backend to communicate with everything else
- **Express.js:** Used to run the backend server and its API routes
- **PostgreSQL:** Used for the database to store tickets and user accounts
- **bcrypt and jsonwebtoken:** Used to protect passwords and keep users signed in

## Features

**Ticket Submission:** This feature lets students open a ticket in three steps: pick a physical or general issue (with building and room for physical issues), choose a category and describe the problem, then check everything before submitting. Students get a ticket number when it's saved.

**Staff Ticket Queue:** This feature shows IT staff every submitted ticket, with search by ticket ID or requester and filters for status, priority, and category.

**Sign In and Create Account:** This feature lets students and staff create an account and sign in. Only my.unt.edu emails are allowed, both emails must match, first and last name are required, and passwords must be at least 8 characters. After signing in, students go to the student dashboard and staff go to the staff queue.

**Student Dashboard:** This feature gives students a home page with action cards for Open a Ticket, My Tickets, Knowledge Base, and FAQ.

## Requirements to run

- Latest Node.js installed
- PostgreSQL installed
- Express.js installed (can use "npm install express")
- bcrypt must be installed (can use "npm install bcrypt")
- Visual Studio Code with the Live Server extension
- Linux, Windows, and macOS environments should all work

## Building the Project

First create the database. Open SQL Shell (psql), sign in, and run:

```sql
CREATE DATABASE resolveit;
\c resolveit
\i 'C:/path/to/WebDevs/student_backend/db/migrations/001_create_tables.sql'
```

Then create a file named `.env` in the top WebDevs folder (never commit this file, it has your database password):

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/resolveit
PORT=5001
JWT_SECRET=any-long-random-text
```

To run the backend, first change to the backend folder by doing the command below:

```bash
cd student_backend
```

Then install the packages (first time only):

```bash
npm init -y
npm install express cors pg dotenv bcrypt jsonwebtoken
```

Then to actually run the backend server run:

```bash
node src/server.js
```

And then to load the frontend, in Visual Studio Code right click any .html file in the login, student_frontend, or staffside folder and click "Open with Live Server".

## Testing

We test each sprint by hand against our test plan, which traces every test case to a requirement ID (for example TC-R1-001 for R1 Submit a Ticket). Results for each sprint are recorded in our Test Plan Tracker and marked as pass, partial, or fail.

## Project Structure

- **login:** Shared sign in and create account pages for students and staff
- **student_frontend:** Main student folder that contains the student dashboard and the Open a Ticket page
- **staffside:** Main staff folder that contains the staff dashboard and ticket queue
- **student_backend:** Main backend folder that runs the server and contains the ticket database tables
    - **server.js:** Contains all API routes for submitting and viewing tickets
    - **001_create_tables.sql:** Creates the users and tickets tables
- **auth-backend:** Contains the sign up and sign in logic
    - **validators:** Checks the sign up and sign in rules
    - **services:** Hashes passwords and creates login tokens
    - **routes:** The register and login API routes

## Project Tree

Here is the main file tree

```
WebDevs
├── README.md
├── auth-backend
│   ├── controllers
│   │   └── authController.js
│   ├── db
│   │   ├── migrations
│   │   │   └── 001_create_users.sql
│   │   └── pool.js
│   ├── repositories
│   │   └── userRepository.js
│   ├── routes
│   │   └── authRoutes.js
│   ├── services
│   │   └── authService.js
│   └── validators
│       └── authValidator.js
├── login
│   ├── login.css
│   ├── login.html
│   ├── login.js
│   └── register.html
├── staffside
│   ├── css
│   │   └── style.css
│   ├── index.html
│   └── js
│       └── script.js
├── student_backend
│   ├── db
│   │   └── migrations
│   │       └── 001_create_tables.sql
│   └── src
│       └── server.js
└── student_frontend
    ├── student_dashboard.css
    ├── student_dashboard.html
    ├── submit_ticket.css
    ├── submit_ticket.html
    └── submit_ticket.js
```
