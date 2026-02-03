import React, { useState ,useEffect} from "react";
import { StyleSheet, TouchableOpacity, View, Text, Alert, Platform } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../context/AuthContext';
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

const FilterForm = ({ navigation }) => {
    const { user, token } = useAuth();
    const [currentForm, setCurrentForm] = useState("lead");   
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);


  const [teamleaderList, setTeamleaderList] = useState([]);
   const [teamleader, setTeamleader] = useState("");
  const [agentList, setAgentList] = useState([]);
  const [agent, setAgent] = useState("");



    const [leadsourcelist,setLeadsourceList]=useState([])
    const [leadsource,setLeadsource]=useState("facebook")

    const [leadType,setLeadType]=useState([])
    const [projectList,setProjectList]=useState([])
    const [project,setProject]=useState("all")

const LeadType=[,{value:"New Lead"},{value:"InProcess Lead"},{value:"Hot Lead"},{value:"Archived Lead"},{value:"Converted Lead"},{value:"Reassign Lead"}]
// console.log(project,"project")

// team Leader and agent list api 
  useEffect(() => {      
    fetchTeamLeaders();
  }, []);

const fetchTeamLeaders = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/get-team-leader", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setTeamleaderList(res.data.data.map((tl) => ({ key: tl.user_id.toString(), value: tl.name })));
      }
    } catch (error) {
      console.log("Team leader fetch error:", error);
    }
  };
useEffect(() => {
  if (user?.role === "Team Leader" && user?.user_id) {
    handleTeamLeaderSelect(user.user_id);
  }
}, [user?.role, user?.user_id]);

 const handleTeamLeaderSelect = async (id) => {
  if (!id) return;

  setTeamleader(id);

  try {
    const res = await axios.get(
      `https://api.almonkdigital.in/api/admin/get-agent/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status === 200) {
      setAgentList(
        res.data.data.map((ag) => ({
          key: ag.id.toString(),
          value: ag.name,
        }))
      );
    }
  } catch (error) {
    console.log("Agent fetch error:", error);
  }
};





// navigation section 

 const handlSubmit = () => {
    navigation.navigate('filtertable', { leadsource ,project,leadType,fromdate,todate,currentForm});
  };

// console.log(teamleader,agent)

   const handlSubmitTL = () => {
   if (!teamleader ) {
  Alert.alert(
    "Validation Error",
    "Please select Team Leader"
  );
  return;
}
if (!agent) {
  Alert.alert(
    "Validation Error",
    "Please select  Agent"
  );
  return;
}
    navigation.navigate('filterHomeScreen', { leadsource ,project,leadType,fromdate,todate,currentForm, teamleader,agent});
  };
    // date section 
  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

const fromdate=formatDate(fromDate)
const todate=formatDate(toDate)

const renderDateText = (date) => date ? date.toLocaleDateString() : 'Select date';

  const handleDateChange = (setter, setShow) => (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setter(selectedDate);
    }
  };


// get project and lead source 
useEffect(() => {
  fetchRequirements();
}, []); 
const fetchRequirements = async () => {
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/view-master-setting", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
    //  console.log(res.data)
        setLeadsourceList(
          res.data.data
            .filter((item) => item.cat_name === "Lead Source")
            .map((item) => ({ value: item.cat_value }))
        );
        setProjectList(
          res.data.data
            .filter((item) => item.cat_name === "Project")
            .map((item) => ({ value: item.cat_value }))
        );
      }
    } catch (error) {
      console.log("Requirement fetch error:", error);
    }
  };



// console.log(user.role)
// console.log(user.name)
// console.log(user)
    const renderForm = () => {
        switch (currentForm) {
            case "lead":
                return (
                    <View style={styles.form}>
                        {/* <Text style={styles.title}>Form 1 - Basic</Text> */}

                        {/* lead source Dropdown */}
                        <View style={styles.pickerWrapper}><SelectList data={leadsourcelist} setSelected={setLeadsource} placeholder="All Lead Source" search={false} /></View>

                       {/* Project Dropdown */}
                        <View style={styles.pickerWrapper}><SelectList data={projectList} setSelected={setProject} placeholder="All Project" search={false} /></View>
                       {/* lead type  */}
                        <View style={styles.pickerWrapper}><SelectList data={LeadType} setSelected={setLeadType} placeholder="Lead Status" search={false} /></View>
 {/* Date Pickers */}
    <View style={styles.datesec}>

  <View style={styles.dateBox}>
    <Text style={styles.label}>From Date</Text>
    <TouchableOpacity
      onPress={() => setShowFromPicker(true)}
      style={styles.dateButton}
    >
      <Text style={[styles.dateText, !fromDate && styles.placeholder]}>
        {renderDateText(fromDate)}
      </Text>
    </TouchableOpacity>

    {showFromPicker && (
      <DateTimePicker
        value={fromDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange(setFromDate, setShowFromPicker)}
      />
    )}
  </View>

  <View style={styles.dateBox}>
    <Text style={styles.label}>To Date</Text>
    <TouchableOpacity
      onPress={() => setShowToPicker(true)}
      style={styles.dateButton}
    >
      <Text style={[styles.dateText, !toDate && styles.placeholder]}>
        {renderDateText(toDate)}
      </Text>
    </TouchableOpacity>

    {showToPicker && (
      <DateTimePicker
        value={toDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange(setToDate, setShowToPicker)}
      />
    )}
  </View>

</View>
  <TouchableOpacity style={styles.submitButton} onPress={handlSubmit}>
                <Text style={styles.submitText} >Submit</Text>
            </TouchableOpacity>

                    </View>
                );

            case "TL/Agent":
                return (
                     <View style={styles.form}>
                        {/* <Text style={styles.title}>Form 1 - Basic</Text> */}
<View
  style={styles.pickerWrapper}
  pointerEvents={user.role === "Team Leader" ? "none" : "auto"}
>
  <SelectList
    data={teamleaderList}
    setSelected={handleTeamLeaderSelect}
    placeholder={
      user.role === "Team Leader" ? user.name : "Team Leader"
    }
    search={true}
    boxStyles={
      user.role === "Team Leader"
        ? { backgroundColor: "#eee", opacity: 0.8 }
        : {}
    }
  />
</View>


        <View style={styles.pickerWrapper}><SelectList data={agentList} setSelected={setAgent} placeholder="Agent" search={false} /></View>
                        {/* lead source Dropdown */}
                        <View style={styles.pickerWrapper}><SelectList data={leadsourcelist} setSelected={setLeadsource} placeholder="All Lead Source" search={false} /></View>

                       {/* Project Dropdown */}
                        <View style={styles.pickerWrapper}><SelectList data={projectList} setSelected={setProject} placeholder="All Project" search={false} /></View>
                       {/* lead type  */}
                        <View style={styles.pickerWrapper}><SelectList data={LeadType} setSelected={setLeadType} placeholder="Lead Status" search={false} /></View>
 {/* Date Pickers */}
    <View style={styles.datesec}>

  <View style={styles.dateBox}>
    <Text style={styles.label}>From Date</Text>
    <TouchableOpacity
      onPress={() => setShowFromPicker(true)}
      style={styles.dateButton}
    >
      <Text style={[styles.dateText, !fromDate && styles.placeholder]}>
        {renderDateText(fromDate)}
      </Text>
    </TouchableOpacity>

    {showFromPicker && (
      <DateTimePicker
        value={fromDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange(setFromDate, setShowFromPicker)}
      />
    )}
  </View>

  <View style={styles.dateBox}>
    <Text style={styles.label}>To Date</Text>
    <TouchableOpacity
      onPress={() => setShowToPicker(true)}
      style={styles.dateButton}
    >
      <Text style={[styles.dateText, !toDate && styles.placeholder]}>
        {renderDateText(toDate)}
      </Text>
    </TouchableOpacity>

    {showToPicker && (
      <DateTimePicker
        value={toDate || new Date()}
        mode="date"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={handleDateChange(setToDate, setShowToPicker)}
      />
    )}
  </View>

</View>
  <TouchableOpacity style={styles.submitButton} onPress={handlSubmitTL}>
                <Text style={styles.submitText} >Submit</Text>
            </TouchableOpacity>

                    </View>
                );

            case "form3":
                return (
                    <View >
                        
                    </View>
                );

            case "form4":
                return (
                    <View >
                        
                    </View>
                );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.switchButton, currentForm === 'lead' && styles.activeButton]} onPress={() => setCurrentForm('lead')}>
                    <Text style={styles.buttonText}>Lead</Text>
                </TouchableOpacity>
                {user?.role !== "Agent" && (
                <TouchableOpacity style={[styles.switchButton, currentForm === 'TL/Agent' && styles.activeButton]} onPress={() => setCurrentForm('TL/Agent')}>
                    <Text style={styles.buttonText}>TL/Agent</Text>
                </TouchableOpacity>)}
                <TouchableOpacity style={[styles.switchButton, currentForm === 'form3' && styles.activeButton]} onPress={() => setCurrentForm('form3')}>
                    <Text style={styles.buttonText}>CheckIn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.switchButton, currentForm === 'form4' && styles.activeButton]} onPress={() => setCurrentForm('form4')}>
                    <Text style={styles.buttonText}>Report</Text>
                </TouchableOpacity>
            </View>

            {renderForm()}

            {/* <TouchableOpacity style={styles.submitButton} onPress={handlSubmit}>
                <Text style={styles.submitText} >Submit</Text>
            </TouchableOpacity> */}
        </ScrollView>
    );
};

export default FilterForm;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        paddingBottom: 40,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        flexWrap: 'wrap',
    },
    switchButton: {
        backgroundColor: '#003961',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        width: '23%',
        alignItems: 'center',
    },
    activeButton: {
        backgroundColor: 'red',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    form: {
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
        color: '#333',
    }, pickerWrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    overflow: "hidden",
  },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginBottom: 12,
        fontSize: 14,
    },
    submitButton: {
        backgroundColor: '#003961',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop:15
    },
    submitText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    dateButton: {
        padding: 6,
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 5,
    },
    datepick: {
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        marginTop: 12,
    },
    dateText: {
        fontSize: 14,
        color: '#333',
    },
    dropdown: {
        borderColor: '#ccc',
        borderRadius: 6,
        height: 40,
        paddingHorizontal: 8,
    },
    dropdownBox: {
        borderColor: '#ccc',
        borderRadius: 6,
    },
    placeholder: {
        color: '#999',
        fontSize: 13,
    },
   datesec: {
  flexDirection: "row",
  gap: 10,                 // spacing between From & To
  marginTop: 12,
},

dateBox: {
  flex: 1,                 // 👈 dono equal width
},

dateButton: {
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderWidth: 1,
  borderColor: "#999",
  borderRadius: 6,
  width: "100%",           // 👈 full inside its half
},

label: {
  fontSize: 13,
  color: "#333",
  marginBottom: 4,
},

dateText: {
  fontSize: 14,
  color: "#333",
},

placeholder: {
  color: "#999",
},

});
