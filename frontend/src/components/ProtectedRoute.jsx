import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.tipo)) {
    return <Navigate to="/" replace />; // Redireciona para home se não tiver a permissão
  }

  return <Outlet />;
};
export default ProtectedRoute;