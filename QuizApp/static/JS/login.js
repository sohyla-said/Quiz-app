const loginMsg = document.getElementById("login-msg");

document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));

    // Get CSRF token from the meta tag
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const csrfToken = document.getElementById('csrf-token').value;

    const res = await fetch("/app/auth/loginApi/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken  // Required for Django CSRF protection
        },
        body: body
    });
    const data = await res.json();
    if(res.status === 200){
        sessionStorage.setItem("user_id", data.user_id);
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("username", data.username);
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.role);

        loginMsg.style.color = "green";
        loginMsg.innerText = "Login successful! Redirecting...";

        // Delay redirect for 2.5 seconds (2500 ms)
        if(data.role === "teacher"){
            setTimeout(() => {
                window.location.href = "/app/teacherQuizzesPage/";
            }, 2500);
        }
        else{
            setTimeout(() => {
                window.location.href = "/app/studentQuizzesPage/";
            }, 2500);
        }

    }
    else {
        const errorData = await res.json();
        loginMsg.style.color = "red";
        loginMsg.innerText = "Login failed: " + JSON.stringify(errorData);
        
    }
});