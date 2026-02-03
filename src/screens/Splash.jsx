import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate a network request or some initialization before navigating
    setTimeout(() => {
      // After a delay, navigate to the Login screen
      navigation.replace("Login");
    }, 3000); // 3 seconds for the splash screen
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../Assets/images/FUTUREKEY-HOMES-3.1.png')} style={{ width: 200, height: 200 }} />
      <Text style={styles.text}>Welcome to the App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
    marginTop: 20,
    fontWeight: "bold",
  },
});

export default SplashScreen;
