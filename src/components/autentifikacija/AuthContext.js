import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = Cookies.get('userData'); // Pribavljanje sve podatke o korisniku da bi mogla da se utvrdi rola 

    if (userData) {
      try {
        const userObject = JSON.parse(userData);
        setUser({
          idKorisnika: userObject.idKorisnika,
          korisnickoIme: userObject.korisnickoIme,
          ime: userObject.ime,
          prezime: userObject.prezime,
          brojTelefona: userObject.brojTelefona,
          email: userObject.email,
          rola: userObject.rola,
          token: userObject.token,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setLoading(false);
  }, []);

  const checkAdminRole = () => {
    return !loading && user && user.rola === 'admin';
  };

  const checkStjuardesaRole = () => {
    return !loading && user && user.rola === 'stjuardesa';
  };

  return (
    <AuthContext.Provider value={{ user, checkAdminRole, checkStjuardesaRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};