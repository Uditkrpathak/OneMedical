import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSocket } from '../../../context/SocketContext';
import clinicalApi from '../api';
import appointmentApi from '../../appointments/api';

const { width } = Dimensions.get('window');

export default function TherapistDashboardScreen({ navigation }) {
  const { token, user } = useSelector((state) => state.auth);
  const socket = useSocket();

  const [patients, setPatients] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patRes, apptRes] = await Promise.all([
          clinicalApi.getAssignedPatients(token),
          appointmentApi.getAppointments(token)
        ]);

        if (patRes.success && Array.isArray(patRes.data)) {
          setPatients(patRes.data);
        }

        if (apptRes.success && Array.isArray(apptRes.data)) {
          const formatted = apptRes.data.map(item => ({
            id: item._id || item.appointmentId,
            time: item.startTime ? `${item.startTime}` : '10:00 AM',
            status: (item.status || 'SCHEDULED').toUpperCase(),
            patientName: item.patientName || item.patientId || 'Patient',
            patientAge: '30y',
            program: item.serviceType || 'Rehab Consultation',
            duration: `${item.durationMin || 45} mins`,
            isNext: item.status === 'confirmed' || item.status === 'held',
          }));
          setScheduleItems(formatted);
        }
      } catch (err) {
        console.log('[TherapistDashboard] API warning:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (socket) {
      socket.on('clinical_alert', (data) => {
        setAlerts((prev) => [data, ...prev]);
        Alert.alert('⚠️ Critical Pain Alert', `${data.patientName} reported a pain level of ${data.painLevel}/10!`);
      });
      return () => {
        socket.off('clinical_alert');
      };
    }
  }, [socket]);

  return (
    <SafeAreaView style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBarRow}>
        <Image
          source={require('../../../../assets/images/therapist_male_1.jpg')}
          style={styles.headerAvatar}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.greetingTitle}>Good Morning, {user?.name || 'Dr. Sagar'} 👋</Text>
          <Text style={styles.greetingSub}>Ready for your 12 appointments today</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={20} color="#0f172a" />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* TODAY OVERVIEW CARD */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.overviewLabel}>TODAY OVERVIEW</Text>
              <View style={styles.totalRow}>
                <Text style={styles.totalNumText}>12</Text>
                <Text style={styles.totalSubText}>Total{'\n'}Appointments</Text>
              </View>
              <Text style={styles.overviewSub}>8 Consultations • 4 Monitoring</Text>
              
              <View style={styles.nextCountdownBadge}>
                <Ionicons name="time-outline" size={12} color="#0038A8" style={{ marginRight: 4 }} />
                <Text style={styles.nextCountdownText}>Next in 15 mins</Text>
              </View>
            </View>

            {/* CIRCULAR PROGRESS GAUGE */}
            <View style={styles.gaugeOuter}>
              <View style={styles.gaugeInner}>
                <Text style={styles.gaugePercentText}>33%</Text>
                <Text style={styles.gaugeLabelText}>DONE</Text>
              </View>
            </View>
          </View>
        </View>

        {/* REALTIME CRITICAL ALERTS */}
        {alerts.length > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={20} color="#dc2626" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertBannerTitle}>Pain Alert Reported</Text>
              <Text style={styles.alertBannerMsg}>{alerts[0].patientName}: Pain level {alerts[0].painLevel}/10</Text>
            </View>
            <TouchableOpacity style={styles.alertActionBtn} onPress={() => Alert.alert('Action Taken', 'Opening patient chat protocol...')}>
              <Text style={styles.alertActionText}>Review</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* NEXT PATIENT HERO CARD */}
        <Text style={styles.sectionTitle}>Next Patient</Text>
        <View style={styles.nextPatientCard}>
          <View style={styles.nextPatientHeader}>
            <Image
              source={require('../../../../assets/images/therapist_male_1.jpg')}
              style={styles.nextPatientAvatar}
            />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.nextPatientName}>Rahul Sharma, 32y</Text>
                <View style={styles.nextUpTag}>
                  <Text style={styles.nextUpTagText}>NEXT UP</Text>
                </View>
              </View>
              <Text style={styles.nextPatientProgram}>ACL Post-Op Recovery • Week 4</Text>
              <View style={styles.nextTimeRow}>
                <Ionicons name="alarm-outline" size={13} color="#0038A8" style={{ marginRight: 4 }} />
                <Text style={styles.nextTimeText}>10:30 AM (in 15 mins)</Text>
              </View>
            </View>
          </View>

          {/* QUICK BUTTONS */}
          <View style={styles.nextPatientActionsRow}>
            <TouchableOpacity
              style={styles.startSessionBtn}
              activeOpacity={0.88}
              onPress={() => Alert.alert('Session Started', 'Initiated consultation timer for Rahul Sharma.')}
            >
              <Ionicons name="play" size={16} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.startSessionBtnText}>Start Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewDetailsBtn}
              onPress={() => navigation.navigate('PatientDetail', { patient: { name: 'Rahul Sharma', userId: 'p1' } })}
            >
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PENDING TASKS */}
        <Text style={styles.sectionTitle}>Pending Tasks</Text>
        <View style={styles.pendingTasksRow}>
          <TouchableOpacity style={styles.taskPillCard} onPress={() => Alert.alert('Prescriptions', '3 prescriptions pending review.')}>
            <View style={styles.taskIconBadge}>
              <Ionicons name="document-text" size={16} color="#0038A8" />
            </View>
            <Text style={styles.taskCountText}>3</Text>
            <Text style={styles.taskLabelText}>Prescriptions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskPillCard} onPress={() => Alert.alert('Reports', '5 medical reports pending.')}>
            <View style={styles.taskIconBadge}>
              <Ionicons name="clipboard" size={16} color="#0038A8" />
            </View>
            <Text style={styles.taskCountText}>5</Text>
            <Text style={styles.taskLabelText}>Reports Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskPillCard} onPress={() => navigation.navigate('Chat')}>
            <View style={styles.taskIconBadge}>
              <Ionicons name="chatbubbles" size={16} color="#0038A8" />
            </View>
            <Text style={styles.taskCountText}>2</Text>
            <Text style={styles.taskLabelText}>Messages</Text>
          </TouchableOpacity>
        </View>

        {/* DAILY SCHEDULE */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Daily Schedule</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
            <Text style={styles.seeAllText}>Full Day ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scheduleWrap}>
          {scheduleItems.map((item) => (
            <View key={item.id} style={[styles.scheduleItemCard, item.isNext && styles.scheduleItemCardNext]}>
              <View style={styles.scheduleTimeCol}>
                <Text style={styles.scheduleTimeText}>{item.time}</Text>
                <View
                  style={[
                    styles.statusChip,
                    item.status === 'COMPLETED' && { backgroundColor: '#e2e8f0' },
                    item.status === 'NEXT UP' && { backgroundColor: '#e6f0ff' },
                    item.status === 'SCHEDULED' && { backgroundColor: '#f1f5f9' },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      item.status === 'COMPLETED' && { color: '#64748b' },
                      item.status === 'NEXT UP' && { color: '#0038A8' },
                      item.status === 'SCHEDULED' && { color: '#334155' },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              <View style={styles.scheduleDetailsCol}>
                <Text style={styles.schedulePatientName}>{item.patientName}</Text>
                <Text style={styles.scheduleProgramText}>{item.program}</Text>
                <Text style={styles.scheduleDurationText}>⏰ {item.duration}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS GRID */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.quickActionTile} onPress={() => navigation.navigate('Appointments')}>
            <View style={styles.quickActionIconCircle}>
              <Ionicons name="people-outline" size={20} color="#0038A8" />
            </View>
            <Text style={styles.quickActionTileText}>Patient List</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionTile} onPress={() => Alert.alert('Search', 'Opening patient lookup...')}>
            <View style={styles.quickActionIconCircle}>
              <Ionicons name="search-outline" size={20} color="#0038A8" />
            </View>
            <Text style={styles.quickActionTileText}>Search Patient</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionTile} onPress={() => navigation.navigate('MedicalRecords')}>
            <View style={styles.quickActionIconCircle}>
              <Ionicons name="folder-open-outline" size={20} color="#0038A8" />
            </View>
            <Text style={styles.quickActionTileText}>Treatment Library</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionTile} onPress={() => Alert.alert('Reports', 'Generating clinic reports...')}>
            <View style={styles.quickActionIconCircle}>
              <Ionicons name="bar-chart-outline" size={20} color="#0038A8" />
            </View>
            <Text style={styles.quickActionTileText}>Reports</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM STATS STRIP */}
        <View style={styles.bottomStatsStrip}>
          <View style={styles.statStripItem}>
            <Text style={styles.statStripNum}>4</Text>
            <Text style={styles.statStripLabel}>New Patients</Text>
          </View>
          <View style={styles.statStripDivider} />
          <View style={styles.statStripItem}>
            <Text style={styles.statStripNum}>45m</Text>
            <Text style={styles.statStripLabel}>Avg Session</Text>
          </View>
          <View style={styles.statStripDivider} />
          <View style={styles.statStripItem}>
            <Text style={styles.statStripNum}>18</Text>
            <Text style={styles.statStripLabel}>Active Rehabs</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e2e8f0',
  },
  greetingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  greetingSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#dc2626',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  overviewCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
    marginBottom: 20,
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0038A8',
    letterSpacing: 1,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  totalNumText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0f172a',
    marginRight: 8,
  },
  totalSubText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    lineHeight: 14,
  },
  overviewSub: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
  },
  nextCountdownBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  nextCountdownText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0038A8',
  },
  gaugeOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 5,
    borderColor: '#0038A8',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  gaugeInner: {
    alignItems: 'center',
  },
  gaugePercentText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  gaugeLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginBottom: 20,
  },
  alertBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#dc2626',
  },
  alertBannerMsg: {
    fontSize: 11,
    color: '#991b1b',
    marginTop: 1,
  },
  alertActionBtn: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  alertActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0038A8',
  },
  nextPatientCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#0038A8',
    marginBottom: 20,
    shadowColor: '#0038A8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  nextPatientHeader: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  nextPatientAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  nextPatientName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  nextUpTag: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  nextUpTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0038A8',
  },
  nextPatientProgram: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  nextTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  nextTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0038A8',
  },
  nextPatientActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  startSessionBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0038A8',
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0038A8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  startSessionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  viewDetailsBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewDetailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  pendingTasksRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  taskPillCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  taskIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  taskCountText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  taskLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  scheduleWrap: {
    marginBottom: 24,
    gap: 10,
  },
  scheduleItemCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scheduleItemCardNext: {
    borderColor: '#0038A8',
    backgroundColor: '#f0f4ff',
  },
  scheduleTimeCol: {
    width: 90,
    marginRight: 10,
  },
  scheduleTimeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  statusChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusChipText: {
    fontSize: 9,
    fontWeight: '800',
  },
  scheduleDetailsCol: {
    flex: 1,
  },
  schedulePatientName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  scheduleProgramText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  scheduleDurationText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0038A8',
    marginTop: 4,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  quickActionTile: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickActionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionTileText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  bottomStatsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f0f4ff',
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  statStripItem: {
    alignItems: 'center',
  },
  statStripNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0038A8',
  },
  statStripLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
  },
  statStripDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#dbeafe',
  },
});
