document.addEventListener("DOMContentLoaded", async function() {
    const studentId = sessionStorage.getItem("user_id");
    const studentToken = sessionStorage.getItem("token");

    const container = document.getElementById("quiz-container");

    const res = await fetch(`/app/quizzesApi/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${studentToken}`
        }
    });
    const quizzes = await res.json();
    if (quizzes.length === 0) {
        container.innerHTML = `<p class="no-quizzes">No quizzes found.</p>`;
        return;
    }
    quizzes.forEach(async quiz => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        const now = new Date();
        const deadline = new Date(quiz.end_time);
        
        // check if the quiz is submitted by the student
        const checkSubmission = await fetch(`/app/submissionApi/${quiz.id}/check-submission/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${studentToken}`
            }
        });
        const submissionData = await checkSubmission.json();
        let actionButton = "";
        //take quiz if deadline is not passed and is not submitted before
        if(now < deadline && !submissionData.submitted){
            actionButton =  `<button class="adding-btn">
                    <a href="/app/takeQuizPage/?id=${quiz.id}" style="color: inherit; text-decoration: none;"><i class="fa-solid fa-play"></i> Start quiz</a>
            </button>`;
        }
        //view results if the student submitted the quiz before the deadline
        else if(submissionData.submitted) {
            actionButton =  `<button class="adding-btn">
                    <a href="/app/quizResultPage/?quiz_id=${quiz.id}" style="color: inherit; text-decoration: none;"><i class="fa-solid fa-file"></i> View Results</a>
            </button>`;
        }
        //display deadline passed if the student didn't submit the quiz
        else{
            actionButton =  `<button class="adding-btn">
                    <span class="deadline-passed"><i class="fa-solid fa-lock"></i> Deadline Passed</span>
                </button>`;
        }

        card.innerHTML = `
        <div class="quiz-details">
            <h2 class="quiz-name">${quiz.title}</h2>
            <p><strong><i class="fa-solid fa-folder-plus"></i>Created at:</strong> ${quiz.created_at}</span></p>
            <p><strong><i class="fa-solid fa-hourglass-start"></i>Start time:</strong> ${quiz.start_time}</span></p>
            <p><strong><i class="fa-solid fa-hourglass-end"></i>End time:</strong> ${quiz.end_time}</span></p>
            <p><strong><i class="fa-solid fa-clock"></i>Duration:</strong> ${quiz.duration} minutes</span></p>
            ${actionButton}`;
            container.appendChild(card);
    });
});