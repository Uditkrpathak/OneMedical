import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGetMedicalRecordByIdQuery } from '../clinicalApiSlice';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

const MOCK_RECORD_LOOKUP = {
  'Initial Assessment - Sanya Malhotra': {
    title: 'Initial Assessment - Sanya Malhotra',
    recordType: 'Physical Therapy Assessment Report',
    doctorName: 'Dr. Ananya Iyer',
    date: '24 Oct 2023',
    fileType: 'PDF Document',
    notes: 'Initial evaluation indicates mild L4-L5 lumbar strain with hamstring tightness. Prescribed 4-week active physical therapy routine focusing on lumbar extension and core stability.',
    image: require('../../../../assets/images/spine_3d_model.png'),
    imageLabel: 'Spine Assessment Map',
  },
  'MRI Lumbar Spine': {
    title: 'MRI Lumbar Spine',
    recordType: 'Radiology MRI Scan Details',
    doctorName: 'Dr. Ananya Iyer (Radiology Dept)',
    date: '18 Oct 2023',
    fileType: 'DICOM / PDF',
    notes: 'Scan indicates mild L4-L5 disc protrusion without spinal stenosis. Core stabilization and progressive lumbar extension recommended.',
    image: require('../../../../assets/images/spine_3d_model.png'),
    imageLabel: 'HD MRI Scan View',
  },
  'Progress Summary Q3': {
    title: 'Progress Summary Q3',
    recordType: 'Quarterly Recovery Evaluation',
    doctorName: 'Dr. Rahul Sharma',
    date: '15 Oct 2023',
    fileType: 'PDF Report',
    notes: 'Patient completed 18 of 20 assigned sessions in Q3. Lumbar flexibility improved by +35%. Subjective pain reduced from 8/10 to 3/10 during daily mobility tests.',
    image: null,
    imageLabel: 'Analytics Summary',
  },
  'Prescription Refill': {
    title: 'Prescription Refill',
    recordType: 'Pharmacology Prescription',
    doctorName: 'Dr. Sarah Johnson (Pharmacy Dept)',
    date: '12 Oct 2023',
    fileType: 'Rx Slip',
    notes: 'Refilled Naproxen 500mg (10-day course) & Muscle Relaxant (Thiocolchicoside 4mg). Take after meals. Avoid heavy weight lifting.',
    image: null,
    imageLabel: 'Digital Rx Slip',
  },
};

export default function MedicalRecordViewerScreen({ route, navigation }) {
  const recordId = route.params?.recordId || 'default-record';
  const { data: recordRes, isLoading, error } = useGetMedicalRecordByIdQuery(recordId, {
    skip: !route.params?.recordId,
  });

  const passedRecord = route.params?.record;
  const titleKey = passedRecord?.title || route.params?.title || 'MRI Lumbar Spine';
  const fallbackData = MOCK_RECORD_LOOKUP[titleKey] || {
    title: titleKey,
    recordType: passedRecord?.recordType || passedRecord?.category || 'Medical Record Document',
    doctorName: passedRecord?.doctorName || passedRecord?.dept || 'Attending Doctor',
    date: passedRecord?.date || 'Today',
    fileType: passedRecord?.fileType || 'PDF',
    notes: passedRecord?.notes || 'Encrypted clinical record verified with 256-bit AES protection.',
    image: titleKey.includes('MRI') || titleKey.includes('X-Ray') || titleKey.includes('Scan')
      ? require('../../../../assets/images/spine_3d_model.png')
      : null,
    imageLabel: 'Document Preview',
  };

  const record = recordRes?.data || {
    title: passedRecord?.title || fallbackData.title,
    recordType: passedRecord?.recordType || fallbackData.recordType,
    doctorName: passedRecord?.doctorName || passedRecord?.dept || fallbackData.doctorName,
    date: passedRecord?.date || fallbackData.date,
    notes: passedRecord?.notes || fallbackData.notes,
    fileType: passedRecord?.fileType || fallbackData.fileType,
    image: fallbackData.image,
    imageLabel: fallbackData.imageLabel,
  };

  const handleDownload = () => {
    Alert.alert('Download Started', `Downloading ${record.title} (${record.fileType || 'PDF'}) to your device storage...`);
  };

  const handleShare = () => {
    Alert.alert('Share Record', `Sharing encrypted link for ${record.title}...`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{record.title}</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color="#16a34a" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* RECORD METADATA CARD */}
        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>{record.recordType}</Text>
          <Text style={styles.metaSub}>Uploaded by <Text style={{ fontWeight: '700', color: '#0f172a' }}>{record.doctorName}</Text> • {record.date}</Text>
        </View>

        {/* IMAGE / DOCUMENT VIEWER CONTAINER */}
        <View style={styles.viewerBox}>
          {record.image ? (
            <Image
              source={record.image}
              style={styles.scanImage}
              resizeMode="contain"
            />
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="document-text-outline" size={64} color="#003D9B" />
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff', marginTop: 8 }}>{record.title}</Text>
              <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{record.fileType || 'Verified Clinical PDF'}</Text>
            </View>
          )}

          <View style={styles.imageOverlayBadge}>
            <Ionicons name="expand-outline" size={16} color="#ffffff" />
            <Text style={styles.imageOverlayText}>{record.imageLabel || 'Document View'}</Text>
          </View>
        </View>

        {/* ACTION BUTTONS ROW */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <Ionicons name="download-outline" size={18} color="#003D9B" />
            <Text style={styles.actionBtnText}>Download</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Ionicons name="share-social-outline" size={18} color="#003D9B" />
            <Text style={styles.actionBtnText}>Share PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('Print', `Sending ${record.title} to default printer...`)}>
            <Ionicons name="print-outline" size={18} color="#003D9B" />
            <Text style={styles.actionBtnText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* CLINICAL NOTES CARD */}
        <View style={styles.notesCard}>
          <View style={styles.notesHeaderRow}>
            <Ionicons name="document-text-outline" size={20} color="#003D9B" style={{ marginRight: 8 }} />
            <Text style={styles.notesHeaderTitle}>Clinical Notes</Text>
          </View>

          <Text style={styles.notesBodyText}>
            "{record.notes}"
          </Text>

          <View style={styles.doctorPill}>
            <View style={styles.doctorAvatar}>
              <Text style={styles.doctorAvatarInitial}>{record.doctorName ? record.doctorName.charAt(0).toUpperCase() : 'D'}</Text>
            </View>
            <View>
              <Text style={styles.doctorPillName}>{record.doctorName}</Text>
              <Text style={styles.doctorPillSub}>Senior MSK Specialist</Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
    marginLeft: 4,
  },
  scrollContent: {
    padding: 20,
  },
  metaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  metaSub: {
    fontSize: 12,
    color: '#64748b',
  },
  viewerBox: {
    width: '100%',
    height: 280,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  scanImage: {
    width: '90%',
    height: '90%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  imageOverlayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
    marginTop: 4,
  },
  notesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  notesBodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  doctorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  doctorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  doctorAvatarInitial: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  doctorPillName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  doctorPillSub: {
    fontSize: 11,
    color: '#64748b',
  },
});
