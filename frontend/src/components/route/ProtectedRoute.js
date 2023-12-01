import React, { Fragment } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          element={
            isAuthenticated ? (
              <Component />
            ) : (
              // Use the navigate function for redirection
              () => {
                navigate("/login");
                return null;
              }
            )
          }
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;
