import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) return <div>Загрузка...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
}




