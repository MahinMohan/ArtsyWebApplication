# Artist Web Search

<br>
<img width="1470" height="800" alt="Screenshot 2025-09-11 at 10 28 57 PM" src="https://github.com/user-attachments/assets/fb99e429-a4b3-47a7-be67-d5519fc26f9f" />

<img width="1470" height="797" alt="Screenshot 2025-09-11 at 10 29 27 PM" src="https://github.com/user-attachments/assets/38760d3f-5c5c-4e63-914e-ff517d37eee5" />

This project is a web application that allows users to explore artists, their artworks, and manage their favorite artists. It is built using **React + Vite** for the frontend and **Node.js** for the backend.

# Live Demo

[Artist Web Search Application](https://artsy-web-application.vercel.app/)

## Features

- Search for artists and artworks
- View detailed artist information
- Manage favorite artists
- Responsive design for mobile and desktop

## Overview

Artist Web Search is a **full-stack, cloud-deployed web application** combining a **React + Vite** frontend with a **Node.js Express** backend. It extends the artist search and discovery platform by integrating advanced features such as user authentication, favorites management, and detailed artwork categorization—all powered by the Artsy API and hosted on Google Cloud Platform.

**Technology stack:**

- **Frontend:** React + Vite (prebuilt in `backend/dist`)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT + Cookies
- **Other Tools:** bcrypt, cookie-parser, CORS

## Skill Highlights

- **Frontend Engineering:** Developed with **React + Vite**, TypeScript, and **Bootstrap 5** to create a fully responsive, mobile-first UI. Demonstrates mastery of React components, hooks, routing, state management, and efficient API integration for seamless communication with the backend.
- **Backend Development:** Built with **Node.js** and **Express.js**, featuring RESTful API endpoints that securely interface with the Artsy API, perform data aggregation, and handle robust user authentication with **JWT tokens and HTTP-only cookies**.
- **Cloud Deployment:** Deployed both frontend and backend on **Google Cloud Platform (GCP)**, showcasing skills in cloud hosting, configuration, and environment management for scalable, production-grade applications.
- **Database Integration:** Utilizes **MongoDB** (via Mongoose) to persist user data including registration details, login credentials (securely hashed with bcrypt), and personalized favorite lists with timestamped entries.
- **Security & State Management:** Implements authentication middleware, guards routes, sustains session and auth state across reloads and tabs, and manages data consistency between client and server.
- **Advanced UI Features:** Two-tab artist detail views include detailed artist info and dynamically fetched artworks with rich categorization modals. Includes interactive favorites toggling and real-time notifications using stackable Bootstrap toasts.
- **Error Handling & UX:** Comprehensive UI feedback for search errors, empty results, missing artwork categories, and authentication validation errors, providing robust user experience.

## Folder Structure

```
ArtsyWebApplication-master/
│── backend/            # Backend Express API + frontend build
│   ├── database/       # MongoDB models & connection
│   ├── dist/           # Prebuilt frontend (Vite build)
│   ├── middleware.js   # Auth middleware
│   ├── server.js       # Express app entry point
│   ├── package.json    # Backend dependencies
│   └── .env            # Environment variables (edit this)
│
├── package.json        # Root (minimal, only dayjs)
└── README.md           # (This file)
```

## Architecture

- **Frontend:** React + Vite (prebuilt in `backend/dist`). TypeScript and Bootstrap 5 for a fully responsive, mobile-first UI with strong component architecture, state management, routing, and efficient API integration.
- **Backend:** Node.js Express server managing authentication, JWT session handling, MongoDB data persistence (Mongoose), proxying Artsy API calls, and serving frontend static files from `dist`.
- **Database:** MongoDB via Mongoose for storing user profiles, favorites, and application state.
- **APIs:** Artsy REST endpoints (Authentication, Search, Artists, Artworks, Genes/Categories).

## Features

- Secure **user registration and login** with password hashing (bcrypt) and JWT-based sessions (cookies).
- **User profile management** with persistent authentication state and avatar integration via Gravatar.
- Artist search with paginated results, clickable cards showing detailed artist info and artworks.
- Artwork category modals supporting dynamic category retrieval from Artsy API.
- Favorites list management with add/remove functions and sorted display by addition time.
- Responsive design compatible with various screen sizes and devices.
- Global notification system with real-time feedback on user actions.

## Prerequisites

Before deploying or running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Google Cloud SDK](https://cloud.google.com/sdk)
- A Google Cloud project with billing enabled

## Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/ArtsyWebApplication.git
cd ArtsyWebApplication-master/backend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file inside the `backend/` directory with the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ARTSY_CLIENT_ID=your_artsy_client_id
ARTSY_CLIENT_SECRET=your_artsy_client_secret
PORT=3000
```

For example, replace:

```js
const client_id = "xxxxx";
```

with:

```js
const client_id = process.env.ARTSY_CLIENT_ID;
```

### 4️⃣ Run the backend server

```bash
npm start
```

The backend will start on:
👉 **http://localhost:3000**

### 5️⃣ Run the frontend

The frontend is already built and served from the backend’s `dist` folder. Just visit:
👉 **http://localhost:3000** in your browser.

## Deployment Steps

Follow these steps to deploy the application to Google Cloud Run using the `deploy_cloud_run.sh` script:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd artsy3
```

### 2. Install Dependencies

Navigate to the `frontend` and `backend` directories and install dependencies:

```bash
cd frontend
npm install
cd ../backend
npm install
cd ..
```

### 3. Build the Frontend

Build the React (Vite) frontend for production:

```bash
cd frontend
npm run build
cd ..
```

Then copy the build output to `backend/dist` (or run your project’s copy script if you have one).

### 4. Deploy to Google Cloud Run

Run the `deploy_cloud_run.sh` script to deploy the application:

```bash
./deploy_cloud_run.sh
```

### 5. Access the Application

Once deployed, the script will output the URL of the deployed application. Open the URL in your browser to access the app.

## Deployment Script: `deploy_cloud_run.sh`

The repo includes `app.yaml` for Google App Engine deployment.

To deploy:

```bash
gcloud app deploy backend/app.yaml
```

## Scripts

Inside `backend/` directory:

- **`npm start`** → Run the server

## Contributing

1. Fork this repo
2. Create a new branch (`feature-xyz`)
3. Commit your changes
4. Push to your fork and submit a PR
