import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from '../components/common/PageLoader';

const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/unauthorized" replace />;

  return <Outlet />;
};

export default AdminRoute;
