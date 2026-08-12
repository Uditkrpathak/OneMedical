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

const BODY_REGIONS = [
  { id: 'neck', name: 'Neck & Cervical', icon: 'body-outline' },
  { id: 'shoulder_left', name: 'Left Shoulder', icon: 'hand-left-outline' },
  { id: 'shoulder_right', name: 'Right Shoulder', icon: 'hand-right-outline' },
  { id: 'upper_back', name: 'Upper Back & Thoracic', icon: 'fitness-outline' },
  { id: 'lumbar', name: 'Lumbar Spine & Lower Back', icon: 'accessibility-outline' },
  { id: 'hip', name: 'Hip & Pelvis', icon: 'walk-outline' },
  { id: 'knee_left', name: 'Left Knee Joint', icon: 'body-outline' },
  { id: 'knee_right', name: 'Right Knee Joint', icon: 'body-outline' },
  { id: 'ankle', name: 'Ankle & Foot', icon: 'footsteps-outline' },
];

const PAIN_TYPES = [
  { id: 'aching', label: '⚡ Aching' },
  { id: 'sharp', label: '🗡️ Sharp' },
  { id: 'burning', label: '🔥 Burning' },
  { id: 'throbbing', label: '💓 Throbbing' },
  { id: 'stiffness', label: '🪵 Stiffness' },
  { id: 'radiating', label: '🌊 Radiating' },
];

const PAST_LOGS = [
  { id: '1', region: 'Lumbar Spine & Lower Back', level: 6, date: 'Yesterday • 6:30 PM', quality: 'Stiffness' },
  { id: '2', region: 'Right Knee Joint', level: 4, date: '3 days ago', quality: 'Aching' },
  { id: '3', region: 'Lumbar Spine & Lower Back', level: 8, date: '1 week ago', quality: 'Sharp' },
];

export default function BodyPainMapScreen({ navigation }) {
  const [viewSide, setViewSide] = useState('back'); // 'front' | 'back'
  const [selectedRegion, setSelectedRegion] = useState(BODY_REGIONS[4]); // Lumbar Spine
  const [painLevel, setPainLevel] = useState(5);
  const [selectedPainTypes, setSelectedPainTypes] = useState(['stiffness', 'aching']);
  const [logs, setLogs] = useState(PAST_LOGS);
  const [saving, setSaving] = useState(false);

  const togglePainType = (id) => {
    if (selectedPainTypes.includes(id)) {
      setSelectedPainTypes(selectedPainTypes.filter((t) => t !== id));
    } else {
      setSelectedPainTypes([...selectedPainTypes, id]);
    }
  };

  const getPainColor = (level) => {
    if (level <= 3) return '#10b981'; // Green
    if (level <= 6) return '#f59e0b'; // Yellow / Orange
    return '#ef4444'; // Red
  };

  const getPainLabel = (level) => {
    if (level <= 3) return 'Mild Discomfort';
    if (level <= 6) return 'Moderate Pain';
    return 'Severe Pain';
  };

  const handleSavePainLog = () => {
    setSaving(true);
    setTimeout(() => {
      const newEntry = {
        id: String(Date.now()),
        region: selectedRegion?.name || 'Lumbar Spine',
        level: painLevel,
        date: 'Just Now',
        quality: selectedPainTypes.map(t => PAIN_TYPES.find(p => p.id === t)?.label.replace(/^.\s*/, '')).join(', ') || 'General Pain',
      };
      setLogs([newEntry, ...logs]);
      setSaving(false);
      Alert.alert('Pain Log Saved', `Recorded ${selectedRegion?.name || 'Lumbar Spine'} pain level ${painLevel}/10 for your therapist to review.`, [
        { text: 'OK', onPress: () => navigation.goBack() }
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
        <Text style={styles.headerTitle}>Interactive Pain Map</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* FRONT / BACK SIDE TOGGLE */}
        <View style={styles.sideToggleBar}>
          <TouchableOpacity
            style={[styles.sideToggleBtn, viewSide === 'front' && styles.sideToggleBtnActive]}
            onPress={() => setViewSide('front')}
          >
            <Text style={[styles.sideToggleText, viewSide === 'front' && styles.sideToggleTextActive]}>
              Front Body View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sideToggleBtn, viewSide === 'back' && styles.sideToggleBtnActive]}
            onPress={() => setViewSide('back')}
          >
            <Text style={[styles.sideToggleText, viewSide === 'back' && styles.sideToggleTextActive]}>
              Back Body View
            </Text>
          </TouchableOpacity>
        </View>

        {/* SELECT REGION PILLS */}
        <Text style={styles.sectionTitle}>SELECT AFFECTED REGION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionsScroll}>
          {BODY_REGIONS.map((region) => {
            const isSelected = selectedRegion.id === region.id;
            return (
              <TouchableOpacity
                key={region.id}
                style={[styles.regionChip, isSelected && styles.regionChipSelected]}
                onPress={() => setSelectedRegion(region)}
              >
                <Ionicons name={region.icon} size={18} color={isSelected ? '#0284c7' : '#64748b'} />
                <Text style={[styles.regionChipText, isSelected && styles.regionChipTextSelected]}>
                  {region.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* PAIN INTENSITY SLIDER / SELECTOR */}
        <View style={styles.painBoxCard}>
          <Text style={styles.sectionTitle}>PAIN INTENSITY SCALE (1 - 10)</Text>

          <View style={styles.painScoreHeader}>
            <View style={[styles.scoreBadge, { backgroundColor: getPainColor(painLevel) }]}>
              <Text style={styles.scoreBadgeText}>{painLevel}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.painLabelText}>{getPainLabel(painLevel)}</Text>
              <Text style={styles.regionSelectedText}>Selected: {selectedRegion.name}</Text>
            </View>
          </View>

          {/* PAIN LEVEL RATING BUTTONS (1-10) */}
          <View style={styles.painLevelGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = painLevel === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.numBox,
                    isSelected && { backgroundColor: getPainColor(num), borderColor: getPainColor(num) },
                  ]}
                  onPress={() => setPainLevel(num)}
                >
                  <Text style={[styles.numText, isSelected && { color: '#ffffff', fontWeight: '800' }]}>
                    {num}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* PAIN QUALITY / TYPE SELECTOR */}
        <Text style={styles.sectionTitle}>PAIN QUALITY & SENSATION</Text>
        <View style={styles.painTypesGrid}>
          {PAIN_TYPES.map((type) => {
            const isSelected = selectedPainTypes.includes(type.id);
            return (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeChip, isSelected && styles.typeChipSelected]}
                onPress={() => togglePainType(type.id)}
              >
                <Text style={[styles.typeChipText, isSelected && styles.typeChipTextSelected]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PAIN LOG HISTORY TIMELINE */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>RECENT PAIN LOGS</Text>

        <View style={styles.historyList}>
          {logs.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={[styles.historyBadgeCircle, { backgroundColor: getPainColor(item.level) }]}>
                <Text style={styles.historyBadgeText}>{item.level}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyRegionText}>{item.region}</Text>
                <Text style={styles.historySubText}>{item.quality} • {item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* SAVE BUTTON BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSavePainLog}>
          <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Pain Entry'}</Text>
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
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
  sideToggleBar: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  sideToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sideToggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sideToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  sideToggleTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1.1,
    marginBottom: 10,
  },
  regionsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  regionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  regionChipSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7',
  },
  regionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  regionChipTextSelected: {
    color: '#0284c7',
    fontWeight: '800',
  },
  painBoxCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  painScoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBadgeText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  painLabelText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  regionSelectedText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  painLevelGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  numBox: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
  painTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  typeChipSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0284c7',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  typeChipTextActive: {
    color: '#0284c7',
    fontWeight: '800',
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  historyBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  historyRegionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  historySubText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
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
    backgroundColor: '#0284c7',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
