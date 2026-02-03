import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Modal, StyleSheet, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import ApiClient from './ApiClient';

const ForceUpdate = () => {
  const [visible, setVisible] = useState(false);
  const [force, setForce] = useState(false);
  const [updateUrl, setUpdateUrl] = useState('');

  useEffect(() => {
    checkVersion();
  }, []);

  const checkVersion = async () => {
    try {
      // ✅ Current installed version
      const currentVersion = VersionCheck.getCurrentVersion();

      // ✅ Backend version
      const res = await ApiClient.get('/app-version');

      if (res.data.status !== 200) return;

      const serverData = res.data.data.android;
      const latestVersion = serverData.latest_version;

      const result = VersionCheck.needUpdate({
        currentVersion,
        latestVersion,
      });

      if (result?.isNeeded) {
        setForce(serverData.force_update);
        setUpdateUrl(serverData.update_url);
        setVisible(true);
      }
    } catch (e) {
      console.log('Force update error:', e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Update Available</Text>

          <Text style={styles.text}>
            A new version of the app is available. Please update to continue.
          </Text>

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Linking.openURL(updateUrl)}
          >
            <Text style={styles.updateText}>Update Now</Text>
          </TouchableOpacity>

          {!force && (
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.skip}>Later</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ForceUpdate;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 15, textAlign: 'center', marginBottom: 20 },
  updateBtn: {
    backgroundColor: '#007bff',
    width: '100%',
    padding: 12,
    borderRadius: 8,
  },
  updateText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  skip: { marginTop: 15, color: '#007bff', fontWeight: 'bold' },
});
