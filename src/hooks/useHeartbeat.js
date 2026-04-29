import { useEffect, useRef } from 'react';
import api from '../services/api.js';
import API_ENDPOINTS from '../constants/api-endpoints.js';

const INTERVAL_MS = 10 * 60 * 1000;
const LOCATION_TIMEOUT_MS = 15000;

const getLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ denied: true });
      return;
    }
    const timer = setTimeout(() => resolve({ denied: true }), LOCATION_TIMEOUT_MS);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        clearTimeout(timer);
        resolve({ lat: coords.latitude, lng: coords.longitude, denied: false });
      },
      () => {
        clearTimeout(timer);
        resolve({ denied: true });
      },
      { timeout: LOCATION_TIMEOUT_MS, maximumAge: 60000 }
    );
  });

const showBlockedScreen = () => {
  let el = document.getElementById('__lcc_blocked__');
  if (el) return;
  el = document.createElement('div');
  el.id = '__lcc_blocked__';
  Object.assign(el.style, {
    position: 'fixed', inset: '0', zIndex: '2147483647',
    background: '#0a0a0a',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '16px',
  });
  el.innerHTML = `
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <p style="color:#e53e3e;font-family:monospace;font-size:1rem;letter-spacing:0.1em;text-transform:uppercase;margin:0;font-weight:700">Account Suspended</p>
    <p style="color:rgba(255,255,255,0.5);font-family:monospace;font-size:0.78rem;margin:0;text-align:center;max-width:320px;line-height:1.6">
      Location access is required to use this platform.<br/>Your account has been suspended. Contact admin.
    </p>
  `;
  document.body.appendChild(el);
};

const useHeartbeat = (active = true, onLogout) => {
  const onLogoutRef = useRef(onLogout);
  useEffect(() => { onLogoutRef.current = onLogout; }, [onLogout]);

  useEffect(() => {
    if (!active) return;

    const sendHeartbeat = async () => {
      const location = await getLocation();

      if (location.denied) {
        showBlockedScreen();
        try {
          await api.post(API_ENDPOINTS.USERS.LOCATION_DENIED, {});
        } catch {}
        setTimeout(() => onLogoutRef.current?.(), 2000);
        return;
      }

      try {
        const res = await api.post(API_ENDPOINTS.USERS.HEARTBEAT, {
          lat: location.lat,
          lng: location.lng,
        });
        const data = res?.data?.data;
        if (data?.isBlocked) {
          showBlockedScreen();
          setTimeout(() => onLogoutRef.current?.(), 2000);
        }
      } catch {}
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [active]);
};

export default useHeartbeat;
