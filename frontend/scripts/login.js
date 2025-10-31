document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const statusEl = document.getElementById("status");

  if (!form) {
    console.error("❌ Login form not found in the DOM!");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (statusEl) {
      statusEl.textContent = "";
      statusEl.className = "status";
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to log in");
      }

      localStorage.setItem("token", result.token);
      if (statusEl) {
        statusEl.textContent = "Logged in successfully!";
        statusEl.classList.add("success");
      }

      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 850);
    } catch (error) {
      console.error("Login error:", error);
      if (statusEl) {
        statusEl.textContent = error.message;
        statusEl.classList.add("error");
      } else {
        alert(error.message);
      }
    }
  });
});
