// src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute component to guard routes that require authentication.
 * @param {Object} props - Route properties.
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { authData } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        authData.token ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default ProtectedRoute;
