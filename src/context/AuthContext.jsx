import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, initLocalFallback } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLocalFallback();
    const storedUser = localStorage.getItem('hotelpro_current_user');
    const storedToken = localStorage.getItem('hotelpro_jwt_token');

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (e) {
        console.error('Error parsing stored auth session', e);
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    const result = await api.login(email, password);
    if (result && result.user) {
      setUser(result.user);
      setToken(result.token);
      return result;
    }
    return null;
  };

  const switchRole = (role) => {
    let name = 'Private Guest';
    let email = 'guest@hotelpro.com';
    let dept = 'Guest Relations';

    if (role === 'admin') {
      name = 'Sarah Montgomery (General Manager)';
      email = 'admin@hotelpro.com';
      dept = 'Executive Management';
    } else if (role === 'receptionist') {
      name = 'Liam Gallagher (Front Desk Supervisor)';
      email = 'frontdesk@hotelpro.com';
      dept = 'Hospitality & Front Desk';
    }

    const updatedUser = {
      id: `user-${role}`,
      name,
      email,
      role,
      department: dept,
    };

    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        ...updatedUser,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 604800,
      })
    )}.HotelProSignatureVerification`;

    setUser(updatedUser);
    setToken(mockToken);
    localStorage.setItem('hotelpro_current_user', JSON.stringify(updatedUser));
    localStorage.setItem('hotelpro_jwt_token', mockToken);
  };

  const logoutUser = () => {
    api.logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginUser,
        logoutUser,
        switchRole,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isStaff: user?.role === 'admin' || user?.role === 'receptionist',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
