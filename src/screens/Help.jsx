import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native'
import Ionicons from "react-native-vector-icons/Ionicons";

const Help = ({ navigation }) => {

  const handleCallPress = () => {
    Linking.openURL('tel:+1234567890'); // Replace with the actual phone number
  };
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.header}>
               <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                 <Ionicons name="arrow-back" size={24} color="white" />
               </TouchableOpacity>
               <Text style={styles.headerText}>Help</Text>
             </View> */}
      <View style={styles.dflex}>
        <Text style={{ fontSize: 20, fontWeight: 600, padding: 10 }}>
          Support No - 1234567890
        </Text>
        <Text style={{ fontSize: 25, backgroundColor: "red", padding: 10, borderRadius: 10, color: "#fff" }} onPress={handleCallPress}>
          Call Now
        </Text>
      </View>


    </ScrollView>
  )
}
const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#f1f1f1", padding: 10, },
  header: { flexDirection: "row", alignItems: "center", backgroundColor: "red", padding: 15, borderRadius: 10, marginBottom: 15 },
  backButton: { marginRight: 10 },
  headerText: { color: "white", fontSize: 20, fontWeight: "bold" },

  dflex: {
    fontSize: 30,
    display: "flex",
    flexDirection: "row",
    gap: 20
  }

})

export default Help