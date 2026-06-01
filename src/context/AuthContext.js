import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

import ApiClient from '../component/ApiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOAD AUTH =================

  useEffect(() => {

    const loadAuthData = async () => {

      try {

        const credentials =
          await Keychain.getGenericPassword();

        const storedUser =
          await AsyncStorage.getItem('USER_DATA');

        if (credentials && storedUser) {

          setToken(credentials.password);

          setUser(JSON.parse(storedUser));
        }

      } catch (err) {

        console.log('Load Auth Error:', err);

      } finally {

        setLoading(false);
      }
    };

    loadAuthData();

  }, []);

  // ================= LOGIN =================

  const login = async (userData, userToken) => {

    try {

      // Save token securely
      await Keychain.setGenericPassword(
        'userToken',
        userToken
      );

      // Save user data
      await AsyncStorage.setItem(
        'USER_DATA',
        JSON.stringify(userData)
      );

      setToken(userToken);
      setUser(userData);

    } catch (e) {

      console.log('Login Error:', e);
    }
  };

  // ================= LOGOUT =================

  const logout = useCallback(
    async (callApi = true) => {

      try {

        // Manual logout pe hi API call
        if (callApi && token) {

          const payload = {
            user_id: user?.user_id,
          };

          await ApiClient.post(
            '/user-logout',
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

      } catch (error) {

        console.log('Logout API Error:', error);

      } finally {

        // Always clear local data

        await Keychain.resetGenericPassword();

        await AsyncStorage.multiRemove([
          'USER_DATA',
          'FILTER_DATA',
          'token',
          'handlSubmit',
          'handlSubmitTL',
        ]);

        setToken(null);
        setUser(null);
      }
    },
    [token, user]
  );

  // ================= GLOBAL LOGOUT =================

  useEffect(() => {

    global.logoutUser = logout;

    return () => {
      global.logoutUser = null;
    };

  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};