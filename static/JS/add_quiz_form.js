document.getElementById("create-quiz-form").addEventListener("submit", async function(event){
    event.preventDefault();

    const teacherToken = sessionStorage.getItem("token");
    const formData = new FormData(this);
    const msg = document.getElementById("message");

    const payload= {
        title: formData.get("title"),
        duration: parseInt(formData.get("duration")),
        start_time: formData.get("start_time"),
        end_time: formData.get("end_time"),
    };
    const res = await fetch("/app/quizzesApi/create/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${teacherToken}`
        },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.status === 201) {
        msg.style.color = "green";
        msg.innerText = "Quiz created successfully!";
        setTimeout(() => {
        window.location.href = "/app/teacherQuizzesPage/";
        }, 2000);
    } else {
        msg.style.color = "red";
        msg.innerText = "Failed to create quiz: " + JSON.stringify(data);
    }
});