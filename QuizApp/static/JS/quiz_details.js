document.addEventListener("DOMContentLoaded", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("id");
    const teacherToken = sessionStorage.getItem("token");

    if (!quizId) {
        alert("Quiz ID not found in URL");
        return;
    }
    try{
        const quizzesRes = await fetch(`/app/quizzesApi/${quizId}/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${teacherToken}`
            }
        });
        const quizDetails = await quizzesRes.json();

        const questionsRes = await fetch(`/app/quizzesApi/${quizId}/questions/`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${teacherToken}`
            }
        });
        const questions = await questionsRes.json();
        if (quizzesRes.status === 200){
            document.getElementById("quiz-name").innerText = quizDetails.title;
            document.getElementById("quiz-created-at").innerText = quizDetails.created_at;
            document.getElementById("quiz-duration").innerText = quizDetails.duration;
            document.getElementById("quiz-start-time").innerText = quizDetails.start_time;
            document.getElementById("quiz-end-time").innerText = quizDetails.end_time;

        }
        else{
            alert("Failed to fetch quiz details" || data.error);
        }
        const questionList = document.getElementById("quiz-questions");
        if (questionsRes.status === 200){
            questions.forEach(q => {
            const li = document.createElement("li");
            li.className = "question-item";
            li.innerHTML = `
                <p><strong>Q:</strong> ${q.text} <span class="type">(${q.type.toUpperCase()})</span> <span class="points">[${q.points} pts]</span></p>
                ${
                    q.options && q.options.length
                    ? `
                        <ul class="options">
                            ${q.options.map(opt => `
                                <li>${opt.text} ${opt.is_correct ? '✅' : ''}</li>
                            `).join("")}
                        </ul>
                    `
                    : `<p><strong>Correct Answer:</strong> ${q.correct_answer}</p>`
                }
                <button class="remove-btn" onclick="removeQuestion(${q.id})">
                    <i class="fa-solid fa-trash"></i> Remove Question
                </button>
            `;

            questionList.appendChild(li);
        });
        }
        else{
            alert("Failed to fetch quiz questions" || data.error);
        }
    }
    catch (error) {
        console.error("Error fetching quiz details:", error);
        alert("An error occurred while fetching quiz details.");
    }
});

async function removeQuestion(questionId) {
    const teacherToken = sessionStorage.getItem("token");
    const confirmed = confirm("Are you sure you want to remove this question?");
    if (!confirmed) {
        return;
    }
    const res = await fetch(`/app/questionsApi/${questionId}/remove/`,{
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${teacherToken}`
        }
    });
    if (res.status === 204) {
        alert("Question removed successfully.");
        location.reload();
    } else {
        alert("Failed to remove question.");
    }
}