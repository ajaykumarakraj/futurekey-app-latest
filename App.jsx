import React, { useEffect, useState } from 'react';
import {
  Alert,
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';

import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/Navigators/AppNavigator';
import * as Animatable from 'react-native-animatable';

const App = () => {
  const [notification, setNotification] = useState(null);

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

      await requestToken();
    } catch (error) {
      console.error('Permission error:', error);
    }
  };

  const requestToken = async () => {
    try {
      const app = getApp();
      const messaging = getMessaging(app);

      await registerDeviceForRemoteMessages(messaging);
      const token = await getToken(messaging);
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Token error:', error);
    }
  };

  const listenForMessages = () => {
    const messaging = getMessaging(getApp());

    const unsubscribe = onMessage(messaging, async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      if (remoteMessage?.notification) {
        setNotification(remoteMessage.notification);

        // Auto-hide banner after 4 seconds ok
        setTimeout(() => setNotification(null), 4000);
      }
    });

    return unsubscribe;
  };

  useEffect(() => {
    requestNotificationPermission();
    const unsubscribe = listenForMessages();
    return unsubscribe; // Cleanup on unmount
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
