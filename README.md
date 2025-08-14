# 🌍 Country Information App – Backend (TypeScript)

## 📖 Overview
This is the TypeScript backend API for the Country Information App.  
It handles user authentication, country data fetching from [REST Countries API](https://restcountries.com/), and secure endpoints for the frontend.

---

## 🛠 Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Axios (for external API calls)
- CORS

---



## 🚀 Installation & Setup

### **1️⃣ Install Dependencies**
```bash
npm install
2️⃣ Environment Variables
Create a .env file in the backend root:
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=supersecret
JWT_EXPIRE=7d
BASE_URL=https://restcountries.com/v3.1
LOCAL_FRONTEND_URL=http://localhost:5173
FRONTEND_URL=https://your-production-frontend.com
🔍 What Each Variable Does


3️⃣ Run the Server
Development Mode (with hot reload)

npm run dev
Production Build

npm run build   # Compiles TypeScript to JavaScript
npm start       # Runs the compiled JS
Backend will be running at:
http://localhost:5000
