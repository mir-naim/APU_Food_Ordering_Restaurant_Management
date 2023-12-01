import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (user && allowedRoles.includes(user.role)) {
    return <Route element={element} />;
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default PrivateRoute;
