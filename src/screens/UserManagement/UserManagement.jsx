import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import ApiClient from "../../component/ApiClient";
import { useAuth } from "../../context/AuthContext";
import { useIsFocused } from '@react-navigation/native';
const UserManagement = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [expandedRowId, setExpandedRowId] = useState(null);  // Track which row is expanded
  const [isLoading, setIsLoading] = useState(true);          // Loading state
  const { user, token } = useAuth();
  useEffect(() => {
    if (isFocused) {
      userData();
    }

  }, [isFocused]);

  // Fetch user data from API
  const userData = async () => {
    try {
      const res = await ApiClient.get("/user-list", {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      });

      // Check for successful response and valid data
      if (res.data.status === 200 && Array.isArray(res.data.data)) {
        setData(res.data.data);
      } else {
        Alert.alert("Error", res.data.message || "Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Network or server issue occurred.");
    } finally {
      setIsLoading(false); // Set loading to false once the data is fetched
    }
  };

  // Toggle the expanded row
  const handleReadMore = useCallback((userId) => {
    setExpandedRowId((prevId) => (prevId === userId ? null : userId));  // Toggle between expanded and collapsed
  }, []);

  // Render the header component with back and add user buttons
  const renderHeader = () => (
    <View style={styles.header}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity> */}
      <Text style={styles.headerText}>User Management</Text>
      <TouchableOpacity onPress={() => navigation.navigate("AddUser")} style={styles.admin}>
        <Image
          source={require("../../../Assets/icons/add-friend.png")}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
    </View>
  );

  // Render each user item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.tableRow}>
        <View style={styles.firstdata}>
          <Text style={styles.cell}>{item.name || "N/A"}</Text>
          <Text style={styles.cell}>{item.phone || "N/A"}</Text>

          {/* Button to toggle expansion of row */}
          <TouchableOpacity
            onPress={() => handleReadMore(item.user_id)}
            style={styles.readMoreButton}
          >
            <Ionicons
              name={expandedRowId === item.user_id ? 'chevron-up' : 'chevron-down'}
              size={16}
              color="#003961"
            />
          </TouchableOpacity>

          {/* Button to navigate to update user screen */}
          <TouchableOpacity
            onPress={() => navigation.navigate("UpdateUser", { userdata: item })}
            style={styles.updateButton}
          >
            <Ionicons name="create-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>

        {/* Show expanded user details when expanded */}
        {expandedRowId === item.user_id && (
          <View style={styles.detailedInfo}>
            <Text style={styles.extraText}>Name: {item.name || "N/A"}</Text>
            <Text style={styles.extraText}>Email: {item.email || "N/A"}</Text>
            <Text style={styles.extraText}>Role: {item.role || "N/A"}</Text>
            <Text style={styles.extraText}>Team Leader: {item.assign_team_leader || "N/A"}</Text>

            <Text style={styles.extraText}>Phone Number: {item.phone || "N/A"}</Text>
          </View>
        )}
      </View>
    );
  };
  console.log(data)
  return isLoading ? (
    // Show loading indicator while fetching data
    <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
      <ActivityIndicator size="large" color="#003961" />
    </View>
  ) : (
    // Show data after fetching is complete
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={(item) => item?.user_id?.toString()} // Use user_id as unique key
      renderItem={renderItem}
      extraData={expandedRowId} // Important for re-rendering when expanded row changes
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
          No users found.
        </Text>
      }
    />
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003961",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerText: {

    color: "white",
    fontSize: 14,
    // fontWeight: "bold",
  },
  admin: {
    position: "absolute",
    right: 20,
  },
  tableRow: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  firstdata: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 5,
  },
  readMoreButton: {
    padding: 8,
  },
  updateButton: {
    padding: 8,
  },
  detailedInfo: {
    backgroundColor: "#f3f3f3",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  extraText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
});
