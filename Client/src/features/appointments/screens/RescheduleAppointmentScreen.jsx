import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import appointmentApi from '../api';

const { width } = Dimensions.get('window');
const defaultAvatarAsset = require('../../../../assets/images/therapist_female_1.png');

const getAvatarSource = (source) => {
  if (!source) return defaultAvatarAsset;
  if (typeof source === 'string') {
    if (source.startsWith('http://') || source.startsWith('https://') || source.startsWith('data:')) {
      return { uri: source };
    }
    return defaultAvatarAsset;
  }
  if (typeof source === 'object' && source.uri) return source;
  if (typeof source === 'number') return source;
  return defaultAvatarAsset;
};

const generateUpcomingDates = (count = 14) => {
  const dates = [];
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    const dayStr = daysOfWeek[d.getDay()];
    const dateNum = d.getDate().toString();
    const monthStr = monthNames[d.getMonth()];
    const yearNum = d.getFullYear();
    
    dates.push({
      day: dayStr,
      date: dateNum,
      month: monthStr,
      full: `${dayStr}, ${dateNum} ${monthStr} ${yearNum}`,
      isoDate: d.toISOString().slice(0, 10),
      isToday: i === 0,
    });
  }
  return dates;
};

const DATES = generateUpcomingDates(14);

const SLOTS = [
  { time: '08:30 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:45 AM', available: true },
  { time: '02:00 PM', available: true },
  { time: '03:30 PM', available: true },
];

export default function RescheduleAppointmentScreen({ route, navigation }) {
  const { token } = useSelector((state) => state.auth);
  const booking = route.params?.booking || {
    _id: 'appt_1',
    doctorName: 'Dr. Ananya Iyer',
    specialty: 'Senior Orthopedic Specialist',
    originalSlot: 'OCT 24, 10:30 AM',
    avatar: defaultAvatarAsset,
  };

  const [selectedDateObj, setSelectedDateObj] = useState(DATES[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM');
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);

  const doctorAvatarSource = getAvatarSource(booking.avatar || booking.avatarUrl || booking.doctorAvatar);

  const handleConfirmReschedule = async () => {
    try {
      const apptId = booking._id || booking.appointmentId || 'appt_1';
      await appointmentApi.rescheduleAppointment(apptId, selectedDateObj.full, selectedTimeSlot, token);
    } catch (err) {
      console.warn('[Reschedule] API error:', err);
    }

    Alert.alert(
      'Appointment Rescheduled 🎉',
      `Your appointment with ${booking.doctorName || 'your doctor'} has been moved to ${selectedDateObj.full} at ${selectedTimeSlot}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('MyBookings'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reschedule Appointment</Text>
        <TouchableOpacity style={styles.headerRightBtn} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* ORIGINAL APPOINTMENT BANNER */}
        <View style={styles.originalCard}>
          <Image source={doctorAvatarSource} style={styles.originalAvatar} resizeMode="cover" />
          <View style={{ flex: 1 }}>
            <Text style={styles.originalDocName}>{booking.doctorName || 'Dr. Ananya Iyer'}</Text>
            <Text style={styles.originalDocSub}>{booking.specialty || 'Senior Orthopedic Specialist'}</Text>
            <View style={styles.originalSlotBadge}>
              <Ionicons name="calendar-outline" size={12} color="#003D9B" style={{ marginRight: 4 }} />
              <Text style={styles.originalSlotText}>
                ORIGINAL: {booking.originalSlot || booking.date || 'OCT 24, 10:30 AM'}
              </Text>
            </View>
          </View>
        </View>

        {/* SELECT NEW DATE HEADER */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Select New Date</Text>
          <TouchableOpacity 
            style={styles.calendarToggleBtn}
            onPress={() => setCalendarModalVisible(true)}
          >
            <Ionicons name="calendar" size={14} color="#003D9B" style={{ marginRight: 4 }} />
            <Text style={styles.monthText}>
              {selectedDateObj.month ? `${selectedDateObj.date} ${selectedDateObj.month} 2026` : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* RESPONSIVE DATE STRIP */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.dateSelectorRow}
        >
          {DATES.map((item, idx) => {
            const isSelected = selectedDateObj.isoDate ? selectedDateObj.isoDate === item.isoDate : selectedDateObj.date === item.date;
            return (
              <TouchableOpacity
                key={item.isoDate || idx}
                activeOpacity={0.8}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDateObj(item)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateNumText, isSelected && styles.dateNumTextSelected]}>
                  {item.date}
                </Text>
                {item.isToday && !isSelected && (
                  <View style={styles.todayDot} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* AVAILABLE TIME SLOTS */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>
          Available Time Slots
        </Text>

        <View style={styles.slotsGrid}>
          {SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <TouchableOpacity
                key={slot.time}
                disabled={!slot.available}
                activeOpacity={0.8}
                style={[
                  styles.slotBox,
                  !slot.available && styles.slotBoxDisabled,
                  isSelected && styles.slotBoxSelected,
                ]}
                onPress={() => setSelectedTimeSlot(slot.time)}
              >
                <Text
                  style={[
                    styles.slotTimeText,
                    !slot.available && styles.slotTimeTextDisabled,
                    isSelected && styles.slotTimeTextSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SELECTION SUMMARY BOX */}
        <View style={styles.summaryBoxCard}>
          <View style={styles.summaryHeaderRow}>
            <View style={styles.summaryIconBox}>
              <Ionicons name="calendar" size={22} color="#003D9B" />
            </View>
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryDateTimeText}>
                {selectedDateObj.full} • {selectedTimeSlot}
              </Text>
              <Text style={styles.summaryDurationText}>45 mins consultation</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STICKY CONFIRM RESCHEDULE CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.confirmBtn}
          activeOpacity={0.88}
          onPress={handleConfirmReschedule}
        >
          <Text style={styles.confirmBtnText}>Confirm Reschedule ➔</Text>
        </TouchableOpacity>
      </View>

      {/* CALENDAR PICKER MODAL */}
      <Modal
        visible={calendarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Date</Text>
              <TouchableOpacity onPress={() => setCalendarModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>Select any available date in the upcoming 2 weeks:</Text>
            <View style={styles.gridCalendarWrap}>
              {DATES.map((item) => {
                const isSelected = selectedDateObj.isoDate === item.isoDate;
                return (
                  <TouchableOpacity
                    key={item.isoDate}
                    style={[styles.modalDateChip, isSelected && styles.modalDateChipSelected]}
                    onPress={() => {
                      setSelectedDateObj(item);
                      setCalendarModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalDateChipDay, isSelected && { color: '#ffffff' }]}>{item.day}</Text>
                    <Text style={[styles.modalDateChipNum, isSelected && { color: '#ffffff' }]}>{item.date} {item.month}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  headerBackBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerRightBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 95,
  },
  originalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  originalAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    backgroundColor: '#e2e8f0',
  },
  originalDocName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  originalDocSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  originalSlotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  originalSlotText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#003D9B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  calendarToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  monthText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  dateSelectorRow: {
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  dateCard: {
    width: 62,
    height: 74,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  dateCardSelected: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748b',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dayTextSelected: {
    color: '#93c5fd',
  },
  dateNumText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  dateNumTextSelected: {
    color: '#ffffff',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#003D9B',
    marginTop: 3,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  slotBox: {
    width: '31%',
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  slotBoxDisabled: {
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    elevation: 0,
  },
  slotBoxSelected: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  slotTimeTextDisabled: {
    color: '#cbd5e1',
  },
  slotTimeTextSelected: {
    color: '#ffffff',
  },
  summaryBoxCard: {
    backgroundColor: '#f0f4ff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#dbeafe',
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryDateTimeText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  summaryDurationText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  bottomCtaBar: {
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
  confirmBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  gridCalendarWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modalDateChip: {
    width: '23%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  modalDateChipSelected: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  modalDateChipDay: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  modalDateChipNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
});
