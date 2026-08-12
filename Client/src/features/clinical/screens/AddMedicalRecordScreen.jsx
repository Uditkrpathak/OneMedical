import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const CATEGORIES = [
  { id: 'xray', label: 'X-Ray / Scan', icon: 'image-outline' },
  { id: 'prescription', label: 'Prescription', icon: 'document-text-outline' },
  { id: 'lab', label: 'Lab Report', icon: 'flask-outline' },
  { id: 'mri', label: 'MRI / CT Scan', icon: 'body-outline' },
  { id: 'discharge', label: 'Discharge Summary', icon: 'paper-plane-outline' },
];

export default function AddMedicalRecordScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('xray');
  const [doctorName, setDoctorName] = useState('');
  const [recordDate, setRecordDate] = useState('2026-08-10');
  const [notes, setNotes] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handlePickFile = () => {
    // Mock attachment selection
    setAttachedFile({
      name: 'knee_xray_scan.jpg',
      size: '2.4 MB',
      uri: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600',
    });
    Alert.alert('File Attached', 'Successfully selected knee_xray_scan.jpg');
  };

  const handleSaveRecord = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for the record.');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Record Saved', 'Medical record added successfully to your vault.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medical Record</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>DOCUMENT TITLE *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Right Knee X-Ray Report"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* CATEGORY SELECTOR */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catCard, isSelected && styles.catCardSelected]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Ionicons name={cat.icon} size={20} color={isSelected ? '#003D9B' : '#64748b'} />
                  <Text style={[styles.catLabel, isSelected && styles.catLabelSelected]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* DOCTOR NAME */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>DOCTOR / CLINIC NAME</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Dr. Sarah Johnson"
            placeholderTextColor="#94a3b8"
            value={doctorName}
            onChangeText={setDoctorName}
          />
        </View>

        {/* RECORD DATE */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>RECORD DATE</Text>
          <View style={styles.dateInputRow}>
            <Ionicons name="calendar-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.textInputFlex}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94a3b8"
              value={recordDate}
              onChangeText={setRecordDate}
            />
          </View>
        </View>

        {/* ATTACH FILE BOX */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>ATTACHMENT (IMAGE / PDF)</Text>
          {attachedFile ? (
            <View style={styles.filePreviewCard}>
              <Ionicons name="document-attach" size={24} color="#003D9B" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.fileNameText}>{attachedFile.name}</Text>
                <Text style={styles.fileSizeText}>{attachedFile.size}</Text>
              </View>
              <TouchableOpacity onPress={() => setAttachedFile(null)}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadDashedBox} onPress={handlePickFile}>
              <Ionicons name="cloud-upload-outline" size={32} color="#003D9B" style={{ marginBottom: 6 }} />
              <Text style={styles.uploadTitle}>Tap to upload document</Text>
              <Text style={styles.uploadSub}>Supports JPG, PNG, PDF up to 10MB</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* NOTES / DIAGNOSIS */}
        <View style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>ADDITIONAL NOTES</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Enter clinical notes, doctor recommendations or medication specs..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      {/* SAVE BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSaveRecord}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save to Vault'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
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
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  fieldBlock: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  catScroll: {
    gap: 10,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  catCardSelected: {
    backgroundColor: '#e6f0ff',
    borderColor: '#003D9B',
  },
  catLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  catLabelSelected: {
    color: '#003D9B',
    fontWeight: '800',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textInputFlex: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  uploadDashedBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#dbeafe',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  uploadSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  filePreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  fileSizeText: {
    fontSize: 11,
    color: '#64748b',
  },
  textArea: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  saveBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
