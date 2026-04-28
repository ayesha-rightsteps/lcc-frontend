import { useEffect, useRef } from 'react';
import api from '../services/api.js';

const COOLDOWN_MS = 15000;
const lastSentAt = {};

const sendAlert = (alertType, description) => {
  const now = Date.now();
  if (lastSentAt[alertType] && now - lastSentAt[alertType] < COOLDOWN_MS) return;
  lastSentAt[alertType] = now;
  if (!localStorage.getItem('accessToken')) return;
  api.post('/security/alerts', { alertType, description }).catch(() => {});
};

export { sendAlert };

// --- Overlay ---
let overlayEl = null;
let hideTimer = null;

const showOverlay = (durationMs = 5000) => {
  if (!overlayEl) {
    overlayEl = document.createElement('div');
    overlayEl.id = '__lcc_shield__';
    Object.assign(overlayEl.style, {
      position: 'fixed',
      inset: '0',
      zIndex: '2147483647',
      background: '#000',
      display: 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px',
    });
    overlayEl.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      <p style="color:#c9a84c;font-family:monospace;font-size:0.9rem;letter-spacing:0.1em;text-transform:uppercase;margin:0">Content Protected</p>
      <p style="color:rgba(255,255,255,0.4);font-family:monospace;font-size:0.72rem;margin:0">This action has been reported to admin</p>
    `;
    document.body.appendChild(overlayEl);
  }
  overlayEl.style.display = 'flex';
  clearTimeout(hideTimer);
  if (durationMs > 0) hideTimer = setTimeout(hideOverlay, durationMs);
};

const hideOverlay = () => {
  if (overlayEl) overlayEl.style.display = 'none';
  clearTimeout(hideTimer);
};

const useAntiPiracy = (active = true) => {
  const recordingIntercepted = useRef(false);

  useEffect(() => {
    if (!active) return;

    // Global CSS protection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';

    // 0. Window blur — fires when Cmd+Shift+4 drag starts or user alt-tabs
    const onBlur = () => {
      showOverlay(0);
      sendAlert('screenshot_attempt', 'Window lost focus (possible screenshot/recording)');
    };
    const onFocus = () => hideOverlay();
    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);

    // 1. Right-click
    const onContextMenu = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      sendAlert('screenshot_attempt', 'Right-click attempt');
    };

    // 2. Copy / Cut
    const onCopy = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      showOverlay(5000);
      sendAlert('screenshot_attempt', 'Copy attempt blocked');
    };
    const onCut = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      showOverlay(5000);
      sendAlert('screenshot_attempt', 'Cut attempt blocked');
    };

    // 3. Drag
    const onDragStart = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    // 4. Keyboard
    const onKeydown = (e) => {
      const isDevTools =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['i', 'I', 'j', 'J', 'c', 'C', 'u', 'U'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['i', 'I', 'j', 'J', 'u', 'U'].includes(e.key));

      if (isDevTools) {
        e.preventDefault();
        e.stopImmediatePropagation();
        sendAlert('dev_tools_opened', `DevTools shortcut: ${e.key}`);
        return;
      }

      // PrintScreen (Windows)
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOverlay(5000);
        sendAlert('screenshot_attempt', 'PrintScreen key pressed');
      }

      // macOS screenshot: Cmd+Shift+3, 4, 5, S
      if (e.metaKey && e.shiftKey && ['3', '4', '5', 's', 'S'].includes(e.key)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOverlay(5000);
        sendAlert('screenshot_attempt', `macOS screenshot shortcut (Cmd+Shift+${e.key})`);
      }

      // Windows Snipping Tool: Win+Shift+S
      if (e.metaKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        e.stopImmediatePropagation();
        showOverlay(5000);
        sendAlert('screenshot_attempt', 'Windows Snipping Tool shortcut');
      }
    };

    // 5. getDisplayMedia intercept — screen share/recording
    if (navigator.mediaDevices?.getDisplayMedia && !recordingIntercepted.current) {
      recordingIntercepted.current = true;
      const original = navigator.mediaDevices.getDisplayMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getDisplayMedia = async function (...args) {
        showOverlay(0); // permanent until recording ends
        sendAlert('screen_recording', 'Screen recording/share attempt detected');
        const stream = await original(...args);
        stream.getVideoTracks().forEach(track => {
          track.addEventListener('ended', hideOverlay);
        });
        return stream;
      };
    }

    // Use capture: true so our handlers run BEFORE anything else
    document.addEventListener('contextmenu', onContextMenu, true);
    document.addEventListener('copy', onCopy, true);
    document.addEventListener('cut', onCut, true);
    document.addEventListener('dragstart', onDragStart, true);
    document.addEventListener('keydown', onKeydown, true);

    return () => {
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('contextmenu', onContextMenu, true);
      document.removeEventListener('copy', onCopy, true);
      document.removeEventListener('cut', onCut, true);
      document.removeEventListener('dragstart', onDragStart, true);
      document.removeEventListener('keydown', onKeydown, true);
    };
  }, [active]);
};

export default useAntiPiracy;
