import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const Integration = ({ navigation }) => {
  // State to store the fetched customer list
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);  // Loading state to show a loading indicator

  useEffect(() => {
    console.log('useEffect triggered');
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/get-customer-list", {
        headers: {
          Authorization: 'Bearer 2|laravel_sanctum_5NMXdskxMn7bn6e05Z4MdvQ94GD1FZjw9OZrvyPQ0e57010d'
        }
      });
      console.log("Data fetched successfully:", res.data);

      // Set the fetched data to state (accessing the `data` field)
      setCustomers(res.data.data || []);  // Now using res.data.data to access customers
      setLoading(false);  // Set loading to false once the data is loaded
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);  // Hide loading in case of an error
    }
  };

  // Render customer list item
  const renderCustomerItem = ({ item }) => (
    <View style={styles.customerItem}>
      <Text style={styles.customerName}>{item.name}</Text>
      <Text>{item.email}</Text>  {/* Assuming the customer has 'name' and 'email' fields */}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Integration</Text>
      </View> */}

      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={customers}  // List of customers
          keyExtractor={(item) => item.id.toString()}  // Assuming each customer has an 'id' field
          renderItem={renderCustomerItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f1f1", padding: 10 },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "red", padding: 15, borderRadius: 10, marginBottom: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold" },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 18 },
  customerItem: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  customerName: { fontSize: 18, fontWeight: "bold" },
});

export default Integration;
