# 🧠 MathMentor AI

> An AI-powered mathematics learning platform that helps students understand and solve mathematical problems through step-by-step solutions, independent verification, image-based solving, and interactive AI tutoring.

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/API-Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Math%20Engine-Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![SymPy](https://img.shields.io/badge/Symbolic%20Math-SymPy-3B5526)](https://www.sympy.org/)

---

## 📌 Overview

**MathMentor AI** is a full-stack AI-powered mathematics learning platform designed to make mathematical problem solving more understandable, interactive, and reliable.

Instead of simply returning an answer, MathMentor AI generates **step-by-step explanations**, identifies the mathematical concept involved, and uses an independent **Python + SymPy mathematical engine** to verify symbolic solutions whenever possible.

The platform also supports **image-based mathematics solving**, allowing users to upload a picture of a mathematical problem and receive an AI-generated solution.

---

## ✨ Features

### 🧮 AI Mathematics Solver

- Solve mathematical problems using Google Gemini AI
- Step-by-step mathematical explanations
- Identify problem type and mathematical concept
- Generate final answers in LaTeX
- Support for different mathematical topics

### 📷 Image-Based Math Solving

- Upload an image containing a mathematical problem
- AI analyzes the uploaded image
- Extracts the mathematical question
- Generates a step-by-step solution
- Uses the same verification pipeline as text-based problems

### 🔬 Independent Mathematical Verification

MathMentor AI does not rely only on the AI-generated answer.

For supported mathematical problems, the system can independently verify results using:

- Python
- SymPy
- MathJS

This provides an additional mathematical verification layer.

### 🐍 Python + SymPy Math Engine

The external mathematical engine supports operations such as:

- Equation solving
- Quadratic equations
- Polynomial operations
- Factorization
- Expansion
- Simplification
- Derivatives
- Integrals
- Limits
- Matrix operations
- Determinants
- Systems of equations
- Symbolic verification

### 🧠 Interactive AI Tutor

After solving a problem, users can interact with the AI tutor through different learning modes:

- 💡 Explain the concept
- 📝 Generate another example
- 🎯 Generate a similar practice problem
- 🧠 Test understanding with a quiz

### 📚 Solution History

- Save solved questions
- View previous solutions
- Search solution history
- Filter solutions
- Delete individual solutions
- Clear solution history

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected API routes
- User-specific solution history

### 🎨 User Interface

- 🌙 Dark mode
- ☀️ Light mode
- 📱 Responsive design
- 📋 Copy answer
- 📐 Copy LaTeX
- Image preview before solving
- Clean mathematics rendering

---

## 🏗️ System Architecture

```text
                         ┌──────────────────────┐
                         │     React + Vite     │
                         │      Frontend        │
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │   Node.js + Express  │
                         │       Backend        │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ▼                                   ▼
           ┌─────────────────┐                 ┌─────────────────┐
           │   Google Gemini │                 │  MongoDB Atlas  │
           │       AI        │                 │    Database     │
           └────────┬────────┘                 └─────────────────┘
                    │
                    ▼
           ┌─────────────────┐
           │ Python + SymPy  │
           │ Math Verification│
           └─────────────────┘
```

---

## 🔄 How It Works

### Text-Based Problem

```text
User enters a math problem
          ↓
React Frontend
          ↓
Express REST API
          ↓
Google Gemini AI
          ↓
Step-by-step solution generated
          ↓
Python + SymPy verification
          ↓
Final verified response
          ↓
MongoDB
          ↓
Solution saved to history
```

### Image-Based Problem

```text
User uploads math image
          ↓
Image preview
          ↓
React Frontend
          ↓
Express REST API
          ↓
Gemini Vision
          ↓
Mathematical problem extracted
          ↓
AI generates solution
          ↓
Python + SymPy verification
          ↓
Solution displayed
          ↓
MongoDB
          ↓
Solution saved to history
```

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Axios
- React KaTeX
- CSS
- JavaScript

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- CORS
- dotenv
- Axios

### AI & Mathematics

- Google Gemini API
- Python
- SymPy
- MathJS

### Deployment

- Vercel — Frontend
- Render — Node.js Backend
- MongoDB Atlas — Database
- Python-compatible hosting — Math Engine

---

## 📁 Project Structure

```text
mathmentor-ai/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
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
├── math-engine/
│   ├── Python mathematical engine
│   └── SymPy verification
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the Repository

```bash
git clone https://github.com/soumyashis2005/mathmentor-ai.git
cd mathmentor-ai
```

---

## 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

PYTHON_ENGINE_URL=your_python_engine_url

JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

---

## 3. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create:

```text
client/.env
```

Add:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

---

# 🔐 Environment Variables

## Server

| Variable | Description |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PYTHON_ENGINE_URL` | Deployed Python math engine URL |
| `JWT_SECRET` | Secret used for JWT authentication |

## Client

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |

> ⚠️ **Never commit `.env` files to GitHub.**
>
> Never expose Gemini API keys, MongoDB credentials, or JWT secrets publicly.

---

# 🚀 Deployment

MathMentor AI can be deployed using separate services.

### Frontend

Deploy the React/Vite application using:

- Vercel
- Netlify

Set:

```env
VITE_API_URL=https://your-backend-url
```

### Backend

Deploy the Express server using:

- Render
- Railway

Configure the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
PYTHON_ENGINE_URL=your_python_engine_url
JWT_SECRET=your_jwt_secret
```

### Database

Use:

```text
MongoDB Atlas
```

for the production database.

### Mathematical Engine

The Python + SymPy engine can be deployed separately and connected to the Node.js backend using:

```env
PYTHON_ENGINE_URL=your_python_engine_url
```

---

# 🧪 Example Problems

MathMentor AI can handle problems such as:

### Quadratic Equation

```text
x² - 5x + 6 = 0
```

### Factorization

```text
x² + 5x + 6
```

### Derivative

```text
Find the derivative of x³ + 2x
```

### Integral

```text
∫ x² dx
```

### System of Equations

```text
2x + y = 7
x - y = 2
```

### Matrix

```text
Find the determinant of:

| 2  3 |
| 4  5 |
```

Users can also upload an image containing a mathematical problem.

---

# 🔎 Verification Pipeline

MathMentor AI uses multiple layers of mathematical processing.

```text
                    AI Generated Solution
                             │
                             ▼
                    ┌─────────────────┐
                    │ Solution Parser │
                    └────────┬────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │ Python + SymPy   │
                   │ Verification     │
                   └────────┬─────────┘
                            │
                            ▼
                    Independent Result
                            │
                            ▼
                   ┌──────────────────┐
                   │ Final Response   │
                   └──────────────────┘
```

When Python/SymPy verification is unavailable or unsuitable, the application can fall back to lightweight MathJS verification where appropriate.

---

# 🔒 Security

MathMentor AI uses several security mechanisms:

- JWT authentication
- Protected API routes
- Environment variables for secrets
- CORS configuration
- User-specific database records
- Server-side API key management

Sensitive credentials should always remain in environment variables.

---

# 📌 Current Status

### Completed

- [x] React frontend
- [x] Express backend
- [x] MongoDB integration
- [x] JWT authentication
- [x] AI mathematics solving
- [x] Step-by-step solutions
- [x] AI Tutor
- [x] Solution history
- [x] Mathematical verification
- [x] Python + SymPy integration
- [x] Image-based math solving
- [x] Dark/Light mode
- [x] Responsive UI
- [x] Copy Answer
- [x] Copy LaTeX
- [x] Production deployment

---

# 🔮 Future Improvements

Possible future improvements include:

- ✍️ Advanced handwritten equation recognition
- 🎙️ Voice-based mathematics input
- 📊 Learning analytics
- 🏆 Gamification
- 🌐 Multi-language support
- 👨‍🏫 Teacher dashboard
- 📈 Personalized learning recommendations
- 📷 Improved mathematical image preprocessing

---

# 👨‍💻 Author

## Soumyashis Ghosh

**B.Tech Computer Science & Engineering**  
**Brainware University**

GitHub:  
https://github.com/soumyashis2005

---

# ⭐ Support

If you find MathMentor AI useful, consider giving the repository a ⭐ on GitHub.

**Built with React, Node.js, MongoDB, Google Gemini, Python, and SymPy.**
