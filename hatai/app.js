/* 
 * Hathai Udaipur - Premium Modern Café Website
 * Designed by KAAGAZ
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initHeaderScroll();
  initAudioPlayer();
  initCursorGlow();
  initRooftopSlider();
  initScrollReveal();
});

/* ==========================================
   1. LOADING SCREEN
   ========================================== */
function initLoader() {
  const loader = document.getElementById('loaderScreen');
  if (!loader) return;

  // Add load event or fallback timeout
  window.addEventListener('load', hideLoader);
  
  // Fallback: hide loader after 3.5 seconds anyway
  setTimeout(hideLoader, 3500);

  function hideLoader() {
    if (!loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      // Trigger Hero text reveal animation classes if needed, 
      // though CSS is already handled via keyframes.
    }
  }
}

/* ==========================================
   2. HEADER SCROLL EFFECT
   ========================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================
   3. AMBIENT MUSIC CONTROLS
   ========================================== */
function initAudioPlayer() {
  const audio = document.getElementById('ambientAudio');
  const toggleBtn = document.getElementById('audioToggle');
  
  if (!audio || !toggleBtn) return;

  // Set initial lower volume for relaxing ambient background
  audio.volume = 0.25;

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      // Play audio and activate waves
      audio.play().then(() => {
        toggleBtn.classList.add('audio-playing');
      }).catch(err => {
        console.log("Audio play blocked by browser policy. User interaction required first.", err);
      });
    } else {
      // Pause audio and deactivate waves
      audio.pause();
      toggleBtn.classList.remove('audio-playing');
    }
  });
}

/* ==========================================
   4. CUSTOM MOUSE GLOW & FOLLOW
   ========================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  const dot = document.getElementById('cursorDot');
  
  if (!glow || !dot) return;

  let mouseX = 0;
  let mouseY = 0;
  let glowX = 0;
  let glowY = 0;

  // Track real mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Instant dot movement
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  // Smooth lerp follow for the glow circle (adds luxurious fluid feel)
  function animateGlow() {
    const dx = mouseX - glowX;
    const dy = mouseY - glowY;
    
    glowX += dx * 0.08;
    glowY += dy * 0.08;
    
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    
    requestAnimationFrame(animateGlow);
  }
  
  animateGlow();

  // Hover animations on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, select, textarea, [onclick], .gallery-item, .event-card, .menu-tab-btn');
  
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(2.5)';
      dot.style.backgroundColor = 'var(--earth-brown)';
      dot.style.opacity = '0.35';
      glow.style.width = '550px';
      glow.style.height = '550px';
    });
    
    item.addEventListener('mouseleave', () => {
      dot.style.transform = 'translate(-50%, -50%) scale(1)';
      dot.style.backgroundColor = 'var(--earth-brown)';
      dot.style.opacity = '1';
      glow.style.width = '400px';
      glow.style.height = '400px';
    });
  });
}

/* ==========================================
   5. INTERACTIVE DAY / NIGHT SLIDER
   ========================================== */
function initRooftopSlider() {
  const container = document.getElementById('sliderContainer');
  const slider = document.getElementById('sliderRange');
  const nightPane = document.getElementById('nightPane');
  const handle = document.getElementById('sliderHandle');
  
  if (!container || !slider || !nightPane || !handle) return;

  // Initialize at 50%
  updateSlider(50);

  slider.addEventListener('input', (e) => {
    const val = e.target.value;
    updateSlider(val);
  });

  function updateSlider(val) {
    // Reveal night overlay width based on slider percentage
    nightPane.style.width = `${val}%`;
    
    // Position slider split handle
    handle.style.left = `${val}%`;

    // Toggle active state for labels
    if (val > 10) {
      container.classList.add('pane-night-active');
    } else {
      container.classList.remove('pane-night-active');
    }
  }
}

/* ==========================================
   6. SCROLL REVEAL ANIMATIONS
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Trigger once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => observer.observe(element));
  } else {
    // Fallback if Intersection Observer is not supported
    reveals.forEach(element => element.classList.add('revealed'));
  }
}

/* ==========================================
   7. CULINARY MENU PREVIEW TABS
   ========================================== */
window.switchMenuTab = function(category) {
  // Get all buttons and panes
  const tabs = document.querySelectorAll('.menu-tab-btn');
  const panes = document.querySelectorAll('.menu-pane');
  
  // Deactivate active states
  tabs.forEach(tab => tab.classList.remove('active'));
  panes.forEach(pane => pane.classList.remove('active'));
  
  // Find clicked button and matching pane
  const activeBtn = Array.from(tabs).find(tab => tab.getAttribute('onclick').includes(category));
  const activePane = document.getElementById(`tab-${category}`);
  
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) {
    activePane.classList.add('active');
  }
};

/* ==========================================
   8. EVENTS HORIZONTAL SCROLLER
   ========================================== */
window.scrollEvents = function(direction) {
  const track = document.getElementById('eventsTrack');
  if (!track) return;
  
  const cardWidth = 400; // Flex card basis (380px) + gap (2rem = 32px)
  const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
  
  track.scrollBy({
    left: scrollAmount,
    behavior: 'smooth'
  });
};

/* ==========================================
   9. RESERVATION MODAL & ACTIONS
   ========================================== */
const modal = document.getElementById('reservationModal');
const bookingForm = document.getElementById('bookingForm');
const successScreen = document.getElementById('successScreen');
const modalTitle = document.querySelector('.modal-title');

window.openReservationModal = function() {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Stop background scrolling
  
  // Set minimum date picker limit to today
  const dateInput = document.getElementById('formDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }
};

window.closeReservationModal = function() {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = 'auto'; // Re-enable background scrolling
  
  // Reset fields and views after transition closes
  setTimeout(() => {
    if (bookingForm) bookingForm.style.display = 'flex';
    if (successScreen) successScreen.style.display = 'none';
    if (modalTitle) modalTitle.style.display = 'block';
    if (bookingForm) bookingForm.reset();
  }, 500);
};

// Handle booking submission
window.handleFormSubmit = function(e) {
  e.preventDefault();
  
  const name = document.getElementById('formName').value;
  const guests = document.getElementById('formGuests').value;
  const date = document.getElementById('formDate').value;
  const time = document.getElementById('formTime').value;

  // Format date readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Populate values in the success screen
  document.getElementById('successGuests').textContent = guests;
  document.getElementById('successDate').textContent = formattedDate;
  document.getElementById('successTime').textContent = time;

  // Fade view transition
  if (bookingForm) bookingForm.style.display = 'none';
  if (modalTitle) modalTitle.style.display = 'none';
  if (successScreen) successScreen.style.display = 'flex';
};
