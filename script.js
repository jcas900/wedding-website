// Check authentication
if (!localStorage.getItem('isAuthenticated')) {
  window.location.href = 'login.html';
}

// Load shared nav
fetch("nav.html")
  .then(response => response.text())
  .then(data => {
    document.querySelector("nav").innerHTML = data;
    
    // Highlight current page in navigation after nav is loaded
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".desktop-nav-right a").forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
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

// Blur registry buttons on pageshow/load/popstate to prevent sticky hover/fill when returning via back nav
(function() {
  function clearRegistryButtonFocus() {
    try {
      var active = document.activeElement;
      if (!active) return;
      if (active.classList && active.classList.contains('registry-button')) {
        active.blur();
      }
    } catch (e) {
      // ignore
    }
  }

  window.addEventListener('pageshow', function () {
    setTimeout(clearRegistryButtonFocus, 0);
  });

  window.addEventListener('load', function () {
    setTimeout(clearRegistryButtonFocus, 0);
  });

  window.addEventListener('popstate', function () {
    setTimeout(clearRegistryButtonFocus, 0);
  });
})();
