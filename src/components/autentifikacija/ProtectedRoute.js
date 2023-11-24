import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ component: Component, adminOnly, stjuardesaOnly, ...rest }) => {
  const { checkAdminRole, checkStjuardesaRole } = useAuth();

  useEffect(() => {
    if (adminOnly && !checkAdminRole()) {
      console.log('Nemate ovlasti za pristup ovoj stranici.');
    }

    if (stjuardesaOnly && !checkStjuardesaRole()) {
      console.log('Nemate ovlasti za pristup ovoj stranici.');
    }
  }, [adminOnly, stjuardesaOnly, checkAdminRole, checkStjuardesaRole]);

  return (
    <Route
      {...rest}
      render={(props) =>
        (adminOnly && !checkAdminRole()) || (stjuardesaOnly && !checkStjuardesaRole()) ? ( // Vracanje na pocetnoj stranici ako neko proba bez role da ide na druge stranice
          <Redirect to="/pocetna" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default ProtectedRoute;