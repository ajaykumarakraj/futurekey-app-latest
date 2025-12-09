import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ApiClient from "../component/ApiClient";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Invalid", "Please enter a valid 10 digit number");
      return;
    }

    try {
      const response = await ApiClient.post("/send-login-otp", {
        mobile: phoneNumber,
      });

      const data = response.data;

      if (data.status === 200) {
        Alert.alert("OTP Sent", `OTP sent to ${phoneNumber}`);
        navigation.navigate("OTPScreen", {
          phoneNumber,
          generatedOTP: data.otp,
        });
      } else {
        Alert.alert("Error", "Failed to send OTP");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* LOGO */}
            <View style={styles.imageset}>
              <Image
                source={require("../../Assets/images/FUTUREKEY-HOMES-3.1.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>Login</Text>

            {/* INPUT */}
            <View style={styles.inputWrapper}>
              <Icon name="call-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Enter Mobile Number"
                keyboardType="number-pad"
                maxLength={10}
                returnKeyType="done"
                blurOnSubmit
                value={phoneNumber}
                onChangeText={(text) =>
                  setPhoneNumber(text.replace(/[^0-9]/g, ""))
                }
              />
            </View>

            {/* BUTTON */}
            <TouchableOpacity style={styles.button} onPress={sendOTP}>
              <Text style={styles.buttonText}>Send OTP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  container: {
    paddingHorizontal: width * 0.07,
  },

  imageset: {
    alignItems: "center",
    marginBottom: height * 0.04,
  },

  logo: {
    width: width * 0.55,
    height: height * 0.12,
  },

  title: {
    fontSize: width * 0.08,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: height * 0.03,
    color: "#003961",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: height * 0.025,
  },

  input: {
    flex: 1,
    fontSize: width * 0.045,
    paddingVertical: 12,
    marginLeft: 8,
  },

  button: {
    backgroundColor: "#003961",
    paddingVertical: height * 0.018,
    borderRadius: 6,
  },

  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    textAlign: "center",
    fontWeight: "600",
  },
});
