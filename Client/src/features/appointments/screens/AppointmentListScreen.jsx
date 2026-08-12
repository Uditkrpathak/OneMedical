import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import appointmentApi from '../api';
import { colors } from '../../../theme/colors';
import { themeStyles } from '../../../theme/styles';

export default function AppointmentListScreen() {
  const { token, user } = useSelector(state => state.auth);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await appointmentApi.getAppointments(token);
        if (res.success) {
          setAppointments(res.data);
        }
      } catch (err) {
        Alert.alert('Error', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'confirmed': return { bg: colors.success + '20', text: colors.success };
      case 'held': return { bg: colors.warning + '20', text: colors.warning };
      case 'cancelled': return { bg: colors.danger + '20', text: colors.danger };
      default: return { bg: colors.slate100, text: colors.slate600 };
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
      <View style={styles.header}>
        <Text style={themeStyles.headingLarge}>My Appointments</Text>
        <Text style={themeStyles.bodyText}>Manage your sessions and schedules.</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No appointments scheduled yet.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getStatusBadgeColor(item.status);
          const isPatient = user.role === 'patient';
          return (
            <View style={themeStyles.card}>
              <View style={themeStyles.rowBetween}>
                <Text style={themeStyles.headingMedium}>
                  {isPatient ? item.therapistName : `Patient ID: ${item.patientId}`}
                </Text>
                <View style={[themeStyles.badge, { backgroundColor: badge.bg }]}>
                  <Text style={[themeStyles.badgeText, { color: badge.text }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>
              <Text style={styles.serviceText}>{item.serviceType}</Text>
              <View style={[themeStyles.rowBetween, { marginTop: 10 }]}>
                <Text style={styles.datetimeText}>📅 {item.date}</Text>
                <Text style={styles.datetimeText}>⏰ {item.startTime} - {item.endTime}</Text>
              </View>
              <View style={[themeStyles.rowBetween, { marginTop: 8, borderTopWidth: 1, borderTopColor: colors.slate100, paddingTop: 8 }]}>
                <Text style={styles.payText}>Payment: {item.paymentStatus.toUpperCase()}</Text>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  listPadding: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  serviceText: {
    fontSize: 14,
    color: colors.slate600,
    marginTop: 4,
    fontWeight: '500',
  },
  datetimeText: {
    fontSize: 13,
    color: colors.slate500,
    fontWeight: '600',
  },
  payText: {
    fontSize: 12,
    color: colors.slate500,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: colors.slate400,
    fontSize: 16,
    fontWeight: '500',
  }
});
