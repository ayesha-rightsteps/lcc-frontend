const AUTH = {
  LOGIN: '/auth/login',
};

const USERS = {
  STUDENTS: '/users/students',
  HEARTBEAT: '/users/heartbeat',
  LOCATION_DENIED: '/users/location-denied',
  UPDATE: (id) => `/users/${id}/update`,
  STATUS: (id) => `/users/${id}/status`,
  RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
  SET_PASSWORD: (id) => `/users/${id}/set-password`,
  IPS: (id) => `/users/${id}/ips`,
};

const TICKETS = {
  BASE: '/tickets',
  MY_TICKETS: '/tickets/my',
  REPLY: (id) => `/tickets/${id}/reply`,
  STATUS: (id) => `/tickets/${id}/status`,
};

const CONSULTATIONS = {
  BASE: '/consultations',
  MY: '/consultations/my-consultations',
  ACCEPT: (id) => `/consultations/${id}/accept`,
  REJECT: (id) => `/consultations/${id}/reject`,
  COMPLETE: (id) => `/consultations/${id}/complete`,
};

const REPORTS = {
  SUMMARY: '/reports/summary',
  EXPIRING: '/reports/students/expiring',
  CONSULTATIONS: '/reports/consultations',
  TICKETS: '/reports/tickets',
  SUSPICIOUS_IPS: '/reports/suspicious-ips',
  RADAR: (id) => `/reports/student/${id}/radar`,
  STUDENT_GROWTH: '/reports/student-growth',
  TICKET_TREND: '/reports/ticket-trend',
  CONSULTATION_TREND: '/reports/consultation-trend',
  ALERT_BREAKDOWN: '/reports/alert-breakdown',
};

const SECURITY = {
  ALERTS: '/security/alerts',
  REVIEW: (id) => `/security/alerts/${id}/review`,
};

const LIBRARY = {
  MY: '/library/my',
  CATEGORIES: '/library/categories',
  CATEGORY: (id) => `/library/categories/${id}`,
  SUBCATEGORIES: '/library/subcategories',
  CONTENT: '/library/content',
  ACCESS: (studentId) => `/library/access/${studentId}`,
  MANAGE_ACCESS: '/library/access',
};

const API_ENDPOINTS = { AUTH, USERS, TICKETS, CONSULTATIONS, REPORTS, SECURITY, LIBRARY };

export default API_ENDPOINTS;
