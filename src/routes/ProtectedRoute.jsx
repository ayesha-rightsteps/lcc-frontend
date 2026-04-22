import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export default ProtectedRoute;
