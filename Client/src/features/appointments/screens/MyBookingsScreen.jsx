import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import appointmentApi from '../api';

const { width } = Dimensions.get('window');

const FALLBACK_BOOKINGS = [
  {
    id: '#APT-2024-8842',
    doctorName: 'Dr. Ananya Iyer',
    specialty: 'Senior Orthopedic Specialist',
    status: 'UPCOMING',
    date: 'Tuesday, Oct 24, 2024',
    time: '10:30 AM – 11:15 AM',
    location: 'One Medical Central, MG Road, Bengaluru',
    format: 'Clinic Visit',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    id: '#APT-2024-7719',
    doctorName: 'Dr. Arjun Mehta',
    specialty: 'Sports Rehab Specialist',
    status: 'UPCOMING',
    date: 'Friday, Nov 03, 2024',
    time: '02:00 PM – 02:45 PM',
    format: 'Video Consultation',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
  },
];

export default function MyBookingsScreen({ navigation }) {
  const { token } = useSelector((state) => state.auth);
  const [tab, setTab] = useState('upcoming'); // 'upcoming' | 'past' | 'cancelled'
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await appointmentApi.getMyAppointments(token);
        if (res.success && res.data && res.data.length > 0) {
          const formatted = res.data.map(item => ({
            id: `#${item._id?.slice(-8).toUpperCase() || 'APT-8842'}`,
            doctorName: item.therapistId?.userId?.name || 'Dr. Ananya Iyer',
            specialty: item.serviceType || 'Orthopedic Specialist',
            status: (item.status || 'upcoming').toUpperCase(),
            date: item.appointmentDate ? new Date(item.appointmentDate).toDateString() : 'Tue, Oct 24, 2024',
            time: `${item.startTime || '10:30 AM'} – ${item.endTime || '11:15 AM'}`,
            location: item.location?.address || 'One Medical Central, MG Road',
            format: item.type === 'online' ? 'Video Consultation' : 'Clinic Visit',
            avatar: require('../../../../assets/images/therapist_female_1.jpg'),
          }));
          setBookings(formatted);
        } else {
          setBookings(FALLBACK_BOOKINGS);
        }
      } catch (err) {
        setBookings(FALLBACK_BOOKINGS);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const filteredBookings = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'UPCOMING' || b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (tab === 'past') return b.status === 'COMPLETED';
    if (tab === 'cancelled') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={styles.headerAvatarCircle}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }}
            style={styles.headerAvatarImg}
          />
        </View>
      </View>

      {/* FILTER SEGMENT TABS */}
      <View style={styles.segmentBar}>
        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'upcoming' && styles.segmentBtnActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.segmentText, tab === 'upcoming' && styles.segmentTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'past' && styles.segmentBtnActive]}
          onPress={() => setTab('past')}
        >
          <Text style={[styles.segmentText, tab === 'past' && styles.segmentTextActive]}>
            Past
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'cancelled' && styles.segmentBtnActive]}
          onPress={() => setTab('cancelled')}
        >
          <Text style={[styles.segmentText, tab === 'cancelled' && styles.segmentTextActive]}>
            Cancelled
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#0284c7" size="large" style={{ marginVertical: 30 }} />
        ) : filteredBookings.length > 0 ? (
          <View style={styles.bookingsList}>
            {filteredBookings.map((item) => {
              return (
                <View key={item.id} style={styles.bookingCard}>
                  <View style={styles.docHeaderRow}>
                    <Image
                      source={{ uri: item.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' }}
                      style={styles.docAvatar}
                    />
                    <View style={styles.docHeaderDetails}>
                      <Text style={styles.docName}>{item.doctorName}</Text>
                      <Text style={styles.docSpecialty}>{item.specialty}</Text>
                    </View>
                    <View style={styles.upcomingBadge}>
                      <Text style={styles.upcomingBadgeText}>{item.status}</Text>
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.detailGrid}>
                    <View style={styles.detailRow}>
                      <View style={styles.metaIconBox}>
                        <Ionicons name="calendar-outline" size={15} color="#003D9B" />
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>DATE</Text>
                        <Text style={styles.detailValue}>{item.date}</Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <View style={styles.metaIconBox}>
                        <Ionicons name="time-outline" size={15} color="#003D9B" />
                      </View>
                      <View>
                        <Text style={styles.detailLabel}>TIME</Text>
                        <Text style={styles.detailValue}>{item.time}</Text>
                      </View>
                    </View>

                    {item.location ? (
                      <View style={styles.detailRow}>
                        <View style={styles.metaIconBox}>
                          <Ionicons name="location-outline" size={15} color="#003D9B" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.detailLabel}>LOCATION</Text>
                          <Text style={styles.detailValue}>{item.location}</Text>
                        </View>
                      </View>
                    ) : null}

                    {item.format ? (
                      <View style={styles.detailRow}>
                        <View style={styles.metaIconBox}>
                          <Ionicons name="videocam-outline" size={15} color="#003D9B" />
                        </View>
                        <View>
                          <Text style={styles.detailLabel}>FORMAT</Text>
                          <Text style={styles.detailValue}>{item.format}</Text>
                        </View>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.actionsRowColumn}>
                    <TouchableOpacity
                      style={styles.viewDetailsBtn}
                      onPress={() => navigation.navigate('AppointmentDetail', { booking: item })}
                    >
                      <Text style={styles.viewDetailsBtnText}>View Details</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rescheduleBtn}
                      onPress={() => navigation.navigate('RescheduleAppointment', { booking: item })}
                    >
                      <Text style={styles.rescheduleBtnText}>Reschedule</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="calendar-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateTitle}>No {tab} appointments</Text>
            <Text style={styles.emptyStateSub}>Your {tab} appointment history will appear here.</Text>
          </View>
        )}

        {/* NEED ANOTHER APPOINTMENT BANNER */}
        <View style={styles.needApptCard}>
          <View style={styles.needIconCircle}>
            <Ionicons name="add-circle-outline" size={22} color="#003D9B" />
          </View>
          <Text style={styles.needTitle}>Need another appointment?</Text>
          <Text style={styles.needSub}>
            Easily schedule follow-ups or new consultations with our expert team.
          </Text>
          <TouchableOpacity
            style={styles.bookNewBtn}
            onPress={() => navigation.navigate('Book')}
          >
            <Text style={styles.bookNewBtnText}>Book New Appointment</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerBackBtn: {
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
  headerAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  headerAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  segmentBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBtnActive: {
    backgroundColor: '#003D9B',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  segmentTextActive: {
    color: '#ffffff',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  bookingsList: {
    gap: 16,
    marginBottom: 24,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  docHeaderDetails: {
    flex: 1,
  },
  docName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  docSpecialty: {
    fontSize: 12,
    color: '#64748b',
  },
  upcomingBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 14,
  },
  detailGrid: {
    gap: 12,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 1,
  },
  actionsRowColumn: {
    gap: 10,
  },
  viewDetailsBtn: {
    width: '100%',
    backgroundColor: '#003D9B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  rescheduleBtn: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  emptyStateSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  needApptCard: {
    backgroundColor: '#f0f6ff',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  needIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  needTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003D9B',
    marginBottom: 4,
  },
  needSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  bookNewBtn: {
    backgroundColor: '#ffffff',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  bookNewBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  heroGradientCard: {
    borderRadius: 24,
    padding: 22,
    marginBottom: 8,
    shadowColor: '#002663',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  heroCardBadgeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.8,
  },
  heroDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroDateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  heroTimeText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 4,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  doctorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    position: 'relative',
  },
  doctorCheckBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#046582',
  },
  doctorNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  doctorSpecialtyText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroBtnPrimary: {
    flex: 1,
    backgroundColor: '#ffffff',
    height: 44,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroBtnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003D9B',
  },
  heroBtnSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    height: 44,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBtnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
