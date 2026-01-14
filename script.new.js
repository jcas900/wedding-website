// script.new.js
// Build the homepage gallery by appending images from the images/gallery folder.
(function () {
  'use strict';

  var galleryContainerId = 'gallery-grid';
  var galleryPath = 'images/gallery/';
  // Ordered list of filenames. our-story.jpg is intentionally first.
  var filenames = [
    'our-story.jpg',
    'IMG_0320.jpg',
    'IMG_1814.jpg',
    'IMG_2091.jpg',
    'IMG_2888.jpg',
    'IMG_3478.jpg',
    'IMG_4040.jpg',
    'IMG_4881.jpg',
    'IMG_4965.jpg',
    'IMG_6680.jpg',
    'IMG_7319.jpg',
    'IMG_7458.jpg',
    'IMG_7567.jpg',
    'IMG_8434.jpg',
    'IMG_9210.jpg',
    'IMG_9930.jpg'
  ];

  // Map of filename -> visible caption (used in lightbox)
  var captions = {
    'our-story.jpg': 'Our first Hinge conversation',
    'IMG_0320.jpg': 'An Icelandic ice bar',
    'IMG_1814.jpg': "Wedding fun",
    'IMG_2091.jpg': 'Seattle Space Needle',
    'IMG_2888.jpg': '"Go Birds" – Amanda',
    'IMG_3478.jpg': 'The Northern Lights in Tromsø, Norway',
    'IMG_4040.jpg': 'Jamaica',
    'IMG_4881.jpg': 'Seljalandsfoss in Iceland',
    'IMG_4965.jpg': "Wedding fun part 2",
    'IMG_6680.jpg': 'Engaged!',
    'IMG_7319.jpg': 'Mt. Rainier',
    'IMG_7458.jpg': 'Engagement photoshoot',
    'IMG_7567.jpg': 'Our biggest rivalry',
    'IMG_8434.jpg': '"Go Giants" – Jordan',
    'IMG_9210.jpg': 'Pickleball',
    'IMG_9930.jpg': '"Go Phillies" – Amanda and Jordan'
  };

  function friendlyAlt(filename) {
    // Remove extension and replace non-word characters with spaces, then title-case words
    var name = filename.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
    return name.split(' ').map(function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }

  function buildHomeGallery() {
    var grid = document.getElementById(galleryContainerId);
    if (!grid) return;

    // Clear existing non-featured children (keep any pre-rendered featured fallback)
    var children = Array.prototype.slice.call(grid.children);
    children.forEach(function (child) {
      if (!child.classList.contains('featured')) {
        grid.removeChild(child);
      }
    });

    filenames.forEach(function (file, index) {
      // Skip the featured fallback which we already included in HTML
      if (index === 0) return; // our-story is already present as fallback

      var fig = document.createElement('figure');
      fig.className = 'gallery-item';

      var img = document.createElement('img');
      img.loading = 'lazy';
      img.src = galleryPath + file;
      // Use caption map when available; fall back to previous behavior
      var caption = captions[file] || (friendlyAlt(file) + ' — Amanda and Jordan');
      img.alt = caption;
      img.setAttribute('data-caption', caption);

      // On error, remove the figure so broken images don't show
      img.onerror = function () {
        if (fig && fig.parentNode) fig.parentNode.removeChild(fig);
      };

      fig.appendChild(img);
      grid.appendChild(fig);
    });

    // After building the gallery, wire up lightbox handlers
    attachGalleryLightboxHandlers();
  }

  /* Lightbox implementation */
  var lightboxState = {
    images: [], // array of {src, alt, caption}
    currentIndex: -1
  };

  function collectGalleryImages() {
    var grid = document.getElementById(galleryContainerId);
    if (!grid) return [];
    var imgs = grid.querySelectorAll('img');
    var arr = Array.prototype.slice.call(imgs).map(function (img) {
      return { src: img.src, alt: img.alt || '', caption: img.getAttribute('data-caption') || img.alt || '' };
    });
    return arr;
  }

  function openLightbox(index) {
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-image');
    var lbCaption = document.getElementById('lightbox-caption');
    if (!lb || !lbImg) return;

    lightboxState.images = collectGalleryImages();
    if (!lightboxState.images || lightboxState.images.length === 0) return;

    lightboxState.currentIndex = Math.max(0, Math.min(index, lightboxState.images.length - 1));
    var meta = lightboxState.images[lightboxState.currentIndex];

    lbImg.src = meta.src;
    lbImg.alt = meta.alt || '';
    lbCaption.textContent = meta.caption || meta.alt || '';

    lb.setAttribute('aria-hidden', 'false');
    // trap focus on the lightbox close button
    var closeBtn = lb.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    var lb = document.getElementById('lightbox');
    var lbImg = document.getElementById('lightbox-image');
    if (!lb) return;
    lb.setAttribute('aria-hidden', 'true');
    if (lbImg) {
      lbImg.src = '';
      lbImg.alt = '';
    }
    lightboxState.currentIndex = -1;
  }

  function showNext() {
    if (lightboxState.currentIndex < lightboxState.images.length - 1) {
      openLightbox(lightboxState.currentIndex + 1);
    }
  }
  function showPrev() {
    if (lightboxState.currentIndex > 0) {
      openLightbox(lightboxState.currentIndex - 1);
    }
  }

  function attachGalleryLightboxHandlers() {
    var grid = document.getElementById(galleryContainerId);
    if (!grid) return;

    // delegate click events from the grid (works for dynamically added images too)
    grid.addEventListener('click', function (ev) {
      var target = ev.target;
      // if clicked on an image (or inside a figure), find the img
      if (target && target.tagName === 'IMG') {
        // find the index of this image in the collected list
        var imgs = collectGalleryImages();
        var clickedSrc = target.src;
        var idx = imgs.findIndex(function (i) { return i.src === clickedSrc; });
        if (idx >= 0) {
          ev.preventDefault();
          openLightbox(idx);
        }
      }
    });

    // Lightbox controls
    var lb = document.getElementById('lightbox');
    if (!lb) return;
    var closeBtn = lb.querySelector('.lightbox-close');
    var nextBtn = lb.querySelector('.lightbox-next');
    var prevBtn = lb.querySelector('.lightbox-prev');

    // Close handlers
    if (closeBtn) closeBtn.addEventListener('click', function () { closeLightbox(); });
    lb.addEventListener('click', function (ev) {
      // close when clicking on the overlay (but not when clicking on the content)
      if (ev.target === lb) closeLightbox();
    });

    // Prev/Next
    if (nextBtn) nextBtn.addEventListener('click', function (ev) { ev.stopPropagation(); showNext(); });
    if (prevBtn) prevBtn.addEventListener('click', function (ev) { ev.stopPropagation(); showPrev(); });

    // Keyboard support
    document.addEventListener('keydown', function (ev) {
      var lbVisible = lb && lb.getAttribute('aria-hidden') === 'false';
      if (!lbVisible) return;
      if (ev.key === 'Escape') {
        closeLightbox();
      } else if (ev.key === 'ArrowRight') {
        showNext();
      } else if (ev.key === 'ArrowLeft') {
        showPrev();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHomeGallery);
  } else {
    buildHomeGallery();
  }
})();
