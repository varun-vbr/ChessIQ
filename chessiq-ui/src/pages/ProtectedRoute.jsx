import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:3002/api/v1/user/protect", {
          credentials: "include",
        });

        setIsAuthenticated(res.status === 200);
      } catch (err) {
        setIsAuthenticated(false);
        console.log(err);
      }
    }

    checkAuth();
  }, []);

  // ⏳ While checking auth
  if (isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ Logged in
  return children;
}

export default ProtectedRoute;
