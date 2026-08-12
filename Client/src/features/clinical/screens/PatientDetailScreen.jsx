import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import clinicalApi from '../api';
import { colors } from '../../../theme/colors';
import { themeStyles } from '../../../theme/styles';

export default function PatientDetailScreen({ route, navigation }) {
  const { patient } = route.params;
  const { token } = useSelector(state => state.auth);

  const [painTrend, setPainTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPainTrend = async () => {
      try {
        const res = await clinicalApi.getPainTrend('prog_p1', token); // Use active program or default mock
        if (res.success) {
          setPainTrend(res.data);
        }
      } catch (err) {
        console.warn('[Patient Detail] Failed to get pain trend:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPainTrend();
  }, [token]);

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
          <Text style={styles.backBtnText}>← Back to Dashboard</Text>
        </TouchableOpacity>

        {/* Patient header */}
        <View style={styles.header}>
          <Text style={themeStyles.headingLarge}>{patient.name}</Text>
          <Text style={themeStyles.bodyText}>Contact: {patient.phoneNumber}</Text>
        </View>

        {/* Recovery Analytics */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.headingMedium}>Recovery score: {patient.recoveryScore}%</Text>
          
          {/* Mock Progress Line Chart */}
          <Text style={styles.chartTitle}>Pain Index Progression (VAS Scale)</Text>
          <View style={styles.mockChartContainer}>
            {painTrend.length === 0 ? (
              <Text style={styles.emptyText}>No sessions logged yet.</Text>
            ) : (
              <View style={styles.chartRow}>
                {painTrend.map((pt, idx) => (
                  <View key={idx} style={styles.chartCol}>
                    <View style={[styles.chartBar, { height: pt.painLevel * 12, backgroundColor: pt.painLevel >= 7 ? colors.danger : colors.success }]} />
                    <Text style={styles.chartVal}>{pt.painLevel}</Text>
                    <Text style={styles.chartDate}>{pt.date.split('-').slice(1).join('/')}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Range of Motion (ROM) Trackers */}
        <View style={themeStyles.card}>
          <Text style={themeStyles.headingMedium}>Range of Motion (ROM) Indicators</Text>
          <View style={styles.romRow}>
            <View style={styles.romBox}>
              <Text style={styles.romNum}>95°</Text>
              <Text style={styles.romLabel}>Knee Flexion (Target 120°)</Text>
            </View>
            <View style={styles.romBox}>
              <Text style={styles.romNum}>15°</Text>
              <Text style={styles.romLabel}>Extension (Target 0°)</Text>
            </View>
          </View>
        </View>

        {/* Prescribe program actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[themeStyles.button, { backgroundColor: colors.secondary }]}
            onPress={() => navigation.navigate('PrescribeProgram', { patientId: patient.userId })}
          >
            <Text style={themeStyles.buttonText}>Prescribe/Adjust Exercises</Text>
          </TouchableOpacity>
        </View>
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
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.slate600,
    marginTop: 14,
    marginBottom: 10,
  },
  mockChartContainer: {
    backgroundColor: colors.slate50,
    borderRadius: 12,
    padding: 16,
    height: 160,
    justifyContent: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
  },
  chartCol: {
    alignItems: 'center',
  },
  chartBar: {
    width: 24,
    borderRadius: 4,
  },
  chartVal: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.slate800,
    marginTop: 4,
  },
  chartDate: {
    fontSize: 9,
    color: colors.slate500,
    marginTop: 2,
  },
  romRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  romBox: {
    flex: 1,
    backgroundColor: colors.slate50,
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  romNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.slate800,
  },
  romLabel: {
    fontSize: 11,
    color: colors.slate500,
    textAlign: 'center',
    marginTop: 4,
  },
  actionsContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.slate400,
  }
});
