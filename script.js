/* ═══════════════════════════════════════════════════════════════════
   BANDWAR — FAMOUS PERSONALITIES
   script.js
   ═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM ELEMENTS ─── */
  const filterTabs = document.querySelectorAll('.filter-tabs button');
  const cards = document.querySelectorAll('.person-card');
  const grid = document.querySelector('.personalities-grid');
  const searchInput = document.querySelector('#personality-search');

  /* ═══════════════════════════════════════════════════════════════════
     1. FILTER FUNCTIONALITY
     ═══════════════════════════════════════════════════════════════════ */
  function filterCards(filter) {
    let visibleCount = 0;

    cards.forEach((card) => {
      const category = card.getAttribute('data-category') || '';
      const categories = category.split(' '); // multiple categories support

      if (filter === 'all' || categories.includes(filter)) {
        card.style.display = '';
        // Trigger fade-in animation
        card.style.animation = 'none';
        void card.offsetWidth; // reflow trick
        card.style.animation = 'fadeInUp 0.4s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show / hide empty state
    updateEmptyState(visibleCount);
  }

  /* ─── FILTER TAB CLICK HANDLER ─── */
  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active from all
      filterTabs.forEach((t) => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter') || 'all';
      filterCards(filter);

      // Update URL hash (optional, for shareable links)
      history.replaceState(null, '', `#${filter}`);
    });
  });

  /* ═══════════════════════════════════════════════════════════════════
     2. SEARCH FUNCTIONALITY (Optional)
     ═══════════════════════════════════════════════════════════════════ */
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      cards.forEach((card) => {
        const name = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const role = card.querySelector('.role')?.textContent.toLowerCase() || '';
        const bio = card.querySelector('.bio')?.textContent.toLowerCase() || '';
        const allText = `${name} ${role} ${bio}`;

        if (query === '' || allText.includes(query)) {
          card.style.display = '';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      updateEmptyState(visibleCount);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     3. EMPTY STATE HANDLER
     ═══════════════════════════════════════════════════════════════════ */
  function updateEmptyState(visibleCount) {
    if (!grid) return;

    let emptyState = grid.querySelector('.empty-state');

    if (visibleCount === 0) {
      if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
          <div class="icon">🔍</div>
          <h3>Koi personality nahi mili</h3>
          <p>Kisi aur category ya naam se try karo.</p>
        `;
        grid.appendChild(emptyState);
      }
      emptyState.style.display = 'block';
    } else if (emptyState) {
      emptyState.style.display = 'none';
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     4. URL HASH SUPPORT (on page load)
     ═══════════════════════════════════════════════════════════════════ */
  function loadFromHash() {
    const hash = window.location.hash.replace('#', '').trim();
    if (!hash) return;

    const matchingTab = Array.from(filterTabs).find(
      (tab) => tab.getAttribute('data-filter') === hash
    );

    if (matchingTab) {
      filterTabs.forEach((t) => t.classList.remove('active'));
      matchingTab.classList.add('active');
      filterCards(hash);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════
     5. KEYBOARD NAVIGATION FOR FILTER TABS
     ═══════════════════════════════════════════════════════════════════ */
  const tabsContainer = document.querySelector('.filter-tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('keydown', (e) => {
      const tabsArray = Array.from(filterTabs);
      const currentIndex = tabsArray.indexOf(document.activeElement);

      if (currentIndex === -1) return;

      let newIndex = currentIndex;

      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabsArray.length;
      } else if (e.key === 'ArrowLeft') {
        newIndex = (currentIndex - 1 + tabsArray.length) % tabsArray.length;
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        tabsArray[currentIndex].click();
        return;
      } else {
        return;
      }

      e.preventDefault();
      tabsArray[newIndex].focus();
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     6. LAZY LOADING FOR IMAGES (native fallback)
     ═══════════════════════════════════════════════════════════════════ */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('.person-card img').forEach((img) => {
      img.setAttribute('loading', 'lazy');
    });
  }

  /* ═══════════════════════════════════════════════════════════════════
     7. INIT
     ═══════════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    // If URL has hash, load that filter; otherwise show all
    if (window.location.hash) {
      loadFromHash();
    } else {
      filterCards('all');
    }
  });

  // In case DOMContentLoaded already fired
  if (document.readyState !== 'loading') {
    if (window.location.hash) {
      loadFromHash();
    }
  }
})();