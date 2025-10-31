document.addEventListener("DOMContentLoaded", () => {
  const authMessage = document.getElementById("auth-message");

  if (!authMessage) return;

  const token = localStorage.getItem("authToken");

  if (token) {
    authMessage.hidden = false;
    authMessage.textContent = "You’re logged in — jump back into your collection below.";
  }
});

