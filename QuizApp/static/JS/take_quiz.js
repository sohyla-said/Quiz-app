document.addEventListener("DOMContentLoaded", async function() {
    const studentId = sessionStorage.getItem("user_id");
    const studentToken = sessionStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    const quizForm = document.getElementById("quiz-form");
    const quizTitle = document.getElementById("quiz-title");

    // get quiz questions
    const res = await fetch(`/app/quizzesApi/${quizId}/questions/`,{
        method: 'GET',
        headers:{
            "Authorization": `Token ${studentToken}`,
            "Content-Type": "application/json"
        }
    });

    // get quiz details
    const quizzesRes = await fetch(`/app/quizzesApi/${quizId}/`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${studentToken}`
    }
    });
    const quizDetails = await quizzesRes.json();

    
    if(res.status === 200){
        const questions = await res.json();
        if(questions.length > 0){
            quizTitle.innerText = `Quiz: ${quizDetails.title}`;
        }
        else{
            quizTitle.innerText = "Quiz: untitled";
        }
        questions.forEach(q => {
            const div = document.createElement("div");
            div.className = "question-block";
            div.innerHTML = `<p><strong>${q.text}</strong> (${q.type.toUpperCase()}), <span class="points">Points: ${q.points}</span></p>`;

            if(q.type === "written"){
                div.innerHTML += `
                <textarea name="answer_${q.id}" rows="3" placeholder="Type your answer here..." required></textarea>
                `;
            }
            else{
                q.options.forEach(option =>{
                    div.innerHTML += `
                    <label>
                  <input type="radio" name="answer_${q.id}" value="${option.text}" required>
                  ${option.text}
                </label><br/>
                    `
                });
            }
            quizForm.appendChild(div);
        });
        const durationInMinutes = quizDetails.duration;
        const durationInMs = durationInMinutes * 60 * 1000;

        setTimeout(() => {
            alert("⏳ Time's up! Auto-submitting your quiz...");
            submitQuiz(studentId, studentToken, quizId);
        }, durationInMs);
    }
    else{
        quizTitle.innerText = "Quiz not found or you don't have permission to view it.";
        quizForm.innerHTML = `<p class="error">Error loading quiz questions.</p>`;
    }
    document.getElementById("submit-btn").addEventListener("click", async function(event) {
        event.preventDefault();
        console.log("Submit button clicked");

        await submitQuiz(studentId, studentToken, quizId);

    });
    
});


async function submitQuiz(studentId, studentToken, quizId) {
    const quizForm = document.getElementById("quiz-form");
    const formData = new FormData(quizForm);
    const answers = [];

    for (let [key, value] of formData.entries()) {
        const questionId = key.split("_")[1];
        answers.push({ question: questionId, answer_text: value });
    }

    const res = await fetch(`/app/submissionApi/submit/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Token ${studentToken}`
        },
        body: JSON.stringify({student_id: studentId, quiz_id: quizId, answers: answers })
    });

    const data = await res.json();
    const msg = document.getElementById("submission-msg");
      if (res.status === 201 || res.status === 200) {
        msg.style.color = "green";
        msg.innerText = "Quiz submitted successfully!";
        setTimeout(() => {
            window.location.href = "/app/studentQuizzesPage/";
        }, 2000);
      } else {
        msg.style.color = "red";
        msg.innerText = "Submission failed: " + JSON.stringify(data);
      }
}