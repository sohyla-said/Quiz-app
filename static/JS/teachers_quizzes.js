document.addEventListener("DOMContentLoaded", async function() {
    const teacherId = sessionStorage.getItem("user_id");
    const teacherToken = sessionStorage.getItem("token");

    const container = document.getElementById("quiz-container");

    const res = await fetch(`/app/quizzesApi/by-teacher?creator=${teacherId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${teacherToken}`
        }
    });
    const quizzes = await res.json();
    if (quizzes.length === 0) {
        container.innerHTML = `<p class="no-quizzes">No quizzes found. <a href="/app/addQuizFormPage/">Create a new quiz</a>.</p>`;
        return;
    }
    quizzes.forEach(quiz => {
        const card = document.createElement("div");
        card.className = "quiz-card";
        const now = new Date();
        const deadline = new Date(quiz.end_time);

        const actionButton = (now < deadline)
            ? `<button class="adding-btn">
                    <a href="/app/addQuestionFormPage/?id=${quiz.id}" style="color: inherit; text-decoration: none;"><i class="fa-solid fa-plus"></i> Add Question</a>
            </button>`
            : `<button class="deadline-passed" disabled>
                    <i class="fa-solid fa-hand"></i> Deadline Passed
            </button>`;

        card.innerHTML = `
        <div class="quiz-details">
            <h2 class="quiz-name">${quiz.title}</h2>
            <p><strong><i class="fa-solid fa-folder-plus"></i>Created at:</strong> ${quiz.created_at}</span></p>
            <p><strong><i class="fa-solid fa-clock"></i>Duration:</strong> ${quiz.duration} minutes</span></p>
            ${actionButton}
            <button class="details-btn">
                <a href="/app/quizDetailsPage/?id=${quiz.id}" class="details-link">
                    <i class="fa-solid fa-circle-info"></i> View Details
                </a>
            </button>
            <button class="details-btn">
                <a href="/app/quizSubmissionsPage/?quiz_id=${quiz.id}" class="details-link">
                    <i class="fa-solid fa-user-check"></i> View Submissions
                </a>
            </button>
            </div>`;
            container.appendChild(card);
    });
});