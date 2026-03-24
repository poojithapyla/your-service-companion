import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireRole?: "user" | "partner";
}

// Allow any authenticated user when no requireRole/requireAdmin specified

const ProtectedRoute = ({ children, requireAdmin, requireRole }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireRole && userRole !== requireRole && !isAdmin) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
