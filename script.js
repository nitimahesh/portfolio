
// ===== CLOCK =====
function updateClock() {
  const now = new Date();
  const opts = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
  document.getElementById('clock').textContent = now.toLocaleDateString('en-US', opts);
}
updateClock();
setInterval(updateClock, 10000);

// ===== OVERLAYS =====
function openOverlay(name, tab) {
  // Close any open overlays first
  document.querySelectorAll('.overlay-backdrop.active').forEach(el => el.classList.remove('active'));

  const overlay = document.getElementById(name + '-overlay');
  overlay.classList.add('active');

  // Notes: switch to correct tab
  if (name === 'notes' && tab) {
    switchTab(tab);
  }

  // Spotify: load embed only when opened
  if (name === 'spotify') {
    const iframe = document.getElementById('spotify-embed');
    if (!iframe.src || iframe.src === '' || iframe.src === window.location.href) {
      iframe.src = 'https://open.spotify.com/embed/track/51H2y6YrNNXcy3dfc3qSbA?theme=0';
    }
  }
}

function closeOverlay(name) {
  document.getElementById(name + '-overlay').classList.remove('active');
  // Pause spotify when closing
  if (name === 'spotify') {
    document.getElementById('spotify-embed').src = '';
  }
}

function closeOnBackdrop(e, name) {
  if (e.target === e.currentTarget) closeOverlay(name);
}

// ===== NOTES TABS =====
function switchTab(tab) {
  document.querySelectorAll('.notes-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + tab));
}

// ===== NOTIFICATION =====
function playNotificationChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    
    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.08);
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.4);

    // Second tone (harmonic)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.06);
    gain2.gain.setValueAtTime(0, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

let notificationShown = false;

function showNotification() {
  document.getElementById('notification').classList.add('show');
  notificationShown = true;
}

// Show notification after entrance animation completes
setTimeout(() => {
  showNotification();
  playNotificationChime();
}, 5500);

// On first click after notification: re-slide with sound
document.addEventListener('click', function() {
  if (notificationShown) {
    document.getElementById('notification').classList.remove('show');
    setTimeout(() => {
      document.getElementById('notification').classList.add('show');
      playNotificationChime();
    }, 300);
  }
}, { once: true });

// ===== KEYBOARD =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.overlay-backdrop.active').forEach(el => {
      const name = el.id.replace('-overlay', '');
      closeOverlay(name);
    });
  }
});
