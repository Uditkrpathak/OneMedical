import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function MedicalInformationScreen({ navigation }) {
  const [allergies, setAllergies] = useState([]);
  const [medications, setMedications] = useState([
    { id: '1', name: 'Etoricoxib', dosage: '90mg, 1x Daily' },
    { id: '2', name: 'Pantoprazole', dosage: '40mg, Before Breakfast' },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Information</Text>
        <TouchableOpacity style={styles.headerShareBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* VITALS OVERVIEW CARD */}
        <Text style={styles.sectionTitle}>VITALS OVERVIEW</Text>
        <View style={styles.vitalsCard}>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Blood Sugar</Text>
              <Text style={styles.vitalVal}>0<Text style={styles.vitalUnit}>-</Text></Text>
            </View>

            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Height</Text>
              <Text style={styles.vitalVal}>168 <Text style={styles.vitalUnit}>cm</Text></Text>
            </View>

            <View style={styles.vitalBox}>
              <Text style={styles.vitalLabel}>Weight</Text>
              <Text style={styles.vitalVal}>62 <Text style={styles.vitalUnit}>kg</Text></Text>
            </View>
          </View>

          <TouchableOpacity style={styles.viewEmergencyBtn}>
            <Ionicons name="eye-outline" size={14} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={styles.viewEmergencyBtnText}>View Emergency Contacts</Text>
          </TouchableOpacity>
        </View>

        {/* ALLERGIES SECTION */}
        <Text style={styles.sectionTitle}>ALLERGIES</Text>
        <View style={styles.card}>
          {allergies.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No known allergies</Text>
              <TouchableOpacity
                style={styles.addInlineBtn}
                onPress={() => Alert.prompt('Add Allergy', 'Enter allergy name:', (text) => text && setAllergies([text]))}
              >
                <Text style={styles.addInlineText}>+ Add Allergy</Text>
              </TouchableOpacity>
            </View>
          ) : (
            allergies.map((item, idx) => (
              <View key={idx} style={styles.badgeItem}>
                <Text style={styles.badgeItemText}>{item}</Text>
              </View>
            ))
          )}
        </View>

        {/* MEDICAL CONDITIONS */}
        <Text style={styles.sectionTitle}>MEDICAL CONDITIONS</Text>
        <View style={styles.conditionsRow}>
          <View style={styles.conditionPill}>
            <Text style={styles.conditionPillText}>Hypertension</Text>
          </View>
          <View style={styles.conditionPill}>
            <Text style={styles.conditionPillText}>Arthritis Mild</Text>
          </View>
        </View>

        {/* CURRENT MEDICATIONS */}
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>CURRENT MEDICATIONS</Text>
        {medications.map((med) => (
          <View key={med.id} style={styles.medCard}>
            <View style={styles.medIconBox}>
              <Ionicons name="bandage-outline" size={18} color="#003D9B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDosage}>{med.dosage}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addMedicationBtn}>
          <Text style={styles.addMedicationBtnText}>+ Add Medication</Text>
        </TouchableOpacity>

        {/* INJURY HISTORY TIMELINE */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>INJURY HISTORY</Text>
        <View style={styles.card}>
          <View style={styles.timelineItem}>
            <View style={styles.dotLineCol}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
            </View>
            <View style={{ flex: 1, paddingBottom: 16 }}>
              <Text style={styles.injuryTitle}>ACL Reconstruction</Text>
              <Text style={styles.injurySub}>2019 • Fully Recovered</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.dotLineCol}>
              <View style={[styles.timelineDot, { backgroundColor: '#d97706' }]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.injuryTitle}>Ankle Sprain</Text>
              <Text style={styles.injurySub}>2022 • Occasional Stiffness</Text>
            </View>
          </View>
        </View>

        {/* EMERGENCY CONTACT BANNER */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>EMERGENCY CONTACT</Text>
        <View style={styles.emergencyCard}>
          <View style={styles.emergencyAvatarCircle}>
            <Text style={styles.emergencyInitials}>AM</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyName}>Arjun Malhotra</Text>
            <Text style={styles.emergencyPhone}>+91 98765 43210</Text>
          </View>

          <TouchableOpacity style={styles.callCircleBtn} onPress={() => Alert.alert('Calling Emergency Contact', 'Dialing +91 98765 43210...')}>
            <Ionicons name="call" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBackBtn: {
    paddingRight: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerShareBtn: {
    paddingLeft: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  vitalsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  vitalBox: {
    alignItems: 'center',
    flex: 1,
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 4,
  },
  vitalVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  vitalUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  viewEmergencyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e6f0ff',
    borderRadius: 10,
    paddingVertical: 8,
  },
  viewEmergencyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 6,
  },
  addInlineBtn: {},
  addInlineText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  conditionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  conditionPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  conditionPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  medIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  medDosage: {
    fontSize: 11,
    color: '#64748b',
  },
  addMedicationBtn: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 16,
  },
  addMedicationBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  timelineItem: {
    flexDirection: 'row',
  },
  dotLineCol: {
    alignItems: 'center',
    marginRight: 12,
    width: 14,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#003D9B',
    marginTop: 3,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 4,
  },
  injuryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  injurySub: {
    fontSize: 11,
    color: '#64748b',
  },
  emergencyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emergencyAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emergencyInitials: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003D9B',
  },
  emergencyName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  emergencyPhone: {
    fontSize: 12,
    color: '#64748b',
  },
  callCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
