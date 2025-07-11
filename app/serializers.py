from rest_framework import serializers
from .models import CustomUser, Quiz, Question, Option, QuizSubmission, StudentAnswer
from django.contrib.auth.password_validation import validate_password




# Register serializer for user registration
# Defining what fields can be received
# Validating data (checking password strength)
# Creating the new user object
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password","confirm_password", "role"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        if len(data["password"]) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        # Email validation and uniqueness   
        if CustomUser.objects.filter(email = data["email"]).exists():
            raise serializers.ValidationError("Email is already in use")
        return data
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username = validated_data["username"],
            email=validated_data["email"],
            role=validated_data.get("role", "student")
        )
        user.set_password(validated_data["password"])   # Hashing the password
        user.save()
        return user
    

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'created_at', 'duration', 'creator', 'start_time', 'end_time']
        read_only_fields = ['creator']

class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = ['id', 'quiz_id', 'text', 'type', 'points', 'correct_answer', 'options']
        read_only_fields = ['quiz_id']
    
    def create(self, validated_data):
        options_data = validated_data.pop('options', [])
        question = Question.objects.create(**validated_data)
        if question.type in ['mcq', 't_f']:
            for option_data in options_data:
                Option.objects.create(question=question, **option_data)
        return question


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = '__all__'

class StudentAnswerInputSerializer(serializers.Serializer):
    question = serializers.PrimaryKeyRelatedField(queryset=Question.objects.all())
    answer_text = serializers.CharField()

class QuizSubmissionSerializer(serializers.Serializer):
    quiz_id = serializers.IntegerField()
    answers = StudentAnswerInputSerializer(many=True)

class QuizSubmissionDisplaySerializer(serializers.ModelSerializer):
    student_username = serializers.CharField(source='student_id.username')
    answers = StudentAnswerSerializer(source='answers.all', many=True)
    quiz_title = serializers.CharField(source='quiz_id.title')

    class Meta:
        model = QuizSubmission
        fields = ['id', 'quiz_id', 'quiz_title', 'student_username', 'score', 'submitted_at', 'answers']


