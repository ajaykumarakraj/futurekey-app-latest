import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';

const OTPScreen = () => {
  const { login } = useAuth();
  const route = useRoute();
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = text;
      setOtp(updatedOtp);

      if (index < 3) inputs.current[index + 1].focus();
    } else if (text === '') {
      const updatedOtp = [...otp];
      updatedOtp[index] = '';
      setOtp(updatedOtp);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    try {
      const response = await ApiClient.post('/verify-login-otp', {
        mobile: phoneNumber,
        otp: enteredOtp,
      });

      if (response.data.status === 200 && response.data.data) {
        await login(response.data.data, response.data.token);
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        Alert.alert('Invalid OTP', response.data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Failed to verify OTP. Try again.');
    }
  };

  const resendOTP = async () => {
    try {
      const response = await ApiClient.post('/resend-otp', { mobile: phoneNumber });
      if (response.data.status === 200) {
        Alert.alert('Success', 'OTP resent successfully!');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert('Error', 'Something went wrong while resending OTP.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.imageset}>
          <Image
            source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')}
            style={{ width: 300, height: 200 }}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.verififytext}>OTP Verification</Text>
        <Text style={styles.info}>Enter the 4-digit code sent to your number</Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              ref={(ref) => (inputs.current[index] = ref)}
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity onPress={resendOTP}>
          <Text style={styles.resend}>Resend OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  imageset: {
    alignItems: 'center',
    marginBottom: 20,
  },
  verififytext: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  info: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#555',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    width: 55,
    height: 55,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  resend: {
    color: '#d11a2a',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#003961',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OTPScreen;
