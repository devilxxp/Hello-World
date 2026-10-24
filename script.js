/**
 * Shree Ganeshay namah — Sacred Intro Experience & Stage Animation Controller
 */

(() => {
  'use strict';

  // DOM Elements
  const introScreen = document.getElementById('intro-screen');
  const enterBtn = document.getElementById('enter-btn');
  const replayBtn = document.getElementById('replay-btn');
  const soundToggle = document.getElementById('sound-toggle');
  const progressBar = document.getElementById('intro-progress-bar');
  const countdownEl = document.getElementById('countdown-text');
  const stage = document.querySelector('.stage');

  // State
  let soundEnabled = true;
  let isTransitioning = false;
  let autoTimer = null;
  let progressInterval = null;
  const TOTAL_DURATION_MS = 4500;
  let remainingTimeMs = TOTAL_DURATION_MS;

  /**
   * Generates an authentic sacred temple bell harmonic resonance using Web Audio API.
   * Completely offline, self-contained, zero external audio assets required.
   */
  function playTempleChime() {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Temple bell harmonics (Root: 528 Hz - Solfeggio Love/Miracle frequency)
      const harmonics = [
        { freq: 528, gain: 0.32, decay: 3.8, type: 'sine' },
        { freq: 1056, gain: 0.16, decay: 2.8, type: 'sine' },
        { freq: 1584, gain: 0.08, decay: 2.1, type: 'triangle' },
        { freq: 2112, gain: 0.04, decay: 1.5, type: 'sine' },
        { freq: 3168, gain: 0.02, decay: 0.9, type: 'triangle' },
      ];

      harmonics.forEach(({ freq, gain, decay, type }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        gainNode.gain.setValueAtTime(gain, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // Audio context may be restricted by autoplay policy until user gesture
    }
  }

  /**
   * Transition from Intro Screen to Main Stage
   */
  function enterExperience(withSound = true) {
    if (isTransitioning) return;
    isTransitioning = true;

    // Clear timers
    clearTimeout(autoTimer);
    clearInterval(progressInterval);

    if (withSound) {
      playTempleChime();
    }

    if (introScreen) {
      introScreen.classList.add('intro-screen--fading');
    }

    // Trigger main stage entrance animations
    setTimeout(() => {
      if (stage) {
        stage.classList.add('stage--active');
      }
      document.body.classList.remove('intro-active');

      if (introScreen) {
        introScreen.classList.add('intro-screen--hidden');
        introScreen.classList.remove('intro-screen--fading');
      }
      isTransitioning = false;
    }, 700);
  }

  /**
   * Starts countdown and animated progress bar
   */
  function startIntroSequence() {
    isTransitioning = false;
    remainingTimeMs = TOTAL_DURATION_MS;

    if (progressBar) {
      progressBar.style.width = '0%';
      // Force reflow
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${TOTAL_DURATION_MS}ms linear`;
      progressBar.style.width = '100%';
    }

    const intervalStep = 200;
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
      remainingTimeMs -= intervalStep;
      const secondsLeft = Math.max(1, Math.ceil(remainingTimeMs / 1000));
      if (countdownEl) {
        countdownEl.textContent = String(secondsLeft);
      }
    }, intervalStep);

    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => {
      enterExperience(false);
    }, TOTAL_DURATION_MS);
  }

  /**
   * Replay the Intro Screen from the main page
   */
  function replayIntro() {
    if (isTransitioning) return;

    // Reset stage
    if (stage) {
      stage.classList.remove('stage--active');
    }
    document.body.classList.add('intro-active');

    // Show intro screen
    if (introScreen) {
      introScreen.classList.remove('intro-screen--hidden', 'intro-screen--fading');
      introScreen.style.display = 'flex';
      void introScreen.offsetWidth; // Force reflow
    }

    // Play auspicious bell chime upon replay
    playTempleChime();

    // Restart sequence
    startIntroSequence();
  }

  // --- Attach Event Listeners ---

  if (enterBtn) {
    enterBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      enterExperience(true);
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      replayIntro();
    });
  }

  if (soundToggle) {
    soundToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('sound-toggle--muted', !soundEnabled);
      soundToggle.setAttribute('aria-label', soundEnabled ? 'Mute Chime Sound' : 'Unmute Chime Sound');
      soundToggle.title = soundEnabled ? 'Chime sound: ON (Click to mute)' : 'Chime sound: OFF (Click to unmute)';

      if (soundEnabled) {
        playTempleChime();
      }
    });
  }

  // Clicking on intro screen background (outside buttons) skips to main screen
  if (introScreen) {
    introScreen.addEventListener('click', (e) => {
      // Don't trigger if clicked on an interactive button
      if (e.target.closest('button') || e.target.closest('a')) return;
      enterExperience(true);
    });
  }

  // Keyboard accessibility: Enter, Space, or Escape enters main stage
  window.addEventListener('keydown', (e) => {
    if (document.body.classList.contains('intro-active') && !isTransitioning) {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
        e.preventDefault();
        enterExperience(true);
      }
    }
  });

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('intro-active');
    startIntroSequence();
  });

  // If already loaded
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    document.body.classList.add('intro-active');
    startIntroSequence();
  }
})();
