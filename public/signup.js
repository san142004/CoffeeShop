document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const age = document.getElementById("signup-age").value;
    const gender = document.getElementById("signup-gender").value;

    const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, age, gender }),
    });

    const data = await res.json();

    if (res.ok) {
        alert("Signup successful");
        window.location.href = "/login";
    } else {
        alert(data.error);
    }
});
