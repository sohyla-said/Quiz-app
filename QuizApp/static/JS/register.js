const msg = document.getElementById("register-msg");
document.getElementById("register-form").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission
    
    const formData = new FormData(event.target);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));

    // Get CSRF token from the meta tag
    // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const res = await fetch("/app/auth/registerApi/",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "X-CSRFToken": csrfToken  // Required for Django CSRF protection
        },
        body: body
    });
    const data = await res.json();
    if(res.status === 201){
        msg.style.color = "green";
        msg.innerText = "Your Account has been created successfully, Redirecting to Login!";
        setTimeout(() => {
            window.location.href = "/app/loginPage";
        }, 2500);
    }
    else{
        msg.style.color = "red";
        msg.innerText = "Registration failed: " + JSON.stringify(data);
    }

});