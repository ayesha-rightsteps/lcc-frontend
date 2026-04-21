const AUTH = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
};

const HEALTH = {
  BASE: '/health',
  DETAILED: '/health/detailed',
};

const API_ENDPOINTS = {
  AUTH,
  HEALTH,
};

export default API_ENDPOINTS;
