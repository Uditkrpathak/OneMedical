import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

// Generate dynamic 14-day date strip starting from today (or target date)
const generateDates = () => {
  const dates = [];
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayName = dayNames[d.getDay()];
    const monthName = monthNames[d.getMonth()];
    const dateNum = d.getDate();
    const fullYear = d.getFullYear();
    
    dates.push({
      id: d.toISOString().split('T')[0],
      day: dayName,
      date: String(dateNum),
      month: monthName,
      year: fullYear,
      full: `${dayName}, ${dateNum} ${monthName}`,
      fullYearStr: `${dayName}, ${dateNum} ${monthName} ${fullYear}`,
      isToday: i === 0,
    });
  }
  return dates;
};

const MORNING_SLOTS = [
  { time: '08:30 AM', available: true },
  { time: '09:30 AM', available: true },
  { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true },
  { time: '11:45 AM', available: true },
];

const AFTERNOON_SLOTS = [
  { time: '02:00 PM', available: true },
  { time: '03:30 PM', available: true },
  { time: '04:15 PM', available: true },
];

const EVENING_SLOTS = [
  { time: '05:30 PM', available: true },
  { time: '06:45 PM', available: false },
  { time: '07:30 PM', available: true },
];

export default function SelectDateTimeScreen({ route, navigation }) {
  const doctor = route.params?.doctor || {
    name: 'Dr. Ananya Iyer',
    specialty: 'MSK Specialist • One Medical Hub',
    fee: 1500,
    rating: 4.9,
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
  };

  const datesList = generateDates();
  const [selectedDateObj, setSelectedDateObj] = useState(datesList[0]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30 AM');
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  // Month grid for full calendar modal
  const generateMonthGrid = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthName = today.toLocaleString('default', { month: 'long' });
    const year = today.getFullYear();

    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, today.getMonth(), day);
      const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
      days.push({
        dayNum: day,
        dayName: dayNames[d.getDay()],
        full: `${dayNames[d.getDay()]}, ${day} ${monthNames[d.getMonth()]}`,
        isPast: d < new Date(today.setHours(0,0,0,0)),
      });
    }
    return { monthName, year, days };
  };

  const monthGridData = generateMonthGrid();

  const handleSelectModalDate = (item) => {
    if (item.isPast) return;
    const foundInList = datesList.find(d => Number(d.date) === item.dayNum) || {
      id: `custom_${item.dayNum}`,
      day: item.dayName,
      date: String(item.dayNum),
      full: item.full,
    };
    setSelectedDateObj(foundInList);
    setShowCalendarModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Date & Time</Text>
        <TouchableOpacity style={styles.calendarHeaderBtn} onPress={() => setShowCalendarModal(true)}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }}
            style={{ width: 32, height: 32, borderRadius: 16 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* DOCTOR MINI SUMMARY CARD */}
        <View style={styles.doctorSummaryCard}>
          <Image
            source={{ uri: doctor.avatarUrl || doctor.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300' }}
            style={styles.doctorSummaryAvatar}
          />
          <View style={styles.doctorSummaryTextContent}>
            <Text style={styles.docSummaryName}>{doctor.name}</Text>
            <Text style={styles.docSummarySub}>{doctor.specialty || 'MSK Specialist • One Medical Hub'}</Text>
            <View style={styles.docSummaryMetaRow}>
              <Text style={styles.docSummaryRating}>★ {doctor.rating || 4.9}</Text>
              <Text style={styles.docSummaryDot}>|</Text>
              <Text style={styles.docSummaryFee}>₹{doctor.fee || 1500}</Text>
            </View>
          </View>
        </View>

        {/* SELECT DATE SECTION HEADER */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e6f0ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 }}
            onPress={() => setShowCalendarModal(true)}
          >
            <Ionicons name="calendar" size={14} color="#003D9B" style={{ marginRight: 6 }} />
            <Text style={styles.selectedMonthSub}>{selectedDateObj.month || 'Aug'} {selectedDateObj.year || 2026}</Text>
          </TouchableOpacity>
        </View>

        {/* HORIZONTAL DATE STRIP */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateSelectorScroll}>
          {datesList.map((item) => {
            const isSelected = selectedDateObj.date === item.date;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                onPress={() => setSelectedDateObj(item)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                  {item.day}
                </Text>
                <Text style={[styles.dateNumText, isSelected && styles.dateNumTextSelected]}>
                  {item.date}
                </Text>
                {item.isToday && (
                  <View style={[styles.todayDot, isSelected && styles.todayDotSelected]} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* TIME SLOTS GROUP: MORNING */}
        <Text style={[styles.sectionTitle, { marginTop: 22, marginBottom: 12 }]}>
          Available Time Slots
        </Text>
        <View style={styles.slotsGrid}>
          {MORNING_SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <TouchableOpacity
                key={slot.time}
                disabled={!slot.available}
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

        {/* TIME SLOTS GROUP: AFTERNOON */}
        <Text style={[styles.sectionTitle, { marginTop: 18, marginBottom: 10 }]}>
          ☀️ Afternoon Slots
        </Text>
        <View style={styles.slotsGrid}>
          {AFTERNOON_SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <TouchableOpacity
                key={slot.time}
                disabled={!slot.available}
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

        {/* TIME SLOTS GROUP: EVENING */}
        <Text style={[styles.sectionTitle, { marginTop: 18, marginBottom: 10 }]}>
          🌙 Evening Slots
        </Text>
        <View style={styles.slotsGrid}>
          {EVENING_SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot.time;
            return (
              <TouchableOpacity
                key={slot.time}
                disabled={!slot.available}
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
              <Ionicons name="calendar-outline" size={20} color="#003D9B" />
            </View>
            <View style={styles.summaryDetails}>
              <Text style={styles.summaryDateTimeText}>
                {selectedDateObj.full} • {selectedTimeSlot}
              </Text>
              <Text style={styles.summaryDurationText}>45 mins consultation</Text>
            </View>
            <Text style={styles.summaryFeeAmount}>₹{doctor.fee || 1500}</Text>
          </View>
        </View>
      </ScrollView>

      {/* FULL MONTH CALENDAR MODAL */}
      <Modal visible={showCalendarModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContentCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {monthGridData.monthName} {monthGridData.year}
              </Text>
              <TouchableOpacity onPress={() => setShowCalendarModal(false)}>
                <Ionicons name="close-circle" size={26} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* DAY NAME LABELS */}
            <View style={styles.calendarDayHeaderRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <Text key={i} style={styles.calendarDayHeaderText}>{d}</Text>
              ))}
            </View>

            {/* MONTH DAYS GRID */}
            <View style={styles.calendarGrid}>
              {monthGridData.days.map((item) => {
                const isSelected = Number(selectedDateObj.date) === item.dayNum;
                return (
                  <TouchableOpacity
                    key={item.dayNum}
                    disabled={item.isPast}
                    style={[
                      styles.modalDayBox,
                      item.isPast && styles.modalDayBoxDisabled,
                      isSelected && styles.modalDayBoxSelected,
                    ]}
                    onPress={() => handleSelectModalDate(item)}
                  >
                    <Text
                      style={[
                        styles.modalDayNumText,
                        item.isPast && styles.modalDayNumTextDisabled,
                        isSelected && styles.modalDayNumTextSelected,
                      ]}
                    >
                      {item.dayNum}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

        {/* STICKY CONTINUE CTA */}
        <View style={styles.bottomCtaBar}>
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate('ChoosePayment', {
                doctor,
                dateStr: selectedDateObj.full,
                timeStr: selectedTimeSlot,
              })
            }
          >
            <Text style={styles.continueBtnText}>Continue ➔</Text>
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
  headerBackBtn: {
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
  calendarHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  doctorSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  doctorSummaryAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  doctorSummaryTextContent: {
    flex: 1,
  },
  docSummaryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  docSummarySub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  docSummaryMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  docSummaryRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  docSummaryDot: {
    fontSize: 12,
    color: '#cbd5e1',
    marginHorizontal: 6,
  },
  docSummaryFee: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003D9B',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  selectedMonthSub: {
    fontSize: 12,
    color: '#003D9B',
    fontWeight: '700',
  },
  dateSelectorScroll: {
    gap: 10,
    paddingBottom: 4,
  },
  dateCard: {
    width: 58,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dateCardSelected: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 2,
  },
  dayTextSelected: {
    color: '#ffffff',
  },
  dateNumText: {
    fontSize: 17,
    fontWeight: '800',
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
    position: 'absolute',
    bottom: 6,
  },
  todayDotSelected: {
    backgroundColor: '#ffffff',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotBox: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '30%',
    alignItems: 'center',
  },
  slotBoxSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#003D9B',
    borderWidth: 2,
  },
  slotBoxDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#f1f5f9',
    opacity: 0.6,
  },
  slotTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  slotTimeTextSelected: {
    color: '#003D9B',
    fontWeight: '800',
  },
  slotTimeTextDisabled: {
    color: '#94a3b8',
  },
  summaryBoxCard: {
    marginTop: 24,
    backgroundColor: '#f0f6ff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
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
    marginRight: 12,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryDateTimeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryDurationText: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryFeeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#003D9B',
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
  continueBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContentCard: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '75%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  calendarDayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  calendarDayHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748b',
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  modalDayBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalDayBoxSelected: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  modalDayBoxDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: 'transparent',
    opacity: 0.4,
  },
  modalDayNumText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalDayNumTextSelected: {
    color: '#ffffff',
  },
  modalDayNumTextDisabled: {
    color: '#94a3b8',
  },
});
