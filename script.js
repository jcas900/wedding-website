// Check authentication
if (!localStorage.getItem('isAuthenticated')) {
  window.location.href = 'login.html';
}

// Viewport helper: set --vh to window.innerHeight * 0.01 to account for mobile browser chrome
function setViewportHeightVar() {
  try {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  } catch (e) {
    // ignore in older browsers
  }
}

// run once now
setViewportHeightVar();

// update on resize/orientation/visualViewport changes
window.addEventListener('resize', setViewportHeightVar);
window.addEventListener('orientationchange', setViewportHeightVar);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', setViewportHeightVar);
  window.visualViewport.addEventListener('scroll', setViewportHeightVar);
}

// Load shared nav with a robust fallback (some file:// or dev setups block fetch)
fetch("nav.html")
  .then(response => {
    if (!response.ok) throw new Error('fetch-failed');
    return response.text();
  })
  .then(data => {
    if (!data || !data.trim()) throw new Error('empty-nav');
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
  })
  .catch(() => {
    // Fallback inline nav (used when fetch is blocked or fails). Keep it small and maintain parity
    // with /nav.html so the mobile nav still functions when opened.
    const fallbackNav = `
      <!-- Mobile Navigation (fallback) -->
      <div class="mobile-nav-content>
        <div class="nav-header">
          <div class="nav-names">Amanda & Jordan</div>
          <div class="nav-date">October 17, 2026</div>
          <div class="nav-location">Scarsdale, NY</div>
        </div>
        <div class="nav-separator" aria-hidden="true"></div>
        <a href="index.html">Home</a>
        <a href="schedule.html">Schedule</a>
        <a href="travel.html">Travel & Accommodations</a>
        <a href="story.html">Gallery</a>
        <a href="registry.html">Registry</a>
      </div>
      <!-- Desktop Navigation (fallback) -->
      <div class="desktop-nav-content">
        <div class="desktop-nav-top">
          <a href="index.html" class="desktop-brand">Amanda & Jordan</a>
        </div>
        <div class="desktop-nav-bottom">
          <div class="desktop-nav-right">
            <a href="index.html">Home</a>
            <a href="schedule.html">Schedule</a>
            <a href="travel.html">Travel & Accommodations</a>
            <a href="story.html">Gallery</a>
            <a href="registry.html">Registry</a>
          </div>
        </div>
      </div>
    `;

    const navEl = document.querySelector('nav');
    if (navEl) {
      navEl.innerHTML = fallbackNav;
    }

    // Initialize mobile nav even when we used the fallback
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

  // Simple open/close functions that only toggle the nav and body classes
  function openMenu() {
    nav.classList.add('active');
    document.body.classList.add('nav-active');
    // reset nav scroll to top when opening
    try { nav.scrollTop = 0; } catch (e) {}
    if (mobileNavContent) try { mobileNavContent.scrollTop = 0; } catch(e) {}
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.textContent = '\u00d7'; // multiplication sign for close
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

// Keep the Transportation paragraph widths in sync: copy the hotel's transportation paragraph
// computed width to the flight-section transportation paragraph so they match exactly.
function syncTransportationWidths() {
  try {
    var hotelP = document.querySelector('.hotel-section .transportation-info');
    var flightP = document.querySelector('.flight-section .transportation-info');
    if (!hotelP || !flightP) return;

    // On very small screens allow the paragraphs to be fluid (matches CSS mobile behavior)
    if (window.matchMedia('(max-width: 420px)').matches) {
      flightP.style.width = '';
      flightP.style.maxWidth = '';
      flightP.style.display = '';
      flightP.style.margin = '';
      return;
    }

    // Use the hotel's rendered width (including wrapping) to set the flight paragraph width.
    var hotelRect = hotelP.getBoundingClientRect();
    var widthPx = Math.round(hotelRect.width);

    // Apply width to flight paragraph and center it to match visual alignment
    flightP.style.display = 'block';
    flightP.style.width = widthPx + 'px';
    flightP.style.margin = '0.6rem auto 0';
  } catch (e) {
    // don't break the page if something goes wrong
    console.warn('syncTransportationWidths failed', e);
  }
}

// Run once after nav loads/content is ready and on resize so the measured width stays correct
window.addEventListener('load', function () {
  setTimeout(syncTransportationWidths, 50);
});
window.addEventListener('resize', function () {
  // debounce a bit to avoid thrashing on continuous resize
  if (window._syncTransportTimer) clearTimeout(window._syncTransportTimer);
  window._syncTransportTimer = setTimeout(function () {
    syncTransportationWidths();
  }, 120);
});

// Also run after nav is injected (nav fetch callback calls initMobileNav and returns) — run on DOMContentLoaded to be safe
window.addEventListener('DOMContentLoaded', function () {
  setTimeout(syncTransportationWidths, 60);
});

