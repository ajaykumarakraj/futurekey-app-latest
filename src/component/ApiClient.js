import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { AppState } from 'react-native';

const ApiClient = axios.create({
  baseURL: 'https://api.almonkdigital.in/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

ApiClient.interceptors.response.use(
  response => response,

  async error => {

    try {

      // Network error
      if (!error.response) {
        return Promise.reject(error);
      }

      const status = error.response.status;
      const requestUrl = error.config?.url;

      console.log('API ERROR:', status, requestUrl);

      // logout api ko ignore karo
      if (requestUrl?.includes('/user-logout')) {
        return Promise.reject(error);
      }

      // App active ho tabhi logout
      if (
        status === 401 &&
        AppState.currentState === 'active'
      ) {

        await Keychain.resetGenericPassword();

        await AsyncStorage.multiRemove([
          'USER_DATA',
          'FILTER_DATA',
          'token',
          'handlSubmit',
          'handlSubmitTL',
        ]);

        // local logout only
        global.logoutUser?.(false);
      }

    } catch (e) {
      console.log('Interceptor Error:', e);
    }

    return Promise.reject(error);
  }
);

export default ApiClient;