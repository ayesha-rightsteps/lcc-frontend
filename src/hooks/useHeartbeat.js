import { useEffect } from 'react';
import api from '../services/api.js';
import API_ENDPOINTS from '../constants/api-endpoints.js';

const INTERVAL_MS = 10 * 60 * 1000;

const getLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({});
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ lat: coords.latitude, lng: coords.longitude }),
      () => resolve({})
    );
  });

const sendHeartbeat = async () => {
  const location = await getLocation();
  api.post(API_ENDPOINTS.USERS.HEARTBEAT, location).catch(() => {});
};

const useHeartbeat = (active = true) => {
  useEffect(() => {
    if (!active) return;

    sendHeartbeat();

    const interval = setInterval(sendHeartbeat, INTERVAL_MS);
    return () => clearInterval(interval);
  }, [active]);
};

export default useHeartbeat;
