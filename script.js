// Check authentication
if (!localStorage.getItem('isAuthenticated')) {
  window.location.href = 'login.html';
}

// Load shared nav
fetch("nav.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector("nav").innerHTML = data;
  });

// Navigation toggle for all screen sizes
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  // Set initial state (menu closed)
  nav.classList.remove("active");

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
    document.body.classList.toggle("nav-active");
    // Update button text based on menu state
    toggleBtn.textContent = nav.classList.contains("active") ? "×" : "☰";
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains("active")) {
      nav.classList.remove("active");
      document.body.classList.remove("nav-active");
      toggleBtn.textContent = "☰";
    }
  });
});
