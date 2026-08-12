import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../theme/colors';

export default function TherapistScheduleScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState('24');
  const [filter, setFilter] = useState('All');

  const datePills = [
    { day: 'MON', date: '23' },
    { day: 'TUE', date: '24' },
    { day: 'WED', date: '25' },
    { day: 'THU', date: '26' },
    { day: 'FRI', date: '27' },
    { day: 'SAT', date: '28' },
  ];

  const appointments = [
    {
      id: 'apt-1',
      time: '09:00 AM',
      patientName: 'Aniket Kumar, 45y',
      visitType: 'Clinic Visit • Lower Back Pain',
      status: 'Completed',
      actionLabel: 'View Summary',
    },
    {
      id: 'apt-2',
      time: '10:30 AM',
      patientName: 'Priya Singh, 32y',
      visitType: 'Online Consultation • ACL Recovery',
      status: 'In Progress',
      actionLabel: 'Join Session',
    },
    {
      id: 'apt-3',
      time: '11:30 AM',
      patientName: 'Rahul Sharma, 28y',
      visitType: 'Clinic Visit • Rotator Cuff Rehab',
      status: 'Confirmed',
      actionLabel: 'Pre-Chart',
    },
    {
      id: 'apt-4',
      time: '01:45 PM',
      patientName: 'Sanya Malhotra, 29y',
      visitType: 'Clinic Visit • ACL Recovery',
      status: 'Confirmed',
      actionLabel: 'Pre-Chart',
    },
  ];

  const filtered = appointments.filter((a) => {
    if (filter === 'All') return true;
    return a.status === filter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Schedule</Text>
        <Text style={styles.headerSub}>Tuesday, Oct 24, 2024</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* DATE STRIP */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateStrip}>
          {datePills.map((item) => (
            <TouchableOpacity
              key={item.date}
              style={[styles.datePill, selectedDate === item.date && styles.datePillActive]}
              onPress={() => setSelectedDate(item.date)}
            >
              <Text style={[styles.dateDayText, selectedDate === item.date && styles.dateTextActive]}>{item.day}</Text>
              <Text style={[styles.dateNumText, selectedDate === item.date && styles.dateTextActive]}>{item.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* FILTER CHIPS */}
        <View style={styles.filterRow}>
          {['All', 'Confirmed', 'In Progress', 'Completed'].map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* APPOINTMENT TIMELINE LIST */}
        {filtered.map((apt) => (
          <View key={apt.id} style={styles.aptCard}>
            <View style={styles.timeCol}>
              <Text style={styles.timeText}>{apt.time}</Text>
              <View style={[styles.statusTag, apt.status === 'In Progress' && { backgroundColor: '#dbeafe' }]}>
                <Text style={[styles.statusTagText, apt.status === 'In Progress' && { color: '#2563eb' }]}>{apt.status}</Text>
              </View>
            </View>

            <View style={styles.aptDetails}>
              <Text style={styles.patientNameText}>{apt.patientName}</Text>
              <Text style={styles.visitTypeText}>{apt.visitType}</Text>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: apt.id, patientName: apt.patientName })}
                >
                  <Text style={styles.detailsBtnText}>Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => navigation.navigate('ClinicalConsultation', { appointmentId: apt.id, patientName: apt.patientName })}
                >
                  <Text style={styles.actionBtnText}>{apt.actionLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  scrollContent: { padding: 20 },
  dateStrip: { marginBottom: 16 },
  datePill: { width: 50, height: 60, borderRadius: 14, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  datePillActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  dateDayText: { fontSize: 10, fontWeight: '800', color: '#64748b' },
  dateNumText: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  dateTextActive: { color: '#ffffff' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1' },
  filterChipActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  filterChipText: { fontSize: 11, fontWeight: '700', color: '#64748b' },
  filterChipTextActive: { color: '#ffffff' },
  aptCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  timeCol: { width: 80, marginRight: 12 },
  timeText: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  statusTag: { backgroundColor: '#f1f5f9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 4, alignSelf: 'flex-start' },
  statusTagText: { fontSize: 9, fontWeight: '800', color: '#64748b' },
  aptDetails: { flex: 1 },
  patientNameText: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  visitTypeText: { fontSize: 12, color: '#64748b', marginTop: 2, marginBottom: 10 },
  actionsRow: { flexDirection: 'row', gap: 8 },
  detailsBtn: { flex: 1, height: 34, borderRadius: 8, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  detailsBtnText: { fontSize: 12, fontWeight: '700', color: '#0f172a' },
  actionBtn: { flex: 1, height: 34, borderRadius: 8, backgroundColor: '#0284c7', alignItems: 'center', justifyContent: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
});
