# Calendar Task Manager

A simple calendar task management application built with **React, TypeScript, Node.js and MongoDB**.

The application displays a monthly calendar grid where users can create and manage tasks directly inside calendar days. Tasks can be edited inline, reordered within the same day, or moved between days using drag and drop.

The calendar is implemented manually without using any calendar libraries.

Public holidays are displayed for each day using the Nager.Date API:
https://date.nager.at

Tasks are stored in MongoDB and managed through a REST API built with Express.

## Running the project

Clone the repository and install dependencies.

### Backend

```
cd server
npm install
npm run dev
```

The server will run on the port specified in `.env`.

### Frontend

```
cd client
npm install
npm run dev
```

The frontend will start the development server and connect to the backend API.

## API

```
GET /tasks
POST /tasks
PUT /tasks/:id
DELETE /tasks/:id
```

## Tech stack

React
TypeScript
Node.js
Express
MongoDB
