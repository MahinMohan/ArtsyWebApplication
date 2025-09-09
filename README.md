🎨 Artsy Web Application

An online web application that allows users to search for artists, view details, and manage their favourite artists. The app integrates with the Artsy API and uses MongoDB for user authentication, session management, and favourites storage.

🚀 Tech Stack

Frontend: React + Vite (prebuilt in backend/dist)

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose)

Authentication: JWT + Cookies

Other Tools: bcrypt, cookie-parser, CORS

📂 Project Structure
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

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/your-username/ArtsyWebApplication.git
cd ArtsyWebApplication-master/backend

2️⃣ Install dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file inside the backend/ directory with the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ARTSY_CLIENT_ID=your_artsy_client_id
ARTSY_CLIENT_SECRET=your_artsy_client_secret
PORT=3000


For example, replace:

const client_id = "xxxxx";


with:

const client_id = process.env.ARTSY_CLIENT_ID;

4️⃣ Run the backend server
npm start


The backend will start on:
👉 http://localhost:3000

5️⃣ Run the frontend

The frontend is already built and served from the backend’s dist folder.
Just visit:
👉 http://localhost:3000 in your browser.



🔑 Features

✔️ Search artists via the Artsy API
✔️ View detailed artist information
✔️ User authentication (JWT + cookies)
✔️ Save favourite artists to MongoDB
✔️ Secure API endpoints with middleware

📦 Deployment

The repo includes app.yaml for Google App Engine deployment.

To deploy:

gcloud app deploy backend/app.yaml

🛠️ Scripts

Inside backend/ directory:

npm start → Run the server

🤝 Contributing

Fork this repo

Create a new branch (feature-xyz)

Commit your changes

Push to your fork and submit a PR
