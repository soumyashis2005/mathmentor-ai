# 🧠 MathMentor AI

> An AI-powered mathematics learning platform that helps students understand mathematical problems through step-by-step solutions, verification, and interactive AI tutoring.

## ✨ Features

* 🧮 AI-powered step-by-step math solutions
* 🔬 Independent mathematical verification
* 🐍 Python + SymPy verification
* 🧠 Interactive AI Tutor
* 💡 Concept explanations
* 📝 Additional examples
* 🎯 Similar practice problems
* 🧠 AI-generated quizzes
* 📚 Solution history
* 🔐 JWT authentication
* 🌙 Dark & Light mode
* 📱 Responsive UI
* 📋 Copy Answer & LaTeX

## 🏗️ Architecture

```text
React + Vite
     │
     │ REST API
     ▼
Express + Node.js
     │
     ├──────► Gemini AI
     │
     ├──────► MongoDB Atlas
     │
     └──────► Python + SymPy
                    │
                    ▼
              Math Verification
```

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Axios
* React KaTeX
* CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* CORS
* dotenv

### AI & Mathematics

* Google Gemini API
* Python
* SymPy
* MathJS

## 📁 Project Structure

```text
MathMentor-AI/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── package.json
│   └── server.js
│
└── README.md
```

## ⚙️ Installation

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/mathmentor-ai.git
cd mathmentor-ai
```

### 2. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
PYTHON_ENGINE_URL=your_python_engine_url
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm start
```

### 3. Frontend

Open another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

## 🔐 Environment Variables

### Server

```text
PORT
MONGO_URI
GEMINI_API_KEY
PYTHON_ENGINE_URL
JWT_SECRET
```

### Client

```text
VITE_API_URL
```

> ⚠️ Never commit `.env` files or expose API keys, database credentials, or JWT secrets.

## 🚀 Deployment

The application can be deployed as separate services:

* **Frontend:** Vercel / Netlify
* **Backend:** Render / Railway
* **Database:** MongoDB Atlas
* **Python Engine:** Python-compatible hosting

Update the environment variables with your production URLs before deployment.

## 🔮 Future Improvements

* 📷 Image-based math solving
* ✍️ Handwritten equation recognition
* 🎙️ Voice input
* 📊 Learning analytics
* 🏆 Gamification
* 🌐 Multi-language support
* 👨‍🏫 Teacher dashboard

## 👨‍💻 Author

**Soumyashis Ghosh**
B.Tech Computer Science & Engineering
Brainware University

---

⭐ If you like the project, consider giving it a star!
