document.addEventListener("DOMContentLoaded", async function() {
    const studentToken = sessionStorage.getItem("token");
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get("quiz_id");

    if (!quizId) {
        document.getElementById("result-container").innerHTML = "<p>Invalid quiz ID.</p>";
        return;
    }
    const res = await fetch(`/app/submissionApi/${quizId}/results/`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${studentToken}`
        }
    });
    const data = await res.json();
    if (res.status === 200) {
      document.getElementById("quiz-title").innerText = data.quiz_title;
      document.getElementById("score-display").innerText = `Score: ${data["score"]} / ${data["total"]}`;

      const resultContainer = document.getElementById("answers");

      data.answers.forEach((ans, index) => {
        const block = document.createElement("div");
        block.className = "answer-block";
        block.innerHTML = `
          <p><strong>Q${index + 1}:</strong> ${ans.question}</p>
          <p>Your Answer: <span class="${ans.is_correct ? 'correct' : 'incorrect'}">${ans.your_answer}</span></p>
          <p>Correct Answer: <strong>${ans.correct_answer}</strong></p>
        `;
        resultContainer.appendChild(block);
      });
    } else {
      document.getElementById("result-container").innerHTML = "<p>Failed to load result.</p>";
    }
});