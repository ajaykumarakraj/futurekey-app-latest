import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ApiClient from '../component/ApiClient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { user, token } = useAuth();
  const [data, setData] = useState({});

  const onRefresh = () => {
    setRefreshing(true);
    numData(); // ✅ fixed
    setTimeout(() => setRefreshing(false), 1500);
  };

  useEffect(() => {
    if (user?.user_id && token) {
      numData();
    }

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <Ionicons
            name="filter-outline"
            size={24}
            color="#000"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
      headerTitle: 'Dashboard',
    });
  }, [user, token, navigation]);

  const numData = async () => {
    try {
      const res = await ApiClient.get(`/get-home-screen-data/${user.user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === 200) {
        setData(res.data.data);
        console.log('Dashboard data:', res.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const goToTable = (leadType) => {
    navigation.navigate('Table', { leadType });
  };

  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View style={styles.container}>

        <View style={styles.row}>
          {user?.role === "Admin" && (
            <LeadBox title="Fresh Leads" count={data.fresh_lead} icon={require('../../Assets/icons/user-engagement.png')} onPress={() => goToTable('fresh_lead')} />
          )}
          <LeadBox title="New Leads" count={data.new_lead} icon={require('../../Assets/icons/user-engagement.png')} onPress={() => goToTable('new_lead')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Hot Leads" count={data.hot_lead} icon={require('../../Assets/icons/hot-deal.png')} onPress={() => goToTable('hot_lead')} />
          <LeadBox title="Today's Site Visits" count={data.today_site_visit} icon={require('../../Assets/icons/map.png')} onPress={() => goToTable('today_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Missed Followups" count={data.missed_follow_up} icon={require('../../Assets/icons/miss.png')} onPress={() => goToTable('missed_follow_up')} />
          <LeadBox title="Tomorrow's Site Visits" count={data.tomorrow_site_visit} icon={require('../../Assets/icons/3d-map.png')} onPress={() => goToTable('tomorrow_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="Today's Followups" count={data.today_follow_up} icon={require('../../Assets/icons/add-user.png')} onPress={() => goToTable('today_follow_up')} />
          <LeadBox title="Scheduled Site Visits" count={data.scheduled_site_visit} icon={require('../../Assets/icons/question-mark.png')} onPress={() => goToTable('scheduled_site_visit')} />
        </View>

        <View style={styles.row}>
          <LeadBox title="In Process Leads" count={data.in_process} icon={require('../../Assets/icons/progress.png')} onPress={() => goToTable('in_process')} />
          <LeadBox title="Archived Leads" count={data.archived_lead} icon={require('../../Assets/icons/location.png')} onPress={() => goToTable('archived_lead')} />
        </View>

        <LeadBox title="Converted" count={data.converted} icon={require('../../Assets/icons/users.png')} onPress={() => goToTable('converted')} />
      </View>
    </ScrollView>
  );
};

const LeadBox = ({ title, count, icon, onPress }) => (
  <TouchableOpacity style={styles.box} onPress={onPress}>
    <Image source={icon} style={{ width: 35, height: 35 }} />
    <Text style={styles.boxText}>{title}</Text>
    <Text style={styles.boxnumber}>{count || 0}</Text>
  </TouchableOpacity>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  box: {
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  boxText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  boxnumber: {
    fontWeight: 'bold',
    fontSize: 17,
  },
});
