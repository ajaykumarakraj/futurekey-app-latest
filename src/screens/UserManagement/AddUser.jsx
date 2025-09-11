import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, ScrollView, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SelectList } from 'react-native-dropdown-select-list';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import ApiClient from '../../component/ApiClient';
const AddUser = ({ navigation }) => {
  const { user, token } = useAuth();
  const [name, setName] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loginAccess, setLoginAccess] = useState("");
  const [devicelogin, setDeviceLogin] = useState("");
  const [teamleader, setTeamleader] = useState("");
  const [teamLeaderList, setTeamLeaderList] = useState([]);
  const [agent, setAgent] = useState("");
  // Data for Gender options
  const genderData = [
    { value: 'Male' },
    { value: 'Female' },
    { value: 'Other' },
  ];
  // Data for project options
  const loginrole = [

    { key: '1', value: 'Admin' },
    { key: '2', value: 'Team Leader ' },
    { key: '3', value: 'Agent' },

  ];
  // Data for team leader options
  const loginaccess = [

    { key: '1', value: 'Active' },
    { key: '0', value: 'InActive' },


  ];
  // Data for team leader options
  const devive = [

    { key: '1', value: 'Yes' },
    { key: '0', value: 'No' },

  ];


  const handleSave = async () => {
    try {
      const formData = {
        name: name,
        email: email,
        phone: number,
        gender: selectedGender,
        role: role,
        teamleader: teamleader,
        login_device: loginAccess,
        crm_app_access: devicelogin,
      };
      console.log("post", formData)
      const res = await ApiClient.post(
        "/add-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Status:", res.status);
      console.log("Respo:", res.data);

      if (res.data.status === 200) {
        Alert.alert("Success", res.data.message || "Client added successfully!");
        navigation.goBack();
      }
      if (res.data.status === 500) {
        Alert.alert("Error", res.data.message || "Something went wrong");
      }

    } catch (error) {
      console.error("Error posting data:", error);
      if (error.response && error.response.data && error.response.data.message) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to add client. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (role === "3") {
      getteamLeader();
    }
  }, [role]);
  const getteamLeader = async () => {
    console.log("run")
    try {
      const resTL = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (resTL.status === 200) {

        setTeamLeaderList(resTL.data.data.map((tl) => ({ key: tl.user_id.toString(), value: tl.name })))
        console.log(resTL.data.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  console.log(teamLeaderList)
  console.log(role)
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add User</Text>
      </View> */}

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      {/* Gender Picker (without search) */}
      <View style={styles.pickerWrapper}>
        <SelectList
          data={genderData}
          setSelected={setSelectedGender}
          placeholder="Select Gender"
          search={false}  // Disable search
        />
      </View>
      {/* Number  */}
      <TextInput style={styles.input} value={number} onChangeText={setNumber} placeholder="Mobile No." />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" />


      {/* customer project (without search) */}
      <View style={styles.pickerWrapper}>
        <SelectList
          data={loginrole}
          setSelected={setRole}
          placeholder="Login Role"
          search={false}  // Disable search
        />
      </View>

      {role === "3" && (
        <View style={styles.pickerWrapper}>
          <SelectList
            data={teamLeaderList}

            setSelected={setTeamleader}
            placeholder="Select Team Leader"
            search={false}  // Disable search
          />
        </View>
      )

      }
      {/* team leader (without search) */}
      <View style={styles.pickerWrapper}>
        <SelectList
          data={loginaccess}
          setSelected={setLoginAccess}
          placeholder="Login Access"
          search={false}  // Disable search
        />
      </View>
      {/* Agent data (without search) */}
      <View style={styles.pickerWrapper}>
        <SelectList
          data={devive}
          setSelected={setDeviceLogin}
          placeholder="Single Device"
          search={false}  // Disable search
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AddUser;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003961",
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
    backgroundColor: "#003961",
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


