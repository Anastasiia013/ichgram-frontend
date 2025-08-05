import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

import type { RootState } from "../../redux/store";
import { selectAuthUser, selectToken } from "../../redux/auth/auth-selectors";

const PrivateRoute: React.FC = () => {
  const user = useSelector((state: RootState) => selectAuthUser(state));
  const token = useSelector((state: RootState) => selectToken(state));
  const loading = useSelector((state: RootState) => state.auth.loading);

  if (!user && token && loading) {
    return <p>Loading...</p>;
  }

  if (!user && !token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
