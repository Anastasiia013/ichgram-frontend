import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuth } from "../../redux/auth/auth-selectors";

const PublicRoute: React.FC = () => {
  const { isAuthenticated, loading } = useSelector(selectAuth);

  if (loading) return <p>Loading...</p>;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default PublicRoute;
