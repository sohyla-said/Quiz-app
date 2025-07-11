from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page_view, name='home'),
    path('auth/registerApi/', views.RegisterApiView.as_view(), name='register_api'),
    path('registerPage/', views.register_page_view, name='register_page'),
    path('auth/loginApi/', views.LoginApiView.as_view(), name='login_api'),
    path('loginPage/', views.login_page_view, name='login_page'),
    path('quizzesApi/', views.AllQuizzesListView.as_view(), name='all_quizzes'),
    path('quizzesApi/by-teacher', views.TeacherQuizzesListView.as_view(), name='teacher_quizzes'),
    path('quizzesApi/create/', views.CreateQuizView.as_view(), name='create_quiz'),
    path('quizzesApi/<id>/', views.QuizDetailView.as_view(), name='quiz_detail'),
    path('quizzesApi/<quiz_id>/add-question/', views.AddQuestionView.as_view(), name='add_question'),
    path('quizzesApi/<quiz_id>/questions/', views.QuizQuestionsListView.as_view(), name='question_list'),
    path('questionsApi/<question_id>/remove/', views.DeleteQuestionView.as_view(), name='remove_question'),
    path('teacherQuizzesPage/', views.teacher_quizzes_page, name='teachers_quizzes_page'),
    path('quizDetailsPage/', views.quiz_details_page, name='quiz_details_page'),
    path('addQuestionFormPage/', views.add_question_form_page, name='add_question_form_page'),
    path('addQuizFormPage/', views.add_quiz_form_page, name='add_quiz_form_page'),
    path('studentQuizzesPage/', views.student_quizzes_page, name='student_quizzes_page'),
    path('takeQuizPage/', views.take_quiz_page, name='take_quiz_page'),
    path('submissionApi/submit/', views.SubmitQuizView.as_view(), name='submit_quiz'),
    path('submissionApi/<quiz_id>/results/', views.QuizResultView.as_view(), name='quiz_results'),
    path('quizResultPage/', views.quiz_result_page, name='quiz_result_page'),
    path('submissionApi/<quiz_id>/check-submission/', views.CheckQuizSubmissionView.as_view(), name='check_submission'),
    path('quizSubmissionsPage/', views.quiz_submissions_page, name='quiz_submissions_page'),
    path('submissionApi/<quiz_id>/get-submissions/', views.GetQuizSubmissionsView.as_view(), name='get_submissions'),

]