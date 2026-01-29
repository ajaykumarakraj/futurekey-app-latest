import React, { useState ,useEffect} from "react";
import { StyleSheet, TouchableOpacity, View, Text, Alert, Platform } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../context/AuthContext';
import { SelectList } from "react-native-dropdown-select-list";
import axios from "axios";

const FilterForm = () => {
    const { user, token } = useAuth();
    const [currentForm, setCurrentForm] = useState("form1");   
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);



    const [form1Data, setForm1Data] = useState({
       
        fromDate: new Date(),
        toDate: new Date(),
    });
    const [form2Data, setForm2Data] = useState({ phone: '', altPhone: '' });
    const [form3Data, setForm3Data] = useState({ city: '', pin: '' });
    const [form4Data, setForm4Data] = useState({ feedback: '' });

    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);

    const [showFromDate, setShowFromDate] = useState(false);
    const [showToDate, setShowToDate] = useState(false);

     const [leadsourcelist,setLeadsourceList]=useState([])
     const [leadsource,setLeadsource]=useState([])


 const [projectList,setProjectList]=useState([])
  const [project,setProject]=useState([])

  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

const f=formatDate(fromDate)
const t=formatDate(toDate)
 console.log(f,t)
const renderDateText = (date) => date ? date.toLocaleDateString() : 'Select date';


  const handleDateChange = (setter, setShow) => (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setter(selectedDate);
    }
  };

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



    const handlSubmit = async() => {
  payload={
     type:"lead", 
     tl_agent,
     report,
     user_id: "33",
     tl_id:"33",
     agent_id:"33",
     project:"all",
     lead_source:"facebook",
     from_date:"2026-01-01",
     to_date:"2026-01-30"
    }
    try {
      const res = await axios.get("https://api.almonkdigital.in/api/admin/filter-report",payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
       console.log(res.data)
       
      }
    } catch (error) {
      console.log(error);
    }
    };

    const renderForm = () => {
        switch (currentForm) {
            case "form1":
                return (
                    <View style={styles.form}>
                        <Text style={styles.title}>Form 1 - Basic</Text>

                        {/* Name Dropdown */}
                      <View style={styles.pickerWrapper}><SelectList data={leadsourcelist} setSelected={setLeadsource} placeholder="All Lead Source" search={false} /></View>

                        {/* Email Dropdown */}
                        <View style={styles.pickerWrapper}><SelectList data={projectList} setSelected={setProject} placeholder="All Project" search={false} /></View>

                     
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


                    </View>
                );

            case "form2":
                return (
                    <View style={styles.form}>
                        <Text style={styles.title}>Form 2 - Contact</Text>
                        <View style={{ zIndex: 2000, marginBottom: 20 }}>
                            <DropDownPicker
                                open={dropdownOpen1}
                                value={form1Data.name}
                                items={[
                                    { label: 'Ajay', value: 'Ajay' },
                                    { label: 'Neha', value: 'Neha' },
                                    { label: 'Ravi', value: 'Ravi' }
                                ]}
                                setOpen={setDropdownOpen1}
                                setValue={(callback) => {
                                    const value = callback(form1Data.name);
                                    setForm1Data({ ...form1Data, name: value });
                                }}
                                placeholder="Select Name"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* Email Dropdown */}
                        <View style={{ zIndex: 1000, marginBottom: 12 }}>
                            <DropDownPicker
                                open={dropdownOpen2}
                                value={form1Data.email}
                                items={[
                                    { label: 'ajay@example.com', value: 'ajay@example.com' },
                                    { label: 'neha@example.com', value: 'neha@example.com' },
                                    { label: 'ravi@example.com', value: 'ravi@example.com' }
                                ]}
                                setOpen={setDropdownOpen2}
                                setValue={(callback) => {
                                    const value = callback(form1Data.email);
                                    setForm1Data({ ...form1Data, email: value });
                                }}
                                placeholder="Select Email"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* From & To Dates */}
                        <View style={styles.datepick}>
                            <TouchableOpacity onPress={() => setShowFromDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>From: {form1Data.fromDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showFromDate && (
                                <DateTimePicker
                                    value={form1Data.fromDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowFromDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, fromDate: selectedDate });
                                        }
                                    }}
                                />
                            )}

                            <TouchableOpacity onPress={() => setShowToDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>To: {form1Data.toDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showToDate && (
                                <DateTimePicker
                                    value={form1Data.toDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowToDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, toDate: selectedDate });
                                        }
                                    }}
                                />
                            )}
                        </View>
                    </View>
                );

            case "form3":
                return (
                    <View style={styles.form}>
                        <Text style={styles.title}>Form 3 - Contact</Text>
                        <View style={{ zIndex: 2000, marginBottom: 20 }}>
                            <DropDownPicker
                                open={dropdownOpen1}
                                value={form1Data.name}
                                items={[
                                    { label: 'Ajay', value: 'Ajay' },
                                    { label: 'Neha', value: 'Neha' },
                                    { label: 'Ravi', value: 'Ravi' }
                                ]}
                                setOpen={setDropdownOpen1}
                                setValue={(callback) => {
                                    const value = callback(form1Data.name);
                                    setForm1Data({ ...form1Data, name: value });
                                }}
                                placeholder="Select Name"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* Email Dropdown */}
                        <View style={{ zIndex: 1000, marginBottom: 12 }}>
                            <DropDownPicker
                                open={dropdownOpen2}
                                value={form1Data.email}
                                items={[
                                    { label: 'ajay@example.com', value: 'ajay@example.com' },
                                    { label: 'neha@example.com', value: 'neha@example.com' },
                                    { label: 'ravi@example.com', value: 'ravi@example.com' }
                                ]}
                                setOpen={setDropdownOpen2}
                                setValue={(callback) => {
                                    const value = callback(form1Data.email);
                                    setForm1Data({ ...form1Data, email: value });
                                }}
                                placeholder="Select Email"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* From & To Dates */}
                        <View style={styles.datepick}>
                            <TouchableOpacity onPress={() => setShowFromDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>From: {form1Data.fromDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showFromDate && (
                                <DateTimePicker
                                    value={form1Data.fromDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowFromDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, fromDate: selectedDate });
                                        }
                                    }}
                                />
                            )}

                            <TouchableOpacity onPress={() => setShowToDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>To: {form1Data.toDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showToDate && (
                                <DateTimePicker
                                    value={form1Data.toDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowToDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, toDate: selectedDate });
                                        }
                                    }}
                                />
                            )}
                        </View>
                    </View>
                );

            case "form4":
                return (
                    <View style={styles.form}>
                        <Text style={styles.title}>Form 4 - Contact</Text>
                        <View style={{ zIndex: 2000, marginBottom: 20 }}>
                            <DropDownPicker
                                open={dropdownOpen1}
                                value={form1Data.name}
                                items={[
                                    { label: 'Ajay', value: 'Ajay' },
                                    { label: 'Neha', value: 'Neha' },
                                    { label: 'Ravi', value: 'Ravi' }
                                ]}
                                setOpen={setDropdownOpen1}
                                setValue={(callback) => {
                                    const value = callback(form1Data.name);
                                    setForm1Data({ ...form1Data, name: value });
                                }}
                                placeholder="Select Name"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* Email Dropdown */}
                        <View style={{ zIndex: 1000, marginBottom: 12 }}>
                            <DropDownPicker
                                open={dropdownOpen2}
                                value={form1Data.email}
                                items={[
                                    { label: 'ajay@example.com', value: 'ajay@example.com' },
                                    { label: 'neha@example.com', value: 'neha@example.com' },
                                    { label: 'ravi@example.com', value: 'ravi@example.com' }
                                ]}
                                setOpen={setDropdownOpen2}
                                setValue={(callback) => {
                                    const value = callback(form1Data.email);
                                    setForm1Data({ ...form1Data, email: value });
                                }}
                                placeholder="Select Email"
                                placeholderStyle={styles.placeholder}
                                style={styles.dropdown}
                                dropDownContainerStyle={styles.dropdownBox}
                            />
                        </View>

                        {/* From & To Dates */}
                        <View style={styles.datepick}>
                            <TouchableOpacity onPress={() => setShowFromDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>From: {form1Data.fromDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showFromDate && (
                                <DateTimePicker
                                    value={form1Data.fromDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowFromDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, fromDate: selectedDate });
                                        }
                                    }}
                                />
                            )}

                            <TouchableOpacity onPress={() => setShowToDate(true)} style={styles.dateButton}>
                                <Text style={styles.dateText}>To: {form1Data.toDate.toDateString()}</Text>
                            </TouchableOpacity>
                            {showToDate && (
                                <DateTimePicker
                                    value={form1Data.toDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowToDate(Platform.OS === 'ios');
                                        if (selectedDate) {
                                            setForm1Data({ ...form1Data, toDate: selectedDate });
                                        }
                                    }}
                                />
                            )}
                        </View>
                    </View>
                );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.switchButton, currentForm === 'form1' && styles.activeButton]} onPress={() => setCurrentForm('form1')}>
                    <Text style={styles.buttonText}>Lead</Text>
                </TouchableOpacity>
                {user?.role !== "Agent" && (
                <TouchableOpacity style={[styles.switchButton, currentForm === 'form2' && styles.activeButton]} onPress={() => setCurrentForm('form2')}>
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

            <TouchableOpacity style={styles.submitButton} onPress={handlSubmit}>
                <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
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
