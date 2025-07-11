from django.shortcuts import render
from rest_framework import generics, permissions
from .models import CustomUser, Quiz, Question, Option, QuizSubmission, StudentAnswer
from .serializers import RegisterSerializer, QuizSerializer, QuestionSerializer, OptionSerializer, QuizSubmissionSerializer, StudentAnswerSerializer, QuizSubmissionDisplaySerializer
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .permissions import IsTeacher, IsStudent
from django.shortcuts import get_object_or_404


# Create your views here.
#######################Authentication#######################
def home_page_view(request):
    return render(request, 'home.html')

# creates a new user and returns user data
class RegisterApiView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

def register_page_view(request):
    return render(request, 'register.html')

# returns a token for the user if the credentials are valid
# if the credentials are invalid, returns an error message
class LoginApiView(APIView):
    def post(self, request):

        # authenticate is a django built-in method that 
        # takes username + password, check if the user exists and if the password is correct
        # if the user exists, it returns the user object, otherwise it returns None
        user = authenticate(username = request.data["username"], password = request.data["password"])
        if user:
            # check if a token already exists for the user, if not creates a new one
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id, 'email': user.email, 'username': user.username, 'role': user.role}, status=200)
        else: 
            return Response({'error': 'Invalid credentials'}, status=400)
        
def login_page_view(request):
    return render(request, 'login.html')


#######################Quiz related endpoints#######################
# get all quizzes
class AllQuizzesListView(generics.ListAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated] # Allow any user to view quizzes

# get quizzes created by a specific teacher
class TeacherQuizzesListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    permission_classes = [IsTeacher]

    def get_queryset(self):
        # get techer_id from query parameters
        teacher_id = self.request.query_params.get('creator')

        if teacher_id:
        # filter quizzes created by the teacher with the given ID
            return Quiz.objects.filter(creator = teacher_id)
        # if no teacher_id is provided, return an empty queryset
        return Quiz.objects.none()
    
# create a new quiz
class CreateQuizView(generics.CreateAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [IsTeacher]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

# get a specific quiz by ID
class QuizDetailView(generics.RetrieveAPIView):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

# add a question to a specific quiz
class AddQuestionView(APIView):
    permission_classes = [IsTeacher]

    def post(self, request, quiz_id):
        serializer = QuestionSerializer(data=request.data)
        quiz = get_object_or_404(Quiz, id=quiz_id)
        if quiz.creator != request.user:
            return Response({'error': 'You are not allowed to add questions to this quiz.'}, status=403)
        if serializer.is_valid():
            question = serializer.save(quiz_id=quiz)
            return Response(QuestionSerializer(question).data, status=201)
        return Response(serializer.errors, status=400)
    
# get all questions for a specific quiz
class QuizQuestionsListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        quiz_id = self.kwargs['quiz_id']
        return Question.objects.filter(quiz_id=quiz_id)

# delete a specific question by ID
# django automatically removes the relation with the quiz since it's a ForeignKey.
class DeleteQuestionView(APIView):
    permission_classes = [IsTeacher]

    def delete(self, request, question_id):
        question = get_object_or_404(Question, id=question_id)
        if question.quiz_id.creator != request.user:
            return Response({'error': 'You are not allowed to delete this question.'}, status=403)
        question.delete()
        return Response({'message': 'Question deleted successfully'}, status=204)
    
#submit a quiz by :
# 1. creating a QuizSubmission object
# 2. creating StudentAnswer objects for each answer given by the student
# 3. grade the quiz and save the score in the submission object
class SubmitQuizView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def post(self, request):
        serializer = QuizSubmissionSerializer(data=request.data)
        if (serializer.is_valid()):
            quiz = Quiz.objects.get(id=request.data["quiz_id"])
            submission = QuizSubmission.objects.create(
                quiz_id = quiz,
                student_id = request.user
            )
            total_score = 0
            for ans in serializer.validated_data['answers']:
                question = ans['question']
                given = ans['answer_text']
                correct = question.correct_answer.strip().lower() == given.strip().lower()
                StudentAnswer.objects.create(
                    submission_id=submission,
                    question_id=question,
                    given_answer=given,
                    is_correct=correct
                )
                if correct:
                    total_score += question.points
            submission.score = total_score
            submission.save()
            return Response({"message": "Quiz submitted successfully", "score": total_score})
        return Response(serializer.errors, status=400)

# get the results for a specific quiz submission
# returns the quiz title, score, total points, and a list of answers with their correctness
class QuizResultView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request, quiz_id):
        submission = get_object_or_404(QuizSubmission, quiz_id=quiz_id, student_id=request.user)
        questions = Question.objects.filter(quiz_id=quiz_id)
        data = {
            'quiz_title': submission.quiz_id.title,
            'score': submission.score,
            'total': sum((q.points for q in questions)),
            'answers': []
        }
        for ans in submission.answers.all():
            data['answers'].append({
                'question': ans.question_id.text,
                'your_answer': ans.given_answer,
                'correct_answer': ans.question_id.correct_answer,
                'is_correct': ans.is_correct
            })

        return Response(data)
    
# check if a student has submitted a quiz
# returns a boolean indicating whether the student has submitted the quiz or not
class CheckQuizSubmissionView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        submitted = QuizSubmission.objects.filter(quiz_id=quiz, student_id=request.user).exists()
        return Response({'submitted': submitted})
    
    
class GetQuizSubmissionsView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsTeacher]

    def get(self, request, quiz_id):
        quiz = get_object_or_404(Quiz, id=quiz_id)
        if quiz.creator != request.user:
            return Response({'error': 'You are not allowed to view submissions for this quiz.'}, status=403)
        
        submissions = QuizSubmission.objects.filter(quiz_id=quiz)
        
        serializer = QuizSubmissionDisplaySerializer(submissions, many=True)
        return Response(serializer.data)



#######################Teacher related pages#######################
def teacher_quizzes_page(request):
    return render(request, 'teachers_quizzes.html')

def quiz_details_page(request):
    return render(request, 'quiz_details.html')

def add_question_form_page(request):
    return render(request, 'add_question_form.html')

def add_quiz_form_page(request):
    return render(request, 'add_quiz_form_page.html')

def quiz_submissions_page(request):
    return render(request, 'quiz_submissions_page.html')

#######################Student related pages#######################

def student_quizzes_page(request):
    return render(request, 'student_quizzes.html')

def take_quiz_page(request):
    return render(request, 'take_quiz_page.html')

def quiz_result_page(request):
    return render(request, 'quiz_result.html')