import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import HomeTableList from "../screens/HomeTableList";
import UpdateScreen from "../screens/UpdateScreen";
import UserManagement from "../screens/UserManagement/UserManagement";
import Help from "../screens/Help";
import Notice from "../screens/Notice";
import MasterSetting from "../screens/MasterSetting";
import Integration from "../screens/Integration";
import ShareScreen from "../screens/ShareScreen";
import Setting from "../screens/Setting";
import AddUser from "../screens/UserManagement/AddUser";
import UpdateUser from "../screens/UserManagement/UpdateUser";
import UpadateMaterSetting from "../screens/UpadateMasterSetting";
import AddMasterSetting from "../screens/AddMasterSetting";

import TabNavigator from "./Tabnavigator";
import FilterMain from "../screens/FilterMain";
import CheckIn from "../screens/CheckIn";
import FilterTableList from "../screens/FilterTableList";
import FilterHomeScreen from "../screens/FilterHomeScreen";

const Stack = createNativeStackNavigator();

const FilterButton = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
    <Icon name="filter-outline" size={24} color="#000" style={{ marginRight: 12 }} />
  </TouchableOpacity>
);

const MainStack = () => (
  <Stack.Navigator
    screenOptions={({ navigation }) => ({
      headerShown: true,
      headerTitle: '',
      headerRight: () => <FilterButton navigation={navigation} />,
    })}
  >
    {/* ❌ No header or filter in TabNavigator */}
    <Stack.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={{ headerShown: false }}
    />

    {/* ✅ All screens below will show header + filter icon */}
    <Stack.Screen name="Table" component={HomeTableList} />
    <Stack.Screen name="filtertable" component={FilterTableList}/>
    <Stack.Screen name="filterHomeScreen" component={FilterHomeScreen}/>
    <Stack.Screen name="Filter" component={FilterMain} />
    <Stack.Screen name="UpdateScreen" component={UpdateScreen} />
    <Stack.Screen name="AddUser" component={AddUser} />
    <Stack.Screen name="UpdateUser" component={UpdateUser} />
    <Stack.Screen name="UserManagement" component={UserManagement} />
    <Stack.Screen name="Help" component={Help} />
    <Stack.Screen name="Notice" component={Notice} />
    <Stack.Screen name="MasterSetting" component={MasterSetting} />
    <Stack.Screen name="Integration" component={Integration} />
    <Stack.Screen name="UpadateMaterSetting" component={UpadateMaterSetting} />
    <Stack.Screen name="AddMasterSetting" component={AddMasterSetting} />
    <Stack.Screen name="ShareScreen" component={ShareScreen} />
    <Stack.Screen name="Setting" component={Setting} />
    <Stack.Screen name="CheckIn" component={CheckIn} />
  </Stack.Navigator>
);

export default MainStack;
