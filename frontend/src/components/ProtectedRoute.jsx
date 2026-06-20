import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // Si pas d'utilisateur connecté, rediriger vers Login
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    // Sinon, afficher les routes enfants (Dashboard, etc.)
    return <Outlet />;
};

export default ProtectedRoute;
