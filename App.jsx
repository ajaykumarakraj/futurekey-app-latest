import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/Navigators/AppNavigator';
import * as Animatable from 'react-native-animatable';
// import ApiClient from './src/component/ApiClient'; // Optional

const App = () => {
  const [notification, setNotification] = useState(null);

  // Request notification permission on Android 13+
  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Notification permission denied');
          return;
        }
      }

      await getFcmToken();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  // Register device and get FCM token
  const getFcmToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      // TODO: Send token to your backend API if needed
      // await ApiClient.post('/update-fcm-token', { user_id: '1', fcm_token: token });

    } catch (error) {
      console.error('FCM token error:', error);
    }
  };

  // Listen for foreground FCM messages
  const listenForForegroundMessages = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      if (remoteMessage?.notification) {
        setNotification(remoteMessage.notification);

        // Auto-hide banner after 4 seconds
        setTimeout(() => setNotification(null), 4000);
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    requestNotificationPermission();
    const unsubscribe = listenForForegroundMessages();

    return () => {
      unsubscribe(); // Clean up the listener on unmount
    };
  }, []);

  return (
    <AuthProvider>
      <View style={{ flex: 1 }}>
        <AppNavigator />

        {notification && (
          <Animatable.View
            animation="slideInDown"
            duration={500}
            style={styles.notificationBanner}
          >
            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationBody}>{notification.body}</Text>
          </Animatable.View>
        )}
      </View>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  notificationBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#333',
    padding: 15,
    zIndex: 9999,
    elevation: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationBody: {
    color: '#fff',
    marginTop: 5,
  },
});

export default App;
