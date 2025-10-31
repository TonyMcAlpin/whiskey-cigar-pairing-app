document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch("http://localhost:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (res.ok) {
    alert("Signup successful! Please login.");
    window.location.href = "login.html";
  } else {
    alert(data.message || "Signup failed.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const statusEl = document.getElementById("status");

  if (!form || !statusEl) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "status";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (payload.password !== payload.confirmPassword) {
      statusEl.textContent = "Passwords do not match";
      statusEl.classList.add("error");
      return;
    }

    delete payload.confirmPassword;

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to create account");
      }

      localStorage.setItem("authToken", result.token);
      statusEl.textContent = "Account created! Redirecting...";
      statusEl.classList.add("success");

      setTimeout(() => {
        window.location.href = "/";
      }, 850);
    } catch (error) {
      statusEl.textContent = error.message;
      statusEl.classList.add("error");
    }
  });
});

