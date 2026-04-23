import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Loader from './components/ui/Loader.jsx';

const LandingPage = lazy(() => import('./pages/LandingPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const StudentDashboardPage = lazy(() => import('./pages/student/StudentDashboardPage.jsx'));
const StudentContentPage = lazy(() => import('./pages/student/StudentContentPage.jsx'));
const StudentTicketsPage = lazy(() => import('./pages/student/StudentTicketsPage.jsx'));
const StudentConsultationsPage = lazy(() => import('./pages/student/StudentConsultationsPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminStudentsPage = lazy(() => import('./pages/admin/AdminStudentsPage.jsx'));
const AdminContentPage = lazy(() => import('./pages/admin/AdminContentPage.jsx'));
const AdminTicketsPage = lazy(() => import('./pages/admin/AdminTicketsPage.jsx'));
const AdminConsultationsPage = lazy(() => import('./pages/admin/AdminConsultationsPage.jsx'));
const AdminReportsPage = lazy(() => import('./pages/admin/AdminReportsPage.jsx'));
const AdminSecurityPage = lazy(() => import('./pages/admin/AdminSecurityPage.jsx'));
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage.jsx'));

const App = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<Loader fullPage />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard/content" element={<ProtectedRoute><StudentContentPage /></ProtectedRoute>} />
          <Route path="/dashboard/tickets" element={<ProtectedRoute><StudentTicketsPage /></ProtectedRoute>} />
          <Route path="/dashboard/consultations" element={<ProtectedRoute><StudentConsultationsPage /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute adminOnly><AdminStudentsPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute adminOnly><AdminContentPage /></ProtectedRoute>} />
          <Route path="/admin/tickets" element={<ProtectedRoute adminOnly><AdminTicketsPage /></ProtectedRoute>} />
          <Route path="/admin/consultations" element={<ProtectedRoute adminOnly><AdminConsultationsPage /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReportsPage /></ProtectedRoute>} />
          <Route path="/admin/security" element={<ProtectedRoute adminOnly><AdminSecurityPage /></ProtectedRoute>} />
          <Route path="/admin/leads" element={<ProtectedRoute adminOnly><AdminLeadsPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  </AuthProvider>
);

export default App;