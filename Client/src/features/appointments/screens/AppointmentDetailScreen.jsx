import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

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

export default function AppointmentDetailScreen({ route, navigation }) {
  const booking = route.params?.booking || {
    id: '#APT-2024-8842',
    doctorName: 'Dr. Ananya Iyer',
    specialty: 'Senior Orthopedic Specialist',
    status: 'Upcoming',
    date: 'Tuesday, Oct 24 • 10:30 AM',
    service: 'Post-Surgery Rehab',
    duration: '45 mins',
    clinic: 'Clinic Visit • One Medical Central',
    address: '124 Wellness Ave, Medical District, NY 10012',
    receiptId: '#RC-821-992',
    avatar: defaultAvatarAsset,
  };

  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Arrive 10 minutes early for check-in', checked: true },
    { id: 2, text: 'Bring previous surgery & scan reports', checked: false },
    { id: 3, text: 'Wear comfortable, loose-fitting clothing', checked: false },
  ]);

  const doctorAvatarSource = getAvatarSource(booking.avatar || booking.avatarUrl || booking.doctorAvatar);

  const toggleCheck = (id) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appointment Details</Text>
        <TouchableOpacity style={styles.headerRightBtn} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* STATUS & COUNTDOWN HERO CARD */}
        <View style={styles.heroStatusCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingBadgeText}>{booking.status}</Text>
            </View>
            <Text style={styles.heroIdText}>{booking.id}</Text>
          </View>

          <View style={styles.countdownRow}>
            <Ionicons name="time-outline" size={24} color="#003D9B" style={{ marginRight: 10 }} />
            <View>
              <Text style={styles.countdownTitle}>Starts in 2 days</Text>
              <Text style={styles.countdownSub}>{booking.date}</Text>
            </View>
          </View>
        </View>

        {/* DOCTOR CARD WITH CALL & MESSAGE */}
        <View style={styles.doctorCard}>
          <View style={styles.docHeaderRow}>
            <Image source={doctorAvatarSource} style={styles.docAvatar} resizeMode="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{booking.doctorName || 'Dr. Ananya Iyer'}</Text>
              <Text style={styles.docSpecialty}>{booking.specialty || 'Senior Orthopedic Specialist'}</Text>
              <Text style={styles.docMeta}>★ 4.9 • One Medical Hub</Text>
            </View>
          </View>

          <View style={styles.contactButtonsRow}>
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="call-outline" size={16} color="#003D9B" style={{ marginRight: 6 }} />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color="#003D9B" style={{ marginRight: 6 }} />
              <Text style={styles.contactBtnText}>Message</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.contactBtn, { backgroundColor: '#fef3c7', borderColor: '#fde047' }]}
              onPress={() =>
                navigation.navigate('WriteDoctorReview', {
                  doctor: {
                    name: booking.doctorName,
                    specialty: booking.specialty,
                    clinic: booking.clinic,
                    rating: 4.9,
                    reviewsCount: 128,
                  },
                  booking,
                })
              }
            >
              <Ionicons name="star" size={16} color="#b45309" style={{ marginRight: 6 }} />
              <Text style={[styles.contactBtnText, { color: '#b45309', fontWeight: '700' }]}>Rate Doctor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* APPOINTMENT INFO GRID */}
        <View style={styles.infoGridCard}>
          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>SERVICE</Text>
              <Text style={styles.infoValue}>{booking.service || 'Post-Surgery Rehab'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>DURATION</Text>
              <Text style={styles.infoValue}>{booking.duration || '45 mins'}</Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View>
            <Text style={styles.infoLabel}>MODE & ADDRESS</Text>
            <Text style={styles.infoValueBold}>{booking.clinic}</Text>
            <Text style={styles.infoValueSub}>{booking.address}</Text>
          </View>

          {/* MAP PREVIEW & GET DIRECTIONS */}
          <View style={styles.mapContainer}>
            <Image
              source={require('../../../../assets/images/clinic_location_1.png')}
              style={styles.mapPhoto}
            />
            <TouchableOpacity
              style={styles.getDirectionsBtn}
              activeOpacity={0.85}
              onPress={() => {
                const query = encodeURIComponent(booking.address || 'One Medical Hub');
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(err => {
                  Alert.alert('Opening Maps', 'Navigating to ' + (booking.clinic || 'One Medical Hub'));
                });
              }}
            >
              <Ionicons name="navigate-outline" size={14} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.getDirectionsBtnText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PREPARATION CHECKLIST */}
        <View style={styles.checklistCard}>
          <Text style={styles.checklistTitle}>Preparation Checklist</Text>
          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.checkItemRow}
              onPress={() => toggleCheck(item.id)}
            >
              <Ionicons
                name={item.checked ? 'checkbox' : 'square-outline'}
                size={20}
                color={item.checked ? '#003D9B' : '#94a3b8'}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.checkItemText, item.checked && styles.checkItemTextChecked]}>
                {item.text}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* PAYMENT STATUS & RECEIPT */}
        <View style={styles.paymentStatusCard}>
          <View style={styles.paymentHeaderRow}>
            <View>
              <Text style={styles.infoLabel}>PAYMENT STATUS</Text>
              <View style={styles.paidStatusRow}>
                <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 4 }} />
                <Text style={styles.paidStatusText}>Paid Online</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.infoLabel}>RECEIPT ID</Text>
              <Text style={styles.receiptIdText}>{booking.receiptId || '#RC-821-992'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.downloadInvoiceBtn}>
            <Ionicons name="download-outline" size={14} color="#003D9B" style={{ marginRight: 6 }} />
            <Text style={styles.downloadInvoiceBtnText}>Download Invoice</Text>
          </TouchableOpacity>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity
          style={styles.primaryRescheduleBtn}
          activeOpacity={0.88}
          onPress={() => navigation.navigate('RescheduleAppointment', { booking })}
        >
          <Text style={styles.primaryRescheduleBtnText}>Reschedule Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelLinkBtn}
          onPress={() => navigation.navigate('CancelAppointment', { booking })}
        >
          <Text style={styles.cancelLinkText}>Cancel Appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    paddingBottom: 40,
  },
  heroStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  upcomingBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
  },
  heroIdText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  countdownSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  docAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    backgroundColor: '#e2e8f0',
  },
  docName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  docSpecialty: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  docMeta: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003D9B',
    marginTop: 3,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  contactBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  infoGridCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
  },
  infoLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  infoValueBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  infoValueSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 1,
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 12,
  },
  mapContainer: {
    height: 130,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    position: 'relative',
  },
  mapPhoto: {
    width: '100%',
    height: '100%',
  },
  getDirectionsBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003D9B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  getDirectionsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  checklistCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkItemText: {
    fontSize: 12,
    color: '#334155',
  },
  checkItemTextChecked: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  paymentStatusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  paymentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paidStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  paidStatusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },
  receiptIdText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  downloadInvoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  downloadInvoiceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  primaryRescheduleBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 14,
  },
  primaryRescheduleBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  cancelLinkBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
});
