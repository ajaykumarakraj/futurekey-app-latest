import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, PermissionsAndroid, Platform, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';

const CheckIn = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const { user, token } = useAuth();

  // Request permission with better handling
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      console.log('iOS Location permission:', auth);
      return auth === 'granted';
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location for check-in.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      console.log('Android permission result:', granted);

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Permission Denied',
          'Location permission has been permanently denied. Please enable it from settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
        return false;
      } else {
        Alert.alert('Permission Denied', 'Location permission is required for check-in.');
        return false;
      }
    } catch (err) {
      console.warn('Permission error:', err);
      return false;
    }
  };

  // Get current location with proper permission check
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      return null;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location:', position.coords);
          resolve(position.coords);
        },
        (error) => {
          console.warn('Location error:', error.code, error.message);
          Alert.alert('Location Error', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    });
  };

  // Send check-in/out request
  const getvalue = async (coords, type) => {
    if (!coords) {
      Alert.alert('Error', 'Location data is not available.');
      return;
    }

    try {
      const res = await ApiClient.post('/check-in', {
        type,
        user_id: user?.id || '1',
        latitude: coords.latitude,
        longitude: coords.longitude,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        console.log('✅ Success:', res.data);
        Alert.alert('Status', res.data.message);
        setCheckedIn(type === 'checkin');
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      Alert.alert('Error', 'Network or server issue occurred.');
    }
  };

  const handleCheckIn = async () => {
    const location = await getCurrentLocation();
    if (location) {
      getvalue(location, 'checkin');
    }
  };

  const handleCheckOut = async () => {
    const location = await getCurrentLocation();
    if (location) {
      getvalue(location, 'checkout');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In/Check Out</Text>
      {!checkedIn ? (
        <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
          <Text style={styles.buttonText}>Check In</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.checkoutButton]} onPress={handleCheckOut}>
          <Text style={styles.buttonText}>Check Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CheckIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,              // Important for proper layout
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  checkoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
