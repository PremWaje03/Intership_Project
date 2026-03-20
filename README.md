# Campus Project Hub

Campus Project Hub is a full-stack MERN application built to help students submit, explore, and improve project ideas in one centralized platform. Instead of project topics being scattered across notebooks, chats, or informal discussions, this system keeps them searchable, structured, and interactive.

It is designed as a college-ready showcase project and demonstrates practical work with MongoDB, Express.js, React, and Node.js.

## Project Aim

The main aim of this project is to create a student innovation board where users can:

- submit new project ideas
- search and filter ideas by domain, difficulty, and status
- like and comment on ideas
- view live analytics generated from MongoDB data

## Features

- Full CRUD operations for project ideas
- Search and filter support
- Idea likes and feedback comments
- Domain, difficulty, and status categorization
- Dashboard statistics using MongoDB aggregation
- Responsive frontend UI
- Error handling for backend and database connectivity

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Tooling: Nodemon, Concurrently

## Folder Structure

```text
Intership_Project/
|-- client/
|   |-- src/
|   |   |-- components/
|   |   |-- services/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- package.json
|   `-- vite.config.js
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- server.js
|   `-- package.json
|-- scripts/
|-- package.json
|-- package-lock.json
|-- .gitignore
`-- README.md
```

## How It Works

1. A user fills the project idea form in the React frontend.
2. The frontend sends the data to the Express API.
3. The backend validates and stores the data in MongoDB using Mongoose.
4. The frontend fetches ideas and displays them in a searchable idea feed.
5. Users can like ideas, add comments, update records, and delete records.
6. MongoDB aggregation endpoints generate dashboard statistics such as total ideas and total likes.

## Database Model

The main collection is `ProjectIdea`, which stores:

- `title`
- `domain`
- `difficulty`
- `status`
- `requiredSkills`
- `description`
- `createdBy`
- `likes`
- `comments`
- `createdAt` and `updatedAt`

## API Endpoints

```text
GET    /api/health
GET    /api/ideas
GET    /api/ideas/:id
POST   /api/ideas
PUT    /api/ideas/:id
DELETE /api/ideas/:id
POST   /api/ideas/:id/like
POST   /api/ideas/:id/comments
GET    /api/ideas/stats
```

## Local Setup

### Prerequisites

- Node.js
- npm
- MongoDB running locally

### Installation

```bash
npm install
npm run install-all
```

### Environment Setup

Create `server/.env` with:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_project_hub
```

### Run the Project

```bash
npm run dev
```

URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Available Scripts

```bash
npm run dev
npm run server
npm run client
npm run install-all
npm run report:docx
```

## Troubleshooting

- If Vite shows proxy errors, make sure the backend is running on port `5000`.
- If the app shows a MongoDB connection message, start your local MongoDB service.
- If ports `5000` or `5173` are already in use, stop old Node processes and restart.

## Why This Project Is Good For Presentation

- It solves a real student workflow problem.
- It shows both frontend and backend integration.
- It demonstrates MongoDB schema design and aggregation.
- It is more meaningful than a basic CRUD or todo app.

## Future Improvements

- JWT authentication
- Saved projects or bookmarks
- Image upload for project posters
- Pagination and advanced sorting
- Cloud deployment

## Author

Prem Waje
