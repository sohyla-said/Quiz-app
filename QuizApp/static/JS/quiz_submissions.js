document.addEventListener("DOMContentLoaded", async function() {
    const quizId = new URLSearchParams(window.location.search).get("quiz_id");
    const token = sessionStorage.getItem("token");

    const res = await fetch(`/app/submissionApi/${quizId}/get-submissions/`, {
        method: 'GET',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const container = document.getElementById("submission-list");
        if (res.status === 200) {
            const data = await res.json();
            if (data.length === 0) {
                container.innerHTML = "<p>No submissions found.</p>";
                return;
            }
            document.getElementById("quiz-title").innerText = `Submissions for Quiz: ${data[0].quiz_title}`;

            data.forEach(sub => {
                const card = document.createElement("div");
                card.className = "submission-card";
                card.innerHTML = `
                    <h3>Student: ${sub.student_username}</h3>
                    <p><strong>Score:</strong> ${sub.score}</p>
                    <p><strong>Submitted At:</strong> ${new Date(sub.submitted_at).toLocaleString()}</p>
                    <details>
                    <summary>View Answers</summary>
                    ${sub.answers.map(ans => `
                        <div class="answer">
                            <p><strong>Q:</strong> ${ans.question_text}</p>
                            <p><strong>Your Answer:</strong> ${ans.given_answer}</p>
                            <p><strong>Correct Answer:</strong> ${ans.correct_answer}</p>
                            <p><strong>Correct:</strong> ${ans.is_correct ? '✅' : '❌'}</p>
                        </div>
                    `).join('')}
                </details>
            `;
            container.appendChild(card);
        });
    } else {
        container.innerHTML = "<p>Failed to load submissions.</p>";
    }
});

