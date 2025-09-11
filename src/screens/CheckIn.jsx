import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
// import { getCurrentLocation } from '../component/Location';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation, { requestAuthorization } from 'react-native-geolocation-service';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';
const CheckIn = () => {
  const [checkedIn, setcheckedIn] = useState(false)
  const [coords, setCoords] = useState()
  const { user, token } = useAuth();
  const handleCheckIn = () => {
    getCurrentLocation()
    setcheckedIn(true)
    getvalue()
  }
  const handleCheckOut = () => {
    setcheckedIn(false)
    getCurrentLocation()
    getvalue()
  }

  const getvalue = async () => {
    try {
      const res = await ApiClient.post("/check-in", {
        type: "checkout",
        user_id: "1",
        latitude: coords.latitude,
        longitude: coords.longitude
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
      )

      if (res.status === 200) {
        console.log("ok", res.data)
        Alert.alert("mark status", res.data.message)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Network or server issue occurred.');
    }
  }


  const getCurrentLocation = async () => {
    try {
      // ✅ Step 1: Request Permission
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      // ✅ Step 2: Get Location
      Geolocation.getCurrentPosition(
        (position) => {
          console.log('📍 Location:', position.coords);
          setCoords(position.coords)
          console.log(`Latitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`)
        },
        (error) => {
          console.warn('❌ Location Error:', error.message);
          Alert.alert('Error Getting Location', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        }
      );
    } catch (err) {
      console.error('Location Exception:', err);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      return true; // iOS handled via Info.plist
    }
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

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };
  // console.log(position.coords)
  // console.log("check", coords.longitude)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In/Check Out</Text>
      {
        !checkedIn ?
          <TouchableOpacity style={styles.button} onPress={handleCheckIn}><Text style={styles.buttonText}>Check In</Text></TouchableOpacity>
          : <TouchableOpacity style={[styles.button, styles.checkoutButton]} onPress={handleCheckOut}><Text style={styles.buttonText}>Check Out</Text></TouchableOpacity>
      }
    </View>
  )
}

export default CheckIn;
const styles = StyleSheet.create(
  {
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20
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
  }
)
