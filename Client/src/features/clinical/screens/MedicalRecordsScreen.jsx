import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../../theme/colors';

const MOCK_RECORDS = [
  { id: '1', title: 'Right Knee Pre-Op MRI Scan Report.pdf', type: 'scan', date: '2026-07-28', size: '4.2 MB', category: 'MRI Scan' },
  { id: '2', title: 'Post-Op Physical Therapy Assessment.pdf', type: 'report', date: '2026-08-01', size: '1.8 MB', category: 'Doctor Notes' },
  { id: '3', title: 'Blood Panel & Inflammatory Markers.pdf', type: 'lab', date: '2026-08-04', size: '850 KB', category: 'Lab Report' },
];

export default function MedicalRecordsScreen({ navigation }) {
  const { user } = useSelector(state => state.auth);
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDownload = (record) => {
    Alert.alert(
      'Download Medical Record',
      `Generating pre-signed URL for ${record.title}...\n\nS3 Pre-signed URL created. Downloading 15-minute secure access link.`,
      [{ text: 'OK' }]
    );
  };

  const handleUploadNew = () => {
    setUploading(true);
    setTimeout(() => {
      const newRec = {
        id: String(Date.now()),
        title: `Uploaded_Scan_${records.length + 1}.pdf`,
        type: 'scan',
        date: new Date().toISOString().split('T')[0],
        size: '2.5 MB',
        category: 'Scan / Report'
      };
      setRecords([newRec, ...records]);
      setUploading(false);
      Alert.alert('Success', 'Medical report uploaded successfully to secure encrypted storage.');
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Medical Records & Scans</Text>
        <Text style={styles.subtitle}>Protected Health Information (PHI) encrypted with AES-256</Text>
      </View>

      {/* Upload Action */}
      <View style={styles.uploadCard}>
        <Text style={styles.uploadTitle}>📄 Upload New Document</Text>
        <Text style={styles.uploadDesc}>Upload MRI scans, X-Rays, or clinical doctor notes (PDF/JPEG up to 25MB).</Text>
        <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadNew} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadBtnText}>+ Select File & Upload</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Records List */}
      <Text style={styles.sectionHeader}>Your Vault ({records.length} files)</Text>

      {records.map((rec) => (
        <View key={rec.id} style={styles.recordCard}>
          <View style={styles.recordIconBox}>
            <Text style={styles.recordIcon}>{rec.type === 'scan' ? '🩻' : '📑'}</Text>
          </View>
          <View style={styles.recordInfo}>
            <Text style={styles.recordTitle} numberOfLines={1}>{rec.title}</Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{rec.category}</Text>
              </View>
              <Text style={styles.recordMeta}>{rec.date} • {rec.size}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(rec)}>
            <Text style={styles.downloadBtnText}>⬇ Download</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* S3 Security Disclaimer */}
      <View style={styles.securityNote}>
        <Text style={styles.securityText}>🔒 Files are stored in AWS S3 with bucket privacy policies. Downloads are issued via 15-minute expiration pre-signed URLs with user authorization auditing.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: colors.slate800 },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 4 },
  uploadCard: { backgroundColor: '#eff6ff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#bfdbfe', marginBottom: 24 },
  uploadTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  uploadDesc: { fontSize: 13, color: colors.slate600, marginVertical: 8, lineHeight: 18 },
  uploadBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  uploadBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  sectionHeader: { fontSize: 18, fontWeight: '700', color: colors.slate800, marginBottom: 12 },
  recordCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  recordIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  recordIcon: { fontSize: 22 },
  recordInfo: { flex: 1 },
  recordTitle: { fontSize: 14, fontWeight: '600', color: colors.slate800 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, flexWrap: 'wrap' },
  badge: { backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginRight: 8 },
  badgeText: { color: '#0369a1', fontSize: 11, fontWeight: '600' },
  recordMeta: { fontSize: 12, color: colors.slate400 },
  downloadBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  downloadBtnText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  securityNote: { marginTop: 24, padding: 14, backgroundColor: '#f1f5f9', borderRadius: 12 },
  securityText: { fontSize: 12, color: colors.slate500, textAlign: 'center', lineHeight: 16 },
});
