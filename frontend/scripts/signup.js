document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signup-form");
  const statusEl = document.getElementById("status");

  if (!form || !statusEl) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.textContent = "";
    statusEl.className = "status";

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Validate passwords match
    if (payload.password !== payload.confirmPassword) {
      statusEl.textContent = "Passwords do not match.";
      statusEl.classList.add("error");
      return;
    }

    delete payload.confirmPassword;

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      statusEl.textContent = "Signup successful! Redirecting to login...";
      statusEl.classList.add("success");

      // ✅ Redirect after short delay
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1200);
    } catch (err) {
      console.error("Signup error:", err);
      statusEl.textContent = err.message || "Signup failed.";
      statusEl.classList.add("error");
    }
  });
});
