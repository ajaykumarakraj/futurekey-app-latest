import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import api from "../../component/ApiClient";
import { useRoute } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const UpdateUserForm = ({ navigation }) => {
  const route = useRoute();
  const { userdata } = route.params;
  const { user, token } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(null);
  const [teamLeaderList, setTeamLeaderList] = useState([]);
  const [selectedTeamLeader, setSelectedTeamLeader] = useState(null);
  const [deviceLogin, setDeviceLogin] = useState(null);
  const [crmAccess, setCrmAccess] = useState(null);

  const genderItems = [
    { key: "Male", value: "Male" },
    { key: "Female", value: "Female" },
  ];

  const roleItems = [
    { key: "1", value: "Admin" },
    { key: "2", value: "Team Leader" },
    { key: "3", value: "Agent" },
  ];

  const crmItems = [
    { key: "1", value: "Active" },
    { key: "0", value: "Inactive" },
  ];

  const deviceItems = [
    { key: "1", value: "Yes" },
    { key: "0", value: "No" },
  ];

  useEffect(() => {
    const loadUserDetails = async () => {
      try {
        const res = await api.get(`https://api.almonkdigital.in/api/admin/get-user/${userdata.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.status === 200) {
          const user = res.data.data;
          console.log("get", user)
          setName(user.name || "");
          setPhone(user.phone || "");
          setGender(user.gender || null);
          setEmail(user.email || "");
          setRole(String(user.role));
          setSelectedTeamLeader(user.team_leader_name || "");
          setCrmAccess(user.crm_app_access);
          setDeviceLogin(user.login_device);
          setTeamLeaderList(user.all_team_leader || []);
        } else {
          Alert.alert("Error", "Unexpected user response");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data");
      }
    };

    loadUserDetails();
  }, []);

  const handleUpdate = async () => {
    const formData = {
      user_id: userdata.user_id,
      name,
      email,
      phone,
      gender,
      role,
      teamleader: role === "3" ? selectedTeamLeader : "",
      crm_app_access: crmAccess,
      login_device: deviceLogin,
    };
    console.log("send for update", formData)
    try {
      const res = await api.post(`http://api.almonkdigital.in/api/admin/update-user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 200) {
        Alert.alert("Success", "User updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Failed to update user");
      }
    } catch (error) {
      Alert.alert("Error", "Submission failed");
    }
  };
  console.log(role)
  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.title}>Edit User</Text> */}
      <View style={{ paddingBottom: 100 }}>
        <View style={styles.section} >
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <Text style={styles.label}>Number</Text>
          <TextInput
            placeholder="Contact Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="numeric"
            maxLength={11}
            style={styles.input}
          />
          <Text style={styles.label}>Gender</Text>
          <View style={styles.dropdown}>
            <SelectList
              data={genderItems}
              setSelected={setGender}
              placeholder={gender || "Select Gender"}

              save="value"
              search={false}
            />
          </View>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Login Details</Text>
          <Text style={styles.label}>Login Role</Text>
          <View style={styles.dropdown}>
            <SelectList
              data={roleItems}
              setSelected={setRole}
              placeholder={roleItems.find(r => r.key === role)?.value || "Select Role"}
              // defaultOption={{ key: role, value: roleItems.find(r => r.key === role)?.value }}
              save="key"
              search={false}
            />
          </View>

          {role === "3" && (
            <>
              <Text style={styles.label}>Team Leader</Text>
              <View style={styles.dropdown}>

                <SelectList
                  data={teamLeaderList.map(leader => ({
                    key: leader.team_leader_id,
                    value: leader.name
                  }))}
                  setSelected={setSelectedTeamLeader}
                  placeholder={selectedTeamLeader}

                  // save="key"
                  search={false}
                />
              </View>
            </>
          )}
          <Text style={styles.label}>Login Access</Text>
          <View style={styles.dropdown}>
            <SelectList
              data={crmItems}
              setSelected={setCrmAccess}
              placeholder={crmItems.find(c => c.key === crmAccess)?.value || "CRM/APP Access"}

              save="key"
              search={false}
            />
          </View>
          <Text style={styles.label}>Single Device</Text>
          <View style={styles.dropdown}>
            <SelectList
              data={deviceItems}
              setSelected={setDeviceLogin}
              placeholder={deviceItems.find(d => d.key === deviceLogin)?.value || "Single Device Login"}
              defaultOption={{ key: deviceLogin, value: deviceItems.find(d => d.key === deviceLogin)?.value }}
              save="key"
              search={false}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginVertical: 16,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  dropdown: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    // fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 4,
    color: '#333',
  },
  button: {
    backgroundColor: "#003961",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

});

export default UpdateUserForm;
