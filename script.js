// Load shared nav
fetch("nav.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector("nav").innerHTML = data;
  });

// Mobile toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  toggleBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
});
