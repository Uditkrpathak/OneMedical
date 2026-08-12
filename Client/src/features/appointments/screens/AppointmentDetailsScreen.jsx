import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../../theme/colors';

export default function AppointmentDetailsScreen({ route, navigation }) {
  const patientName = route.params?.patientName || 'Sanya Malhotra, 29y';

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* RECENT UPLOAD BANNER */}
        <TouchableOpacity
          style={styles.uploadBanner}
          onPress={() => navigation.navigate('MedicalRecordViewer', { title: 'Recent MRI Scan' })}
        >
          <Ionicons name="document-attach" size={18} color="#0284c7" style={{ marginRight: 8 }} />
          <Text style={styles.uploadBannerText}>Recent MRI results uploaded (Today)</Text>
          <Ionicons name="chevron-forward" size={16} color="#0284c7" />
        </TouchableOpacity>

        {/* PATIENT HERO CARD */}
        <View style={styles.patientCard}>
          <View style={styles.patientTopRow}>
            <Image
              source={require('../../../../assets/images/therapist_female_1.png')}
              style={styles.patientPhoto}
            />
            <View style={styles.patientInfo}>
              <Text style={styles.patientName}>{patientName}</Text>
              <Text style={styles.patientMeta}>Female • ID: #OM-60210</Text>
              <View style={styles.badgesRow}>
                <View style={styles.badge}><Text style={styles.badgeText}>ACL Recovery</Text></View>
                <View style={[styles.badge, { backgroundColor: '#f3e8ff' }]}><Text style={[styles.badgeText, { color: '#9333ea' }]}>Post-Op</Text></View>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.snapshotRow}>
            <View style={styles.snapshotCol}>
              <Text style={styles.snapshotLabel}>PAIN SCORE</Text>
              <Text style={styles.snapshotValue}>3<Text style={{ fontSize: 13, color: '#64748b' }}>/10</Text></Text>
            </View>
            <View style={styles.snapshotDivider} />
            <View style={styles.snapshotCol}>
              <Text style={styles.snapshotLabel}>PROGRESS</Text>
              <Text style={styles.snapshotValue}>75%</Text>
            </View>
          </View>
        </View>

        {/* APPOINTMENT SCHEDULE CARD */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>APPOINTMENT SCHEDULE</Text>
          <Text style={styles.scheduleDate}>Wednesday, Oct 25, 2024</Text>
          <Text style={styles.scheduleTime}>01:45 PM <Text style={styles.durationText}>(45 mins)</Text></Text>

          <View style={styles.visitModeRow}>
            <Ionicons name="business-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={styles.visitModeText}>Clinic Visit • One Medical Hub, MG Road</Text>
          </View>
        </View>

        {/* CLINICAL SNAPSHOT */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>CLINICAL SNAPSHOT</Text>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Primary Complaint</Text><Text style={styles.infoValue}>Patellar instability</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Last Visit</Text><Text style={styles.infoValue}>Oct 18, 2024</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Current Program</Text><Text style={styles.infoValue}>Phase 3: Post-Op ACL Recovery</Text></View>
          <View style={styles.infoRow}><Text style={styles.infoLabel}>Recovery Goal</Text><Text style={styles.infoValue}>78%</Text></View>
        </View>

        {/* QUICK ACCESS GRID */}
        <Text style={styles.gridTitle}>QUICK ACCESS</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickBox} onPress={() => Alert.alert('Medical History', 'Opening past medical history records...')}>
            <Ionicons name="time-outline" size={22} color="#0284c7" />
            <Text style={styles.quickBoxTitle}>Medical History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox} onPress={() => navigation.navigate('MedicalRecordViewer', { title: 'Previous Reports' })}>
            <Ionicons name="folder-open-outline" size={22} color="#0284c7" />
            <Text style={styles.quickBoxTitle}>Previous Reports</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox} onPress={() => Alert.alert('Recovery Progress', 'Opening ROM trend charts...')}>
            <Ionicons name="trending-up-outline" size={22} color="#0284c7" />
            <Text style={styles.quickBoxTitle}>Recovery Progress</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickBox} onPress={() => Alert.alert('Treatment Plan', 'Opening prescribed exercise routine...')}>
            <Ionicons name="git-network-outline" size={22} color="#0284c7" />
            <Text style={styles.quickBoxTitle}>Treatment Plan</Text>
          </TouchableOpacity>
        </View>

        {/* PRIMARY CONSULTATION CTA */}
        <TouchableOpacity
          style={styles.startConsultationBtn}
          onPress={() => navigation.navigate('ClinicalConsultation', { patientName })}
        >
          <Ionicons name="play-circle" size={20} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.startConsultationBtnText}>Start Consultation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { padding: 6, marginRight: 10 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  scrollContent: { padding: 20 },
  uploadBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', borderRadius: 12, padding: 12, marginBottom: 16 },
  uploadBannerText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#0369a1' },
  patientCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  patientTopRow: { flexDirection: 'row', marginBottom: 12 },
  patientPhoto: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  patientMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 6, marginTop: 6 },
  badge: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#0284c7' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  snapshotRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  snapshotCol: { alignItems: 'center' },
  snapshotLabel: { fontSize: 10, fontWeight: '800', color: '#64748b' },
  snapshotValue: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  snapshotDivider: { width: 1, height: 30, backgroundColor: '#e2e8f0' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  cardHeader: { fontSize: 11, fontWeight: '800', color: '#0284c7', letterSpacing: 1, marginBottom: 10 },
  scheduleDate: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  scheduleTime: { fontSize: 20, fontWeight: '800', color: '#0284c7', marginTop: 2 },
  durationText: { fontSize: 13, color: '#64748b' },
  visitModeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  visitModeText: { fontSize: 12, color: '#64748b' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoLabel: { fontSize: 13, color: '#64748b' },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  gridTitle: { fontSize: 11, fontWeight: '800', color: '#0284c7', letterSpacing: 1, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
  quickBox: { width: '48%', backgroundColor: '#ffffff', borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  quickBoxTitle: { fontSize: 12, fontWeight: '700', color: '#0f172a', marginTop: 6 },
  startConsultationBtn: { backgroundColor: '#0284c7', height: 48, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  startConsultationBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});
