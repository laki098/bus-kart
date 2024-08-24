import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({
  component: Component,
  adminOnly,
  stjuardesaOnly,
  biletarOnly,
  ...rest
}) => {
  const { checkAdminRole, checkStjuardesaRole, checkBiletarRole } = useAuth();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const delay = 9;

    const timeoutId = setTimeout(() => {
      if (adminOnly && !checkAdminRole()) {
        setRedirect(true);
      }

      if (stjuardesaOnly && !checkStjuardesaRole()) {
        console.log("Nemate ovlasti za pristup ovoj stranici.");
        setRedirect(true);
      }

      if (biletarOnly && !checkBiletarRole()) {
        console.log("Nemate ovlasti za pristup ovoj stranici.");
        setRedirect(true);
      }

      // Dodatni uslov za prolazak kroz '/passwordreset/' rute
      if (window.location.pathname.includes("/passwordreset/")) {
        setRedirect(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [
    adminOnly,
    stjuardesaOnly,
    biletarOnly,
    checkAdminRole,
    checkStjuardesaRole,
    checkBiletarRole,
  ]);

  return redirect ? (
    <Redirect to="/pocetna" />
  ) : (
    <Route {...rest} render={(props) => <Component {...props} />} />
  );
};

export default ProtectedRoute;
