# Flashcard Quiz App

## CodeAlpha Internship - Task 1

The Flashcard Quiz App is a simple web-based application that allows users to create, study, edit, and delete flashcards.

Each flashcard contains a question and an answer. The user can reveal the answer using the Show Answer button and navigate through different flashcards using Previous and Next buttons.

## Features

- Display flashcard questions
- Reveal answers
- Previous and Next navigation
- Add flashcards
- Edit flashcards
- Delete flashcards
- SQLite database
- Responsive user interface
- REST-style Flask API

## Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Python
- Flask

### Database

- SQLite

## Project Structure

CodeAlpha_Flashcard_Quiz_App/

├── app.py
├── requirements.txt
├── README.md
├── .gitignore
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js

## How to Run

### Step 1

Install Python.

### Step 2

Open the project folder in VS Code.

### Step 3

Create a virtual environment:

python -m venv venv

### Step 4

Activate the environment:

venv\Scripts\activate

### Step 5

Install Flask:

python -m pip install -r requirements.txt

### Step 6

Run the application:

python app.py

### Step 7

Open the browser:

http://127.0.0.1:5000

## Backend API

GET /api/flashcards

Returns all flashcards.

POST /api/flashcards

Creates a new flashcard.

PUT /api/flashcards/<id>

Updates an existing flashcard.

DELETE /api/flashcards/<id>

Deletes a flashcard.

## Database

SQLite is used to store flashcard information.

The database contains:

- id
- question
- answer

The database file is automatically created when the application starts.

## CRUD Operations

Create - Add a new flashcard.

Read - Display existing flashcards.

Update - Edit an existing flashcard.

Delete - Remove a flashcard.

## Objective

The objective of this project is to develop a simple and user-friendly flashcard application for studying and revision.

## Future Improvements

- Quiz mode
- Multiple-choice questions
- Score calculation
- User authentication
- Search functionality
- Flashcard categories
- Random flashcard mode
- Progress tracking