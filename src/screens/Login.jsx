import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import axios from "axios"; // Import Axios
import Icon from 'react-native-vector-icons/Ionicons';
import ApiClient from "../component/ApiClient";
const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOTP = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      Alert.alert("Invalid", "Please enter a valid phone number");
      return;
    }

    try {
      // Using Axios to send the OTP request
      const response = await ApiClient.post('/send-login-otp', {
        mobile: phoneNumber, // or "mobile" based on backend spec
      });

      const data = response.data;
      console.log("API Response:", data);  // Log the complete response for inspection

      // Check if the API response is successful
      if (data.status === 200) {
        Alert.alert("OTP Sent", `OTP has been sent to ${phoneNumber}`);
        // Navigate to OTP screen and pass the phone number and generated OTP
        navigation.navigate("OTPScreen", { phoneNumber, generatedOTP: data.otp });
      } else if (data.status === 500) {
        // Handle specific error if the number is not registered
        Alert.alert("Error", "Your number is not registered. Please check or register first.");
      } else {
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageset}>
        <Image source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')} style={{ width: 300, height: 200 }} />
      </View>
      <Text style={styles.title}>Login</Text>
      <Icon name="call-outline" size={20} color="#666" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        maxLength={10}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, ''); // Remove all non-digits
          setPhoneNumber(numericText);
        }}
      />
      <TouchableOpacity style={styles.button} onPress={sendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", paddingLeft: 30, marginBottom: 10, borderRadius: 5, fontSize: 17 },
  button: { backgroundColor: "#003961", padding: 15, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  imageset: {
    margin: "auto"
  },
  icon: {
    top: 32,
    left: 5,
    position: "relative"
  }

});

export default Login;
