import React, { useEffect, useState } from 'react';
import { Alert, View, Text, StyleSheet } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/Navigators/AppNavigator';
import * as Animatable from 'react-native-animatable';

const App = () => {
  const [notification, setNotification] = useState(null);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permission status:', authStatus);
      getFcmToken();
    } else {
      Alert.alert('Push notification permission denied');
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM Token:', fcmToken);
    }
  };

  const handleNotifications = () => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      setNotification(remoteMessage.notification);
      setTimeout(() => setNotification(null), 4000);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened from background:', remoteMessage.notification);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        }
      });

    return unsubscribe;
  };

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = handleNotifications();
    return unsubscribe;
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
