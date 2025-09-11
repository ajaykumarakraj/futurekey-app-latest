import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SelectList } from 'react-native-dropdown-select-list';

const UpadateMasterSetting = ({ route, navigation }) => {
  const { user } = route.params;
  const [name, setName] = useState(user.name);

  const [number, setNumber] = useState(user.phoneNumber);
  const [email, setEmail] = useState("");




  const handleSave = () => {

    navigation.goBack();
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Update Master Setting</Text>
        </View>

        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />


        {/* Number  */}
        <TextInput style={styles.input} value={number} onChangeText={setNumber} placeholder="Mobile No." />
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />




        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UpadateMasterSetting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 10
  },
  headerText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 3,
  },
  pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden', // Ensures no parts of the picker go outside the container
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
