const loginToggle = document.getElementById("loginToggle");
const registerToggle = document.getElementById("registerToggle");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const resetForm = document.getElementById("resetForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

const showReset = document.getElementById("showReset");
const backToLogin = document.getElementById("backToLogin");
const backToLoginFromForgot = document.getElementById("backToLoginFromForgot");

const formBox = document.getElementById("formBox");

loginToggle.addEventListener("click", () => {
  loginForm.classList.add("active");
  registerForm.classList.remove("active");
  forgotPasswordForm.classList.remove("active");
  resetForm.style.display = "none";
  formBox.classList.remove("forgot-active");
  loginToggle.classList.add("active");
  registerToggle.classList.remove("active");
  loginToggle.setAttribute("aria-selected", "true");
  registerToggle.setAttribute("aria-selected", "false");
  loginForm.reset();
});

registerToggle.addEventListener("click", () => {
  registerForm.classList.add("active");
  loginForm.classList.remove("active");
  forgotPasswordForm.classList.remove("active");
  resetForm.style.display = "none";
  formBox.classList.remove("forgot-active");
  registerToggle.classList.add("active");
  loginToggle.classList.remove("active");
  registerToggle.setAttribute("aria-selected", "true");
  loginToggle.setAttribute("aria-selected", "false");
  registerForm.reset();
});

showReset.addEventListener("click", (e) => {
  e.preventDefault();
  loginForm.classList.remove("active");
  forgotPasswordForm.classList.add("active");
  formBox.classList.add("forgot-active");
});

backToLoginFromForgot.addEventListener("click", (e) => {
  e.preventDefault();
  forgotPasswordForm.classList.remove("active");
  loginForm.classList.add("active");
  formBox.classList.remove("forgot-active");
});

backToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  resetForm.style.display = "none";
  loginForm.classList.add("active");
});

forgotPasswordForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value;
  try {
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    alert(data.message);
    forgotPasswordForm.reset();
    forgotPasswordForm.classList.remove("active");
    formBox.classList.remove("forgot-active");
    loginForm.classList.add("active");
  } catch {
    alert("Error connecting to server");
  }
});

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }
    alert("Registration successful! You can now login.");
    registerForm.reset();
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
  } catch (err) {
    alert("Error connecting to server");
  }
});

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const remember = document.getElementById("rememberMe").checked;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, remember }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Invalid email or password");
      return;
    }

    if (remember) {
      localStorage.setItem("isLoggedIn", "true");
    } else {
      sessionStorage.setItem("isLoggedIn", "true");
    }

    alert(`Welcome back, ${data.name || email}!`);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert("Error connecting to server");
  }
});

resetForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = document.getElementById("resetEmail").value;
  const newPassword = document.getElementById("resetNewPassword").value;

  if (newPassword.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  try {
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message || "Reset failed");
      return;
    }
    alert("Password reset successful! You can now login.");
    resetForm.reset();
    resetForm.style.display = "none";
    loginForm.classList.add("active");
  } catch (err) {
    alert("Error connecting to server");
  }
});