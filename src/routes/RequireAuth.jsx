import { Navigate } from "react-router";

function RequireAuth({ session, children }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default RequireAuth;