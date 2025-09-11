// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('TOKEN');
        const storedUser = await AsyncStorage.getItem('USER_DATA');
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error loading auth data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = async (userData, userToken) => {
    await AsyncStorage.setItem('TOKEN', userToken);
    await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('TOKEN');
    await AsyncStorage.removeItem('USER_DATA');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
