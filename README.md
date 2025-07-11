🧠 Quiz Management System
A full-stack Django web application that allows teachers to create quizzes with different question types and students to take them within a time limit. Scores are automatically calculated and results are shown immediately after submission.

📌 Features
👩‍🏫 Teacher Features
Register/Login with teacher role

Create quizzes with:

Title

Duration (minutes)

Start/end date

Add questions:

Multiple Choice

True/False

Written

View all their created quizzes

View student submissions with answers and scores

👨‍🎓 Student Features
Register/Login with student role

View available quizzes

Take quizzes with a timer (auto-submits when time runs out)

Submit answers and get auto-evaluated

View detailed results (answers, correctness, score)

⚙️ Technologies Used
Backend: Django, Django REST Framework

Frontend: HTML, CSS, JavaScript (Vanilla)

Database: SQLite (can be switched to PostgreSQL or MySQL)

Authentication: Token-based (DRF TokenAuthentication)

Other Tools: FontAwesome, Fetch API, CSRF protection

🛠️ Installation
Clone the repository

bash
Copy
Edit
git clone https://github.com/yourusername/quiz-system.git
cd quiz-system
Create and activate virtual environment

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
Copy
Edit
pip install -r requirements.txt
Apply migrations

bash
Copy
Edit
python manage.py makemigrations
python manage.py migrate
Create a superuser

bash
Copy
Edit
python manage.py createsuperuser
Run the development server

bash
Copy
Edit
python manage.py runserver
Access the app

Frontend: http://127.0.0.1:8000/app/

Admin Panel: http://127.0.0.1:8000/admin/

🧪 Testing
Use Postman or the frontend UI to test:

Registering and logging in

Creating quizzes and questions (as a teacher)

Taking and submitting quizzes (as a student)

Viewing results

Example API:

http
Copy
Edit
GET /app/quizzesApi/<quiz_id>/questions/
POST /app/submissionApi/submit/
GET /app/submissionApi/<quiz_id>/results/
📁 Folder Structure
cpp
Copy
Edit
QuizApp/
│
├── app/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── templates/
│
├── static/
│   ├── css/
│   └── JS/
│
├── manage.py
└── requirements.txt
🧩 Future Improvements
Add pagination for large quizzes

Export results as PDF or CSV

Student leaderboard per quiz

Email notifications

Mobile-friendly UI

👨‍💻 Author
Name: Sohyla Said

Role: Full-stack Developer | Django + JS

