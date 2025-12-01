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
  const mobileNavContent = document.querySelector('.mobile-nav-content');

  // Set initial state (menu closed)
  nav.classList.remove("active");
  document.body.classList.remove('nav-active');

  // preserve scroll position when opening menu
  let savedScrollY = 0;

  function openMenu() {
    // save scroll position
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    // prevent background from scrolling: fix body and offset top so page doesn't jump
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.classList.add('nav-active');

    // show nav
    nav.classList.add('active');
    // ensure nav scroll starts at top
    try { nav.scrollTop = 0; } catch(e) {}
    if (mobileNavContent) try { mobileNavContent.scrollTop = 0; } catch(e) {}

    toggleBtn.textContent = '×';
  }

  function closeMenu() {
    // hide nav
    nav.classList.remove('active');
    document.body.classList.remove('nav-active');

    // restore body scroll position
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);

    toggleBtn.textContent = '☰';
  }

  toggleBtn.addEventListener("click", () => {
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target) && nav.classList.contains("active")) {
      closeMenu();
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
