import axios from 'axios';

const ApiClient = axios.create({
  baseURL: 'https://api.almonkdigital.in/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


ApiClient.interceptors.response.use(
  response => response,

  async error => {

    if (error.response?.status === 401) {
 await AsyncStorage.removeItem('USER_DATA');
 await AsyncStorage.removeItem('FILTER_DATA');
  await AsyncStorage.removeItem('token');
      global.logoutUser?.();

    }

    return Promise.reject(error);
  }
);

export default ApiClient;