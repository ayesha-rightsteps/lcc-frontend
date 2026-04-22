const AUTH = {
  LOGIN: '/auth/login',
};

const USERS = {
  STUDENTS: '/users/students',
  HEARTBEAT: '/users/heartbeat',
  STATUS: (id) => `/users/${id}/status`,
  RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
  IPS: (id) => `/users/${id}/ips`,
};

const CONTENT = {
  MY_CONTENT: '/content/my-content',
  BASE: '/content',
  STREAM: (id) => `/content/${id}/stream`,
  ACCESS: (id) => `/content/${id}/access`,
};

const TICKETS = {
  BASE: '/tickets',
  MY_TICKETS: '/tickets/my-tickets',
  REPLY: (id) => `/tickets/${id}/reply`,
  STATUS: (id) => `/tickets/${id}/status`,
};

const CONSULTATIONS = {
  BASE: '/consultations',
  MY: '/consultations/my-consultations',
  ACCEPT: (id) => `/consultations/${id}/accept`,
  REJECT: (id) => `/consultations/${id}/reject`,
  STATUS: (id) => `/consultations/${id}/status`,
};

const REPORTS = {
  SUMMARY: '/reports/summary',
  SUSPICIOUS_IPS: '/reports/suspicious-ips',
  RADAR: (id) => `/reports/student/${id}/radar`,
  CONTENT_LOGS: '/reports/content-logs',
};

const SECURITY = {
  ALERTS: '/security/alerts',
  REVIEW: (id) => `/security/alerts/${id}/review`,
};

const API_ENDPOINTS = { AUTH, USERS, CONTENT, TICKETS, CONSULTATIONS, REPORTS, SECURITY };

export default API_ENDPOINTS;
