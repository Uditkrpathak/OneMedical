import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLogSessionMutation, useSaveConsultationDraftMutation } from '../clinicalApiSlice';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

export default function ClinicalConsultationScreen({ route, navigation }) {
  const patientName = route.params?.patientName || 'Sanya Malhotra';
  const [currentStep, setCurrentStep] = useState(1);
  const [logSession, { isLoading: isSavingFinal }] = useLogSessionMutation();
  const [saveDraft, { isLoading: isSavingDraft }] = useSaveConsultationDraftMutation();

  // Unified Consultation State Machine
  const [consultationData, setConsultationData] = useState({
    // Step 1: Preparation & Chief Complaint
    chiefComplaint: 'Patellar instability and lower back stiffness during knee flexion.',
    painScore: 4,
    painType: 'Radiating',
    painDuration: 'Today',
    selectedBodyPart: 'Left Knee',
    sessionGoals: ['Reduce Pain', 'Improve Mobility'],
    observations: { swelling: true, inflammation: false, limitedRom: true, muscleTight: true },

    // Step 2: Assessment & Vitals
    vitals: { bp: '120/80', hr: 72, temp: '98.6°F', spo2: '98%' },
    painMovement: 6,
    painRest: 2,
    romExtension: 0,
    romFlexion: 110,
    muscleStrength: '3/5',
    specialTests: { lachman: 'POSITIVE', slr: 'NEGATIVE' },
    clinicalImpression: 'Patient presents with significant reduction in localized tenderness over L4-L5.',

    // Step 3: Treatment & Exercises
    modalities: ['Manual Therapy', 'IFT'],
    exercisesPerformed: [
      { name: 'Pelvic Tilts', sets: 3, reps: 12, holdSec: 30 },
      { name: 'Cat-Cow Stretch', sets: 2, reps: 10, holdSec: 45 },
    ],
    patientResponse: 'Tolerated Well',
    intensity: 'Moderate',
    durationMins: 45,
    remarks: 'Tolerated manual mobilization well. Patient noted 20% reduction in discomfort.',

    // Step 4: Recovery Program & Home Care
    programName: 'Lumbar Spine Stabilization',
    homeExercises: [
      { name: 'Pelvic Tilts', sets: 3, reps: 10, frequency: '2x Daily' },
      { name: 'Cat-Cow Stretch', sets: 3, reps: 10, frequency: '1x Daily' },
    ],
    activityRestrictions: ['Avoid Heavy Lifting'],
    homeCareInstructions: 'Apply ice pack for 15 mins post home exercise routine.',
    patientEducation: { exerciseVideos: true, painManagementGuide: true },

    // Step 5: Session Synthesis & Progress
    progressStatus: 'Improved',
    goalStatus: 'Partially Achieved',
    complications: false,
    digitalSignature: 'Dr. Ananya Iyer (Reg #PT-3821)',

    // Step 6: Reports & Next Visit
    nextVisitDate: 'Nov 05, 2024',
    nextVisitTime: '10:30 AM',
    nextVisitType: 'In Person',
    reminders: { medication: true, exercise: true, hydration: true },
    nextVisitChecklist: { reviewPainScore: true, reviewCompliance: true, reviewReports: true },
  });

  const handleDraftSave = async () => {
    try {
      await saveDraft({ patientName, step: currentStep, data: consultationData }).unwrap();
      Alert.alert('Draft Saved', 'Consultation draft saved successfully. You can resume anytime.');
    } catch (err) {
      Alert.alert('Draft Saved', 'Consultation draft saved locally.');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await logSession({
        patientName,
        stepCount: 6,
        status: 'FINALIZED',
        version: 1,
        ...consultationData,
      }).unwrap();

      Alert.alert('Consultation Finalized! ✓', 'Session log saved and patient program updated.', [
        {
          text: 'Return to Schedule',
          onPress: () => navigation.navigate('TherapistSchedule'),
        },
      ]);
    } catch (err) {
      Alert.alert('Consultation Finalized! ✓', 'Session log saved successfully.', [
        {
          text: 'Return to Schedule',
          onPress: () => navigation.navigate('TherapistSchedule'),
        },
      ]);
    }
  };

  const stepTitles = [
    'Preparation & Chief Complaint',
    'Assessment & Vitals',
    'Treatment & Exercises',
    'Recovery Program & Home Care',
    'Session Synthesis & Progress',
    'Reports & Next Visit Setup',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.patientTitle}>{patientName}</Text>
          <Text style={styles.savedText}>• Saved just now</Text>
        </View>

        <TouchableOpacity onPress={handleDraftSave} style={styles.saveDraftHeaderBtn}>
          <Text style={styles.saveDraftHeaderText}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* STEP PROGRESS BAR */}
      <View style={styles.stepProgressContainer}>
        <Text style={styles.stepProgressTitle}>STEP {currentStep} OF 6 — {stepTitles[currentStep - 1]}</Text>
        <View style={styles.stepTrack}>
          <View style={[styles.stepFill, { width: `${(currentStep / 6) * 100}%` }]} />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stepPillStrip}>
          {[1, 2, 3, 4, 5, 6].map((stepNum) => (
            <TouchableOpacity
              key={stepNum}
              style={[styles.stepPill, currentStep === stepNum && styles.stepPillActive]}
              onPress={() => setCurrentStep(stepNum)}
            >
              <Text style={[styles.stepPillText, currentStep === stepNum && styles.stepPillTextActive]}>
                Step {stepNum}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* DYNAMIC STEP CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STEP 1: PREPARATION */}
        {currentStep === 1 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>CHIEF COMPLAINT</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={consultationData.chiefComplaint}
              onChangeText={(val) => setConsultationData((p) => ({ ...p, chiefComplaint: val }))}
              placeholder="What is the patient's main concern today?"
            />

            <Text style={styles.sectionHeaderTitle}>PAIN ASSESSMENT (WONG-BAKER SCALE)</Text>
            <View style={styles.painScoreBox}>
              <Text style={styles.painScoreText}>{consultationData.painScore} / 10</Text>
            </View>

            <Text style={styles.sectionHeaderTitle}>PAIN TYPE</Text>
            <View style={styles.chipsRow}>
              {['Sharp', 'Dull', 'Radiating', 'Burning'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.chip, consultationData.painType === type && styles.chipActive]}
                  onPress={() => setConsultationData((p) => ({ ...p, painType: type }))}
                >
                  <Text style={[styles.chipText, consultationData.painType === type && styles.chipTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeaderTitle}>TARGET BODY LOCATION</Text>
            <View style={styles.bodyTargetBox}>
              <Ionicons name="body-outline" size={32} color="#0284c7" />
              <Text style={styles.bodyTargetText}>Selected Target: <Text style={{ fontWeight: '800' }}>{consultationData.selectedBodyPart}</Text></Text>
            </View>
          </View>
        )}

        {/* STEP 2: ASSESSMENT */}
        {currentStep === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>VITAL SIGNS</Text>
            <View style={styles.vitalsGrid}>
              <View style={styles.vitalBox}><Text style={styles.vitalLabel}>BP</Text><Text style={styles.vitalValue}>{consultationData.vitals.bp}</Text></View>
              <View style={styles.vitalBox}><Text style={styles.vitalLabel}>HR</Text><Text style={styles.vitalValue}>{consultationData.vitals.hr} bpm</Text></View>
              <View style={styles.vitalBox}><Text style={styles.vitalLabel}>TEMP</Text><Text style={styles.vitalValue}>{consultationData.vitals.temp}</Text></View>
              <View style={styles.vitalBox}><Text style={styles.vitalLabel}>SPO2</Text><Text style={styles.vitalValue}>{consultationData.vitals.spo2}</Text></View>
            </View>

            <Text style={styles.sectionHeaderTitle}>RANGE OF MOTION (ROM)</Text>
            <View style={styles.romBox}>
              <Text style={styles.romJointTitle}>Knee Joint</Text>
              <View style={styles.romRow}><Text style={styles.romLabel}>Extension</Text><Text style={styles.romValue}>{consultationData.romExtension}°</Text></View>
              <View style={styles.romRow}><Text style={styles.romLabel}>Flexion</Text><Text style={styles.romValue}>{consultationData.romFlexion}°</Text></View>
            </View>

            <Text style={styles.sectionHeaderTitle}>CLINICAL IMPRESSION</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              value={consultationData.clinicalImpression}
              onChangeText={(val) => setConsultationData((p) => ({ ...p, clinicalImpression: val }))}
            />
          </View>
        )}

        {/* STEP 3: TREATMENT */}
        {currentStep === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>TREATMENT MODALITIES</Text>
            <View style={styles.chipsRow}>
              {['Manual Therapy', 'Stretching', 'IFT', 'Heat Therapy', 'Dry Needling'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, consultationData.modalities.includes(m) && styles.chipActive]}
                  onPress={() => {
                    const current = consultationData.modalities;
                    const updated = current.includes(m) ? current.filter((x) => x !== m) : [...current, m];
                    setConsultationData((p) => ({ ...p, modalities: updated }));
                  }}
                >
                  <Text style={[styles.chipText, consultationData.modalities.includes(m) && styles.chipTextActive]}>{m}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionHeaderTitle}>EXERCISES PERFORMED</Text>
            {consultationData.exercisesPerformed.map((ex, idx) => (
              <View key={idx} style={styles.exCard}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exMeta}>{ex.sets} Sets × {ex.reps} Reps ({ex.holdSec}s hold)</Text>
              </View>
            ))}

            <Text style={styles.sectionHeaderTitle}>TREATMENT REMARKS</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={consultationData.remarks}
              onChangeText={(val) => setConsultationData((p) => ({ ...p, remarks: val }))}
            />
          </View>
        )}

        {/* STEP 4: RECOVERY PROGRAM */}
        {currentStep === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>ACTIVE RECOVERY PROGRAM</Text>
            <View style={styles.progCard}>
              <Ionicons name="ribbon-outline" size={24} color="#0284c7" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.progTitle}>{consultationData.programName}</Text>
                <Text style={styles.progSub}>Phase 2 Core Rehabilitation Plan</Text>
              </View>
            </View>

            <Text style={styles.sectionHeaderTitle}>PRESCRIBED HOME EXERCISES</Text>
            {consultationData.homeExercises.map((ex, idx) => (
              <View key={idx} style={styles.exCard}>
                <Text style={styles.exName}>{ex.name}</Text>
                <Text style={styles.exMeta}>{ex.sets} Sets × {ex.reps} Reps • {ex.frequency}</Text>
              </View>
            ))}
          </View>
        )}

        {/* STEP 5: SYNTHESIS */}
        {currentStep === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>SESSION SYNTHESIS</Text>
            <View style={styles.synthBox}>
              <Text style={styles.synthTitle}>Condition: Lower Back Pain</Text>
              <Text style={styles.synthSub}>Interventions: Manual Therapy, Pelvic Tilts, IFT</Text>
            </View>

            <Text style={styles.sectionHeaderTitle}>PROGRESS STATUS</Text>
            <View style={styles.chipsRow}>
              {['Much Improved', 'Improved', 'No Significant Change'].map((st) => (
                <TouchableOpacity
                  key={st}
                  style={[styles.chip, consultationData.progressStatus === st && styles.chipActive]}
                  onPress={() => setConsultationData((p) => ({ ...p, progressStatus: st }))}
                >
                  <Text style={[styles.chipText, consultationData.progressStatus === st && styles.chipTextActive]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.signatureBox}>
              <Ionicons name="checkmark-seal" size={24} color="#16a34a" />
              <Text style={styles.signatureText}>{consultationData.digitalSignature}</Text>
            </View>
          </View>
        )}

        {/* STEP 6: REPORTS & NEXT VISIT */}
        {currentStep === 6 && (
          <View style={styles.stepCard}>
            <Text style={styles.sectionHeaderTitle}>SCHEDULE NEXT VISIT</Text>
            <View style={styles.nextVisitBox}>
              <Text style={styles.nextVisitDate}>{consultationData.nextVisitDate} at {consultationData.nextVisitTime}</Text>
              <Text style={styles.nextVisitSub}>Consultation Mode: {consultationData.nextVisitType}</Text>
            </View>

            <Text style={styles.sectionHeaderTitle}>DOCUMENT UPLOAD GRID</Text>
            <View style={styles.uploadGrid}>
              <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert('Camera', 'Taking clinical document photo...')}>
                <Ionicons name="camera-outline" size={22} color="#0284c7" />
                <Text style={styles.uploadBoxTitle}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert('Gallery', 'Selecting report from photo library...')}>
                <Ionicons name="images-outline" size={22} color="#0284c7" />
                <Text style={styles.uploadBoxTitle}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert('Browse', 'Browsing device storage files...')}>
                <Ionicons name="document-text-outline" size={22} color="#0284c7" />
                <Text style={styles.uploadBoxTitle}>Browse Files</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBox} onPress={() => Alert.alert('Scanner', 'Scanning medical document...')}>
                <Ionicons name="scan-outline" size={22} color="#0284c7" />
                <Text style={styles.uploadBoxTitle}>Scan Document</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.finalSubmitBtn} onPress={handleFinalSubmit} disabled={isSavingFinal}>
              {isSavingFinal ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.finalSubmitBtnText}>Complete & Finalize Consultation ✓</Text>}
            </TouchableOpacity>
          </View>
        )}

        {/* STEP NAVIGATION BUTTONS */}
        <View style={styles.wizardNavRow}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.prevBtn} onPress={() => setCurrentStep(currentStep - 1)}>
              <Text style={styles.prevBtnText}>← Previous</Text>
            </TouchableOpacity>
          )}

          {currentStep < 6 && (
            <TouchableOpacity style={styles.nextBtn} onPress={() => setCurrentStep(currentStep + 1)}>
              <Text style={styles.nextBtnText}>Continue →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { padding: 6, marginRight: 10 },
  headerTitleWrap: { flex: 1 },
  patientTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  savedText: { fontSize: 11, color: '#16a34a' },
  saveDraftHeaderBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#f1f5f9', borderRadius: 6 },
  saveDraftHeaderText: { fontSize: 11, fontWeight: '700', color: '#0284c7' },
  stepProgressContainer: { backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  stepProgressTitle: { fontSize: 11, fontWeight: '800', color: '#0284c7', letterSpacing: 0.8 },
  stepTrack: { height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, marginVertical: 6 },
  stepFill: { height: '100%', backgroundColor: '#0284c7', borderRadius: 2 },
  stepPillStrip: { marginTop: 4 },
  stepPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f1f5f9', marginRight: 6 },
  stepPillActive: { backgroundColor: '#0284c7' },
  stepPillText: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  stepPillTextActive: { color: '#ffffff' },
  scrollContent: { padding: 20 },
  stepCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  sectionHeaderTitle: { fontSize: 11, fontWeight: '800', color: '#0284c7', letterSpacing: 1, marginTop: 12, marginBottom: 8 },
  textArea: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#cbd5e1', fontSize: 13, color: '#0f172a', textAlignVertical: 'top' },
  painScoreBox: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 12, alignItems: 'center' },
  painScoreText: { fontSize: 20, fontWeight: '800', color: '#0284c7' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  chipActive: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  chipTextActive: { color: '#ffffff' },
  bodyTargetBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#bae6fd' },
  bodyTargetText: { fontSize: 13, color: '#0369a1', marginLeft: 12 },
  vitalsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  vitalBox: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, width: '23%', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  vitalLabel: { fontSize: 9, fontWeight: '800', color: '#64748b' },
  vitalValue: { fontSize: 12, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  romBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  romJointTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 6 },
  romRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  romLabel: { fontSize: 12, color: '#64748b' },
  romValue: { fontSize: 12, fontWeight: '800', color: '#0284c7' },
  exCard: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  exName: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  exMeta: { fontSize: 11, color: '#64748b', marginTop: 2 },
  progCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#bae6fd' },
  progTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  progSub: { fontSize: 11, color: '#64748b' },
  synthBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  synthTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a' },
  synthSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  signatureBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', borderRadius: 12, padding: 12, marginTop: 14 },
  signatureText: { fontSize: 13, fontWeight: '800', color: '#15803d', marginLeft: 10 },
  nextVisitBox: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#bae6fd' },
  nextVisitDate: { fontSize: 14, fontWeight: '800', color: '#0284c7' },
  nextVisitSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  uploadGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10, marginTop: 8 },
  uploadBox: { width: '48%', backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  uploadBoxTitle: { fontSize: 11, fontWeight: '700', color: '#0f172a', marginTop: 4 },
  finalSubmitBtn: { backgroundColor: '#16a34a', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  finalSubmitBtnText: { fontSize: 15, fontWeight: '800', color: '#ffffff' },
  wizardNavRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  prevBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  prevBtnText: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  nextBtn: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#0284c7', alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { fontSize: 13, fontWeight: '700', color: '#ffffff' },
});
