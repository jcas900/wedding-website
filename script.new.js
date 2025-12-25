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
      img.alt = friendlyAlt(file) + ' — Amanda and Jordan';

      // On error, remove the figure so broken images don't show
      img.onerror = function () {
        if (fig && fig.parentNode) fig.parentNode.removeChild(fig);
      };

      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildHomeGallery);
  } else {
    buildHomeGallery();
  }
})();

