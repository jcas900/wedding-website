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

    // Initialize mobile nav toggle behavior after nav content is present
    initMobileNav();
  });

function initMobileNav() {
  const toggleBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");
  const mobileNavContent = document.querySelector('.mobile-nav-content');

  if (!toggleBtn || !nav) return;

  // Ensure the menu starts closed
  nav.classList.remove('active');
  document.body.classList.remove('nav-active');
  toggleBtn.textContent = '\u2630'; // hamburger

  // Simple open/close functions that rely on CSS overlay (no body fixed positioning)
  function openMenu() {
    nav.classList.add('active');
    document.body.classList.add('nav-active');
    // reset nav scroll to top when opening
    try { nav.scrollTop = 0; } catch (e) {}
    if (mobileNavContent) try { mobileNavContent.scrollTop = 0; } catch(e) {}
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.textContent = '\u00d7'; // ×
  }

  function closeMenu() {
    nav.classList.remove('active');
    document.body.classList.remove('nav-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = '\u2630';
  }

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (nav.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close menu when clicking a nav link (improves UX on mobile)
  nav.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName === 'A') {
      closeMenu();
    }
  });

  // Close menu when clicking outside the nav content (but only when open)
  document.addEventListener('click', function (e) {
    if (!nav.classList.contains('active')) return;
    // if click is outside nav (shouldn't happen often because nav is full-screen overlay), close
    if (!nav.contains(e.target) && !toggleBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Keyboard accessibility: close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

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
