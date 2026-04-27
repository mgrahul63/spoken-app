import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">🗣️</div>
          <p className="text-slate-500 font-bold">Loading SpeakUp...</p>
        </div>
      </div>
    );
  }

  return user ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
