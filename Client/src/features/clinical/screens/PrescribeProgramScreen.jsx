import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import clinicalApi from '../api';
import { colors } from '../../../theme/colors';
import { themeStyles } from '../../../theme/styles';

export default function PrescribeProgramScreen({ route, navigation }) {
  const { patientId } = route.params;
  const { token } = useSelector(state => state.auth);

  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      sets: '3',
      reps: '10',
      duration: '30',
      notes: 'Perform slowly, keeping your posture aligned.'
    }
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await clinicalApi.getExercises(token);
        if (res.success) {
          setExercises(res.data);
        }
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [token]);

  // Synchronize react-hook-form inputs when selectedExercise changes
  useEffect(() => {
    if (selectedExercise) {
      reset({
        sets: selectedExercise.defaultSets?.toString() || '3',
        reps: selectedExercise.defaultReps?.toString() || '10',
        duration: selectedExercise.defaultDurationSec?.toString() || '30',
        notes: 'Perform slowly, keeping your posture aligned.'
      });
    }
  }, [selectedExercise]);

  const handlePrescribe = async (formData) => {
    if (!selectedExercise) {
      Alert.alert('Selection Required', 'Please choose an exercise from the library.');
      return;
    }

    setSubmitting(true);
    const prescriptionData = {
      patientId,
      programId: '661fe211a78fb80124806a01', // Example program ID from catalog
      startDate: new Date().toISOString(),
      patientGoals: 'Improve range of motion and reduce lumbar loading.',
      exerciseOverrides: [
        {
          exerciseId: selectedExercise._id,
          name: selectedExercise.name,
          sets: parseInt(formData.sets) || 3,
          reps: parseInt(formData.reps) || 12,
          durationSec: parseInt(formData.duration) || 30,
          notes: formData.notes
        }
      ]
    };

    try {
      const res = await clinicalApi.prescribeProgram(prescriptionData, token);
      if (res.success) {
        Alert.alert('Program Prescribed', 'The exercise routine has been assigned to the patient.');
        navigation.pop(2); // Go back to dashboard
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[themeStyles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={themeStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Navigation back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={themeStyles.headingLarge}>Prescribe Program</Text>
          <Text style={themeStyles.bodyText}>Assign an exercise with custom parameters.</Text>
        </View>

        {/* Exercises selector */}
        <Text style={styles.sectionTitle}>1. Select Exercise</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseRow}>
          {exercises.map(item => {
            const isSelected = selectedExercise?._id === item._id;
            return (
              <TouchableOpacity
                key={item._id}
                style={[styles.exerciseCard, isSelected && styles.exerciseCardActive]}
                onPress={() => setSelectedExercise(item)}
              >
                <Text style={[styles.exName, isSelected && styles.exTextActive]}>{item.name}</Text>
                <Text style={[styles.exCat, isSelected && styles.exCatActive]}>{item.category}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedExercise && (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>2. Define Parameters</Text>
            
            <View style={styles.paramRow}>
              <View style={styles.paramInputGroup}>
                <Text style={styles.label}>Sets</Text>
                <Controller
                  control={control}
                  name="sets"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={themeStyles.input}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              <View style={styles.paramInputGroup}>
                <Text style={styles.label}>Reps</Text>
                <Controller
                  control={control}
                  name="reps"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={themeStyles.input}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
              <View style={styles.paramInputGroup}>
                <Text style={styles.label}>Hold Duration (s)</Text>
                <Controller
                  control={control}
                  name="duration"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={themeStyles.input}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            </View>

            <Text style={styles.label}>Therapist Guidance Instructions / Notes</Text>
            <Controller
              control={control}
              name="notes"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[themeStyles.input, styles.multilineInput]}
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                />
              )}
            />

            <View style={styles.submitContainer}>
              <TouchableOpacity style={themeStyles.button} onPress={handleSubmit(handlePrescribe)} disabled={submitting}>
                {submitting ? <ActivityIndicator color={colors.white} /> : <Text style={themeStyles.buttonText}>Prescribe Exercise</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
  },
  backBtn: {
    marginBottom: 12,
  },
  backBtnText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.slate800,
    marginVertical: 12,
  },
  exerciseRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  exerciseCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.slate200,
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    width: 140,
    height: 90,
    justifyContent: 'space-between',
  },
  exerciseCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  exName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.slate900,
  },
  exTextActive: {
    color: colors.white,
  },
  exCat: {
    fontSize: 11,
    color: colors.slate500,
  },
  exCatActive: {
    color: colors.primaryLight,
  },
  formContainer: {
    marginTop: 10,
  },
  paramRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paramInputGroup: {
    width: '30%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.slate600,
    marginBottom: 6,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitContainer: {
    marginTop: 16,
    marginBottom: 40,
  }
});
