from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('teacher', 'Teacher'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    email = models.EmailField(unique=True)

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username + ' (' + self.get_role_display() + ')'
    
class Quiz(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField(help_text="Duration in minutes")
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='quizzes_created')
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title + ' by ' + self.creator.username

class Question(models.Model):
    TYPE_CHOICES = (
        ('mcq', 'MCQ'),
        ('t_f', 'T_F'),
        ('written', 'Written')
    )
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='mcq')
    points = models.IntegerField(default=1)
    correct_answer = models.TextField(blank=True, null=True, help_text="For MCQ and T/F questions, provide the correct option or answer")

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:50]}"

class Option(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=200)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text

class QuizSubmission(models.Model):
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='submissions')
    student_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='submissions')
    submitted_at = models.DateTimeField(auto_now_add=True, null=True)
    score = models.IntegerField(default=0)

    def __str__(self):
        return f"Submission by {self.student_id.username} for {self.quiz_id.title} - Score: {self.score}"
    

class StudentAnswer(models.Model):
    submission_id = models.ForeignKey(QuizSubmission, on_delete=models.CASCADE, related_name='answers')
    question_id = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    given_answer = models.TextField(blank=True, null=True, help_text="The answer provided by the student for the question")
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"Answer for {self.question_id.text[:50]} by {self.submission_id.student_id.username}"
