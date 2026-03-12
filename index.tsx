import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ScrollView, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, Linking 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [intake, setIntake] = useState('');
  const [maintenance, setMaintenance] = useState('2500');
  const [result, setResult] = useState('0.00');
  const [history, setHistory] = useState([]);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      loadData();
      setLoading(false);
    }, 2500);
  }, []);

  const loadData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('@g350_history');
      if (savedHistory !== null) { setHistory(JSON.parse(savedHistory)); }
    } catch (e) { console.log("Storage Error"); }
  };

  const openSupport = () => {
    Linking.openURL('mailto:support@galleongain.com?subject=G-350%20ELITE%20SUPPORT');
  };

  const runG350 = () => {
    const mtn = parseFloat(maintenance);
    const cal = parseFloat(intake);
    if (isNaN(cal)) { 
      Alert.alert("REQUIRED", "Enter calories."); 
      return; 
    }
    const calculation = (cal - mtn) / 3500;
    const finalVal = calculation.toFixed(2);
    setResult(finalVal);
    
    const newEntry = { 
      id: Date.now().toString(), 
      gain: finalVal, 
      date: new Date().toLocaleDateString() 
    };
    const updatedHistory = [newEntry, ...history].slice(0, 10);
    setHistory(updatedHistory);
    AsyncStorage.setItem('@g350_history', JSON.stringify(updatedHistory));
    setIntake('');
  };

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>G</Text>
        </View>
        <Text style={styles.splashTitle}>GALLEON GAIN</Text>
        <ActivityIndicator size="small" color="#FF8C00" style={{marginTop: 20}} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{flex: 1, backgroundColor: '#000'}}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.platformBadge}>
          <Text style={styles.platformText}>SYSTEM: {Platform.OS.toUpperCase()} ENCRYPTED</Text>
        </View>

        <Text style={styles.title}>G-350 ENGINE</Text>
        
        <TextInput
          style={styles.input}
          placeholder="INTAKE"
          placeholderTextColor="#222"
          keyboardType="numeric"
          value={intake}
          onChangeText={setIntake}
        />

        <TouchableOpacity style={styles.button} onPress={runG350}>
          <Text style={styles.buttonText}>RUN ANALYSIS</Text>
        </TouchableOpacity>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>PROJECTED GAIN</Text>
          <Text style={styles.resultText}>{result} lbs</Text>
        </View>

        {/* LOGS Section */}
        <View style={styles.historyContainer}>
           <Text style={styles.historyTitle}>DATA LOG</Text>
           {history.map((item) => (
             <View key={item.id} style={styles.historyItem}>
               <Text style={styles.historyDate}>{item.date}</Text>
               <Text style={styles.historyGain}>+{item.gain} lbs</Text>
             </View>
           ))}
        </View>

        {!isPaid && (
          <TouchableOpacity style={styles.paywallBtn} onPress={() => setIsPaid(true)}>
            <Text style={styles.paywallText}>ACTIVATE ELITE — $39.99/mo</Text>
          </TouchableOpacity>
        )}

        {/* SUPPORT FOOTER */}
        <TouchableOpacity style={styles.supportLink} onPress={openSupport}>
          <Text style={styles.supportText}>CONTACT ELITE SUPPORT</Text>
        </TouchableOpacity>

        <Text style={styles.footerVersion}>V 1.0.4 - GALLEON GAIN CORE</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  splashContainer: { flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#FF8C00', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  logoLetter: { color: '#FF8C00', fontSize: 50, fontWeight: 'bold' },
  splashTitle: { color: '#fff', fontSize: 20, fontWeight: '900', letterSpacing: 6 },
  
  container: { alignItems: 'center', paddingVertical: 70 },
  platformBadge: { backgroundColor: '#111', padding: 5, borderRadius: 4, marginBottom: 20 },
  platformText: { color: '#444', fontSize: 8, fontWeight: 'bold' },
  title: { color: '#FF8C00', fontSize: 28, fontWeight: '900', letterSpacing: 4, marginBottom: 30 },
  input: { width: '85%', height: 75, backgroundColor: '#050505', borderBottomWidth: 2, borderBottomColor: '#FF8C00', color: '#fff', textAlign: 'center', fontSize: 32, marginBottom: 20 },
  button: { backgroundColor: '#FF8C00', width: '85%', paddingVertical: 20, alignItems: 'center', borderRadius: 4 },
  buttonText: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  resultBox: { marginTop: 40, alignItems: 'center', width: '100%', padding: 20, backgroundColor: '#080808' },
  resultLabel: { color: '#FF8C00', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  resultText: { color: '#fff', fontSize: 50, fontWeight: '900' },
  historyContainer: { width: '85%', marginTop: 30 },
  historyTitle: { color: '#222', fontSize: 12, fontWeight: 'bold', marginBottom: 10 },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#111' },
  historyDate: { color: '#555', fontSize: 12 },
  historyGain: { color: '#fff', fontWeight: 'bold' },
  paywallBtn: { marginTop: 30, borderWidth: 1, borderColor: '#FF8C00', padding: 15, width: '85%', alignItems: 'center' },
  paywallText: { color: '#FF8C00', fontWeight: 'bold' },
  
  supportLink: { marginTop: 50, padding: 10 },
  supportText: { color: '#444', fontSize: 10, fontWeight: 'bold', textDecorationLine: 'underline' },
  footerVersion: { color: '#222', fontSize: 8, marginTop: 10 }
});