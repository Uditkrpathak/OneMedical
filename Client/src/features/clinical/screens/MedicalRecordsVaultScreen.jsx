import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function MedicalRecordsVaultScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const previousReports = [
    {
      id: '1',
      title: 'MRI Lumbar Spine',
      dept: 'Radiology Dept',
      doctorName: 'Dr. Ananya Iyer (Radiology)',
      recordType: 'Radiology MRI Scan Details',
      date: '18 Oct 2023',
      icon: 'sparkles-outline',
      color: '#0284c7',
      fileType: 'DICOM / PDF',
      notes: 'Scan indicates mild L4-L5 disc protrusion without spinal stenosis. Core stabilization and progressive lumbar extension recommended.',
    },
    {
      id: '2',
      title: 'Progress Summary Q3',
      dept: 'Dr. Rahul Sharma',
      doctorName: 'Dr. Rahul Sharma',
      recordType: 'Quarterly Recovery Evaluation',
      date: '15 Oct 2023',
      icon: 'stats-chart-outline',
      color: '#9333ea',
      fileType: 'PDF Report',
      notes: 'Patient completed 18 of 20 assigned sessions in Q3. Lumbar flexibility improved by +35%. Subjective pain reduced from 8/10 to 3/10 during daily mobility tests.',
    },
    {
      id: '3',
      title: 'Prescription Refill',
      dept: 'Pharmacy Dept',
      doctorName: 'Dr. Sarah Johnson (Pharmacy)',
      recordType: 'Pharmacology Prescription',
      date: '12 Oct 2023',
      icon: 'receipt-outline',
      color: '#dc2626',
      fileType: 'Rx Slip',
      notes: 'Refilled Naproxen 500mg (10-day course) & Muscle Relaxant (Thiocolchicoside 4mg). Take after meals. Avoid heavy weight lifting.',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Reports</Text>
        <TouchableOpacity
          style={styles.addBtnHeader}
          onPress={() => navigation.navigate('AddMedicalRecord')}
        >
          <Ionicons name="add" size={16} color="#003D9B" style={{ marginRight: 2 }} />
          <Text style={styles.addBtnHeaderText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* SEARCH INPUT */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* FILTER SEGMENT TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow}>
          {['All', 'Assessment', 'Progress', 'X-Ray / MRI'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabPillText, activeTab === tab && styles.tabPillTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* LATEST REPORT HERO CARD */}
        <Text style={styles.sectionTitle}>LATEST REPORT</Text>
        <View style={styles.latestCard}>
          <View style={styles.latestHeaderRow}>
            <View style={styles.docIconBox}>
              <Ionicons name="document-text-outline" size={24} color="#003D9B" />
            </View>
            <View style={styles.latestBadge}>
              <Text style={styles.latestBadgeText}>LATEST</Text>
            </View>
          </View>

          <Text style={styles.latestTitle}>Initial Assessment - Sanya Malhotra</Text>
          <Text style={styles.latestSub}>Dr. Ananya Iyer</Text>
          <Text style={styles.latestDateSize}>24 Oct 2023 • 2.4 MB</Text>

          <TouchableOpacity
            style={styles.viewReportBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MedicalRecordViewer', { record: { title: 'Initial Assessment - Sanya Malhotra', recordType: 'Physical Therapy Assessment Report', doctorName: 'Dr. Ananya Iyer', date: '24 Oct 2023', fileType: 'PDF Document', fileSize: '2.4 MB', notes: 'Initial evaluation indicates mild L4-L5 lumbar strain with hamstring tightness. Prescribed 4-week active physical therapy routine focusing on lumbar extension and core stability.' } })}
          >
            <Ionicons name="eye-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.viewReportBtnText}>View Report</Text>
          </TouchableOpacity>
        </View>

        {/* PREVIOUS REPORTS LIST */}
        <Text style={styles.sectionTitle}>PREVIOUS REPORTS</Text>
        {previousReports
          .filter((report) => {
            const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  report.dept.toLowerCase().includes(searchQuery.toLowerCase());
            if (!matchesSearch) return false;
            if (activeTab === 'X-Ray / MRI') return report.title.includes('MRI') || report.title.includes('X-Ray');
            if (activeTab === 'Progress') return report.title.includes('Progress');
            return true;
          })
          .map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportRowCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MedicalRecordViewer', { record: report })}
            >
              <View style={[styles.reportIconCircle, { backgroundColor: report.id === '1' ? '#e6f0ff' : `${report.color}15` }]}>
                <Ionicons name={report.icon} size={20} color={report.id === '1' ? '#003D9B' : report.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.reportRowTitle}>{report.title}</Text>
                <Text style={styles.reportRowSub}>{report.dept} • {report.date}</Text>
              </View>

              <TouchableOpacity
                style={styles.moreOptionsBtn}
                onPress={() => Alert.alert(report.title, `Uploaded on ${report.date} by ${report.dept}. Encrypted 256-bit AES.`)}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

        {/* ENCRYPTED SECURITY CALLOUT */}
        <View style={styles.securityBox}>
          <Ionicons name="shield-checkmark-outline" size={26} color="#003D9B" style={{ marginBottom: 8 }} />
          <Text style={styles.securityText}>
            All your medical history and clinical data is encrypted and secure.
          </Text>
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
  addBtnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addBtnHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
  },
  tabsRow: {
    marginBottom: 16,
  },
  tabPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  tabPillActive: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  tabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  latestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  latestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  docIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  latestBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  latestBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
  },
  latestTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 2,
  },
  latestSub: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  latestDateSize: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 14,
  },
  viewReportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#003D9B',
    borderRadius: 24,
    height: 48,
  },
  viewReportBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  reportRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  reportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportRowTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  reportRowSub: {
    fontSize: 11,
    color: '#64748b',
  },
  moreOptionsBtn: {
    padding: 6,
  },
  securityBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  securityText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
});
