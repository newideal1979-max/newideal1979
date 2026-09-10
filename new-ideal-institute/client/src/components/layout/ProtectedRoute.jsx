import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children }) {
  const { firebaseUser, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container-institute py-24 text-fabric-500">Loading…</div>;
  if (!firebaseUser) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { firebaseUser, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="container-institute py-24 text-fabric-500">Loading…</div>;
  if (!firebaseUser) return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}
