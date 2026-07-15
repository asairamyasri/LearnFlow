# 📚 LearnFlow

LearnFlow is a full-stack web application that helps learners organize all their learning resources in one place. Instead of keeping YouTube videos, documentation, articles, PDFs, and coding problems scattered across different platforms, users can group them into collections, track their understanding, and receive personalized revision reminders based on their confidence level.

The project is designed to make self-learning more organized, consistent, and efficient.

---

## 🌐 Live Demo

**Frontend:** https://learn-flow-xi-nine.vercel.app

**Backend API (Swagger):** https://learnflow-bos1.onrender.com/docs

> **Note:** The backend is hosted on Render's free tier. The first request may take 30–60 seconds while the server wakes up.

---

## 📸 Screenshots

### Login

![Login](client/public/login.jpeg)

### Register

![Register](client/public/register.jpeg)

### Dashboard

![Dashboard](client/public/dashboard.jpeg)

### Collections

![Collections](client/public/collections.jpeg)

### Resources

![Resources](client/public/resource.jpeg)

---

## ✨ Features

- 🔐 Secure user authentication (JWT Authentication)
- 📂 Create and manage learning collections
- ➕ Add learning resources to collections
- ✏️ Edit existing resources
- 🗑️ Delete resources
- 🔗 Save useful learning links
- ⭐ Rate confidence for every resource (1–3)
- 📅 Automatic revision reminders based on confidence level
- 📊 Dashboard showing resources due for revision
- 👤 User-specific data isolation
- 📱 Responsive and clean user interface

---



---

# 🛠 Tech Stack

## Frontend

- React
- TypeScript
- Vite
- CSS

## Backend

- FastAPI
- Python
- SQLAlchemy

## Database

- SQLite

## Authentication

- JWT (JSON Web Tokens)

## Deployment

- Frontend: Vercel
- Backend: Render

---

# 🏗 Architecture

```
React + TypeScript
        │
        ▼
FastAPI REST API
        │
        ▼
SQLAlchemy ORM
        │
        ▼
SQLite Database
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/asairamyasri/LearnFlow.git
cd LearnFlow
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Linux/macOS
source venv/bin/activate

# Windows
venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

# 📂 Project Structure

```
LearnFlow
│
├── backend
│   ├── app
│   ├── requirements.txt
│   └── ...
│
├── client
│   ├── src
│   ├── public
│   └── ...
│
├── images
│
└── README.md
```

---

# 📌 Roadmap

- ✅ User Authentication
- ✅ JWT Authorization
- ✅ Collections Management
- ✅ Resource CRUD Operations
- ✅ Confidence Rating System
- ✅ Automatic Revision Scheduler
- ✅ Personalized Dashboard
- ✅ Responsive UI


---

# 💡 Motivation

Many learners save resources across multiple platforms—YouTube, blogs, documentation, coding websites, and PDFs—but often forget where they saved them or when to revisit them.

LearnFlow addresses this by providing a centralized platform where users can organize resources, track their understanding, and receive simple spaced-review reminders to reinforce learning.

---



# 👩‍💻 Author

**Annapureddy Sai Ramyasri**

GitHub: https://github.com/asairamyasri

---

## ⭐ Support

If you found this project interesting, consider giving it a ⭐ on GitHub!
