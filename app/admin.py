from django.contrib import admin
from .models import CustomUser, Quiz, Question, Option, QuizSubmission, StudentAnswer

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Quiz)
admin.site.register(Question)
admin.site.register(Option)
admin.site.register(QuizSubmission)
admin.site.register(StudentAnswer)
