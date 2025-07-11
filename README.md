# 🧠 Quiz Management System

A full-stack Django web application that allows **teachers** to create quizzes with different question types and **students** to take them within a time limit. Scores are automatically calculated and results are shown immediately after submission.

---

## 📌 Features

### 👩‍🏫 Teacher Features
- Register/Login with teacher role
- Create quizzes with:
  - Title
  - Duration (minutes)
  - Start/end date
- Add questions:
  - Multiple Choice (MCQ)
  - True/False
  - Written
- View all their created quizzes
- View student submissions with answers and scores

### 👨‍🎓 Student Features
- Register/Login with student role
- View available quizzes
- Take quizzes with a timer (auto-submits on timeout)
- Submit answers and get auto-evaluated
- View detailed results (question, your answer, correct answer, correctness)

---

## ⚙️ Technologies Used

- **Backend:** Django, Django REST Framework
- **Frontend:** HTML, CSS, JavaScript
- **Database:** SQLite (easily switchable to PostgreSQL or MySQL)
- **Authentication:** Token-based via DRF
- **Other:** FontAwesome, Fetch API, CSRF protection

---

## 🛠️ Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app

## 🔍 API Documentation

This project includes interactive API documentation using **Swagger** and **ReDoc**:

- [Swagger UI](http://localhost:8000/swagger/) – for testing and exploring endpoints
- [ReDoc UI](http://localhost:8000/redoc/) – clean, read-only API documentation

> Make sure the Django server is running and you're logged in (if endpoints require authentication).

