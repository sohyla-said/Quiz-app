document.addEventListener("DOMContentLoaded", async function() {
    const questionType = document.getElementById("question-type");
    const form = document.getElementById("add-question-form");
    const optionsSection = document.getElementById("options-section");
    const msg = document.getElementById("message");
    let optionsCount = 2;

    //toggle options based on the question ytpe
    questionType.addEventListener("change", function(){
        if (this.value === "written"){
            optionsSection.style.display  = "none";
        }
        else{
            optionsSection.style.display = "block";
        }
    });

    //add options dynamically
    document.getElementById("add-option-btn").addEventListener("click", function() {
        optionsCount++;
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = `
        <input type="text" name="option_text_${optionsCount}" placeholder="Option ${optionsCount}">
        <label><input type="checkbox" name="option_correct_${optionsCount}"> Correct</label>
        `;
        optionsSection.insertBefore(div, this);
    });

    //form submission
    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const type = formData.get("type");
        const options = [];

        for (let i = 1; i <= optionsCount; i++){
            const text = formData.get(`option_text_${i}`);
            const isCorrect = formData.get(`option_correct_${i}`) !== null;
            if (text) {
                options.push({ text: text, is_correct: isCorrect });
            }
        }

        const payload = {
            text: formData.get("text"),
            type: type,
            points: parseInt(formData.get("points")),
            correct_answer: formData.get("correct_answer"),
        };
        if (type !== "written") {
            payload.options = options;
        }

        const teacherToken = sessionStorage.getItem("token");
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get("id");
        
        const res = await fetch(`/app/quizzesApi/${quizId}/add-question/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${teacherToken}`
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.status === 201) {
            msg.style.color = "green";
            msg.textContent = "Question added successfully!";
            form.reset();
            setTimeout(() => {
                window.location.href = "/app/teacherQuizzesPage/";
            }, 2500);
        } else {
            msg.style.color = "red";
            msg.textContent = "Error adding question: " + data.message;
        }
    });
})