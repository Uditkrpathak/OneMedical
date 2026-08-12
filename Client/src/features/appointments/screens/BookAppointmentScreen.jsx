import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Ionicons from '@expo/vector-icons/Ionicons';
import appointmentApi from '../api';
import EmptyState from '../../../shared/components/EmptyState';
import { colors } from '../../../theme/colors';

const { width } = Dimensions.get('window');

const POPULAR_SERVICES = [
  { id: 'back_pain', name: 'Back Pain', desc: 'Relief from chronic or acute spine issues.', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80' },
  { id: 'neck_pain', name: 'Neck Pain', desc: 'Correct posture and cervical discomfort.', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80' },
  { id: 'sports_injury', name: 'Sports Injury', desc: 'Targeted recovery for athletes and active users.', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80' },
  { id: 'post_surgery', name: 'Post-Surgery', desc: 'Guided rehabilitation programs post-operation.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80' },
  { id: 'knee_pain', name: 'Knee Pain', desc: 'Joint mobility and strengthening exercises.', image: 'https://plus.unsplash.com/premium_photo-1664910605048-44c8450c0356?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'home_visit', name: 'Home Visit', desc: 'Personalized care delivered at your residence.', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80' },
];

export default function BookAppointmentScreen({ navigation }) {
  const { token } = useSelector((state) => state.auth);

  // Flow Step State: 1 = Services/Categories, 2 = Place Selection, 3 = Doctor List, 4 = Time Slot Booking
  const [step, setStep] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [appointmentPlace, setAppointmentPlace] = useState('online'); // 'online' | 'home'
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});

  const [selectedFilter, setSelectedFilter] = useState('nearby');
  const [activeFilters, setActiveFilters] = useState({
    keyword: '',
    specializations: [],
    consultMode: 'all',
    feeRange: 'all',
    minRating: 'any',
    minExp: 'any',
    gender: 'any',
    availableToday: false,
  });
  const [therapists, setTherapists] = useState([]);
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const toggleFavorite = (docId) => {
    setFavorites(prev => ({ ...prev, [docId]: !prev[docId] }));
  };

  const filteredTherapists = therapists.filter((doc) => {
    const name = doc.name || doc.user?.name || '';
    const spec = doc.specialty || doc.specialization || '';
    const loc = doc.clinic || doc.clinicLocation || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedFilter === 'top_rated') return (doc.rating || 4.8) >= 4.9;
    return true;
  });
  const [selectedDate, setSelectedDate] = useState('2026-08-10');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const res = await appointmentApi.getTherapists(token);
        if (res.success && res.data) {
          setTherapists(res.data);
        }
      } catch (err) {
        console.warn('[BookAppointment] Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, [token]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!selectedTherapist) return;
      setSlots([]);
      setSelectedSlot(null);
      try {
        const res = await appointmentApi.getAvailability(selectedTherapist.userId || selectedTherapist._id, selectedDate, token);
        if (res.success && res.data) {
          setSlots(res.data);
        }
      } catch (err) {
        console.warn('[Availability] Fetch error:', err.message);
      }
    };
    fetchAvailability();
  }, [selectedTherapist, selectedDate, token]);

  const handleCategorySelect = (item) => {
    setSelectedCategory(item);
    if (item.id === 'home_visit') {
      setAppointmentPlace('home');
    } else if (item.id === 'online_consult') {
      setAppointmentPlace('online');
    }
    setStep(2);
  };

  const handlePlaceSelectAndContinue = () => {
    setStep(3);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedTherapist(doctor);
    setStep(4);
  };

  const handleBookSlot = async () => {
    if (!selectedTherapist || !selectedSlot) {
      Alert.alert('Selection Required', 'Please select an available time slot.');
      return;
    }

    setBooking(true);
    try {
      const res = await appointmentApi.bookAppointment(
        {
          therapistId: selectedTherapist.userId || selectedTherapist._id,
          date: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          serviceType: selectedCategory ? selectedCategory.name : 'Physiotherapy Session',
          consultMode: appointmentPlace,
        },
        token
      );

      setBooking(false);
      if (res.success) {
        navigation.navigate('PaymentMock', { appointment: res.data.appointment });
      } else {
        Alert.alert('Booking Error', res.error?.message || 'Failed to reserve slot');
      }
    } catch (err) {
      setBooking(false);
      Alert.alert('Booking Error', err.message || 'Booking failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER BAR */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => {
            if (step > 1) setStep(step - 1);
            else navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {step === 1 && 'Book Appointment'}
          {step === 2 && 'Book Appointment'}
          {step === 3 && 'Choose Physiotherapist'}
          {step === 4 && 'Select Time Slot'}
        </Text>

        <View style={styles.headerAvatarCircle}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }}
            style={styles.headerAvatarImg}
          />
        </View>
      </View>

      {/* STEP 1: POPULAR SERVICES & CATEGORIES */}
      {step === 1 && (
        <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
          {/* Search Input */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services or conditions"
              placeholderTextColor="#94a3b8"
            />
          </View>

          {/* RECENTLY BOOKED DOCTORS */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>RECENTLY BOOKED</Text>
            <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentHorizontalList}>
            {/* Recently Booked 1 */}
            <TouchableOpacity style={styles.recentCard} onPress={() => setStep(3)}>
              <View style={styles.recentAvatarWrap}>
                <Image source={require('../../../../assets/images/therapist_male_1.png')} style={styles.recentAvatar} />
                <View style={styles.recentBadgeIcon}>
                  <Ionicons name="time-outline" size={12} color="#ffffff" />
                </View>
              </View>
              <View>
                <Text style={styles.recentDocName}>Dr. Arjun Mehta</Text>
                <Text style={styles.recentDocSub}>Spinal Specialist</Text>
                <Text style={styles.recentDocTime}>2 WEEKS AGO</Text>
              </View>
            </TouchableOpacity>

            {/* Recently Booked 2 */}
            <TouchableOpacity style={styles.recentCard} onPress={() => setStep(3)}>
              <View style={styles.recentAvatarWrap}>
                <Image source={require('../../../../assets/images/therapist_female_1.png')} style={styles.recentAvatar} />
              </View>
              <View>
                <Text style={styles.recentDocName}>Dr. Sarah Iyer</Text>
                <Text style={styles.recentDocSub}>Sports Specialist</Text>
                <Text style={styles.recentDocTime}>1 MONTH AGO</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* POPULAR SERVICES GRID */}
          <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 14, color: '#003D9B', fontSize: 13, letterSpacing: 1.2, fontWeight: '800' }]}>
            POPULAR SERVICES
          </Text>

          <View style={styles.servicesGrid}>
            {POPULAR_SERVICES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.serviceCard}
                activeOpacity={0.85}
                onPress={() => handleCategorySelect(item)}
              >
                <View style={styles.serviceImageWrap}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.servicePhoto}
                  />
                </View>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceDesc}>{item.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* STEP 2: SELECT APPOINTMENT PLACE */}
      {step === 2 && (
        <View style={styles.stepContainer}>
          <ScrollView contentContainerStyle={styles.scrollInner}>
            <Text style={styles.stepSectionHeader}>SELECT APPOINTMENT PLACE</Text>

            <View style={styles.placeOptionsRow}>
              {/* Card 1: Online Consult */}
              <TouchableOpacity
                style={[styles.placeCard, appointmentPlace === 'online' && styles.placeCardSelected]}
                activeOpacity={0.85}
                onPress={() => setAppointmentPlace('online')}
              >
                <View style={styles.placeImageWrap}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80' }}
                    style={styles.placePhoto}
                  />
                </View>
                <Text style={styles.placeTitle}>Online Consult</Text>
                <Text style={styles.placeSub}>Speak to an expert</Text>
              </TouchableOpacity>

              {/* Card 2: Home Visit */}
              <TouchableOpacity
                style={[styles.placeCard, appointmentPlace === 'home' && styles.placeCardSelected]}
                activeOpacity={0.85}
                onPress={() => setAppointmentPlace('home')}
              >
                <View style={styles.placeIconImageWrap}>
                  <Ionicons name="home" size={42} color="#003D9B" />
                </View>
                <Text style={styles.placeTitle}>Home Visit</Text>
                <Text style={styles.placeSub}>Personalized care delivered at your residence.</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Sticky Continue CTA */}
          <View style={styles.bottomCtaContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={handlePlaceSelectAndContinue}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: CHOOSE PHYSIOTHERAPIST LIST */}
      {step === 3 && (
        <View style={styles.stepContainer}>
          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
            {/* Search Input Row with Filter Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <View style={[styles.searchBar, { flex: 1, marginBottom: 0 }]}>
                <Ionicons name="search" size={18} color="#64748b" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search physiotherapists"
                  placeholderTextColor="#94a3b8"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {!!searchQuery && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={18} color="#94a3b8" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#f1f5f9',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
                onPress={() =>
                  navigation.navigate('SearchFilter', {
                    filters: activeFilters,
                    onApply: (updated) => setActiveFilters(updated),
                  })
                }
              >
                <Ionicons name="options-outline" size={20} color="#0284c7" />
                {Object.values(activeFilters).some((val) =>
                  Array.isArray(val) ? val.length > 0 : Boolean(val && val !== 'all' && val !== 'any')
                ) && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#0284c7',
                      }}
                    />
                  )}
              </TouchableOpacity>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterPillsRow}>
              <TouchableOpacity
                style={[styles.filterPill, selectedFilter === 'nearby' && styles.filterPillActive]}
                onPress={() => setSelectedFilter('nearby')}
              >
                <Text style={[styles.filterPillText, selectedFilter === 'nearby' && styles.filterPillTextActive]}>
                  Nearby
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPill, selectedFilter === 'top_rated' && styles.filterPillActive]}
                onPress={() => setSelectedFilter('top_rated')}
              >
                <Text style={[styles.filterPillText, selectedFilter === 'top_rated' && styles.filterPillTextActive]}>
                  Top Rated
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.filterPill, selectedFilter === 'available_today' && styles.filterPillActive]}
                onPress={() => setSelectedFilter('available_today')}
              >
                <Text style={[styles.filterPillText, selectedFilter === 'available_today' && styles.filterPillTextActive]}>
                  Available Today
                </Text>
              </TouchableOpacity>
            </View>

            {/* Physiotherapists List */}
            {loading ? (
              <ActivityIndicator size="large" color="#0284c7" style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.doctorListContainer}>
                {[
                  {
                    id: 'usr_ther1',
                    name: 'Dr. Anuj Mehta',
                    specialty: 'Sports Rehabilitation Specialist',
                    rating: 4.9,
                    reviewsCount: 128,
                    exp: '12+ Years Exp.',
                    clinic: 'One Medical Hub',
                    distance: '2.4 km',
                    fee: 1500,
                    languages: ['ENGLISH', 'HINDI', 'GUJARATI'],
                    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
                  },
                  {
                    id: 'usr_ther2',
                    name: 'Dr. Sarah Iyer',
                    specialty: 'Orthopedic & Spine Expert',
                    rating: 5.0,
                    reviewsCount: 69,
                    exp: '8+ Years Exp.',
                    clinic: 'City Wellness Plaza',
                    distance: '3.1 km',
                    fee: 1200,
                    languages: ['ENGLISH', 'HINDI'],
                    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                  },
                ]
                  .filter(d => {
                    const match = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      d.clinic.toLowerCase().includes(searchQuery.toLowerCase());
                    if (!match) return false;
                    if (selectedFilter === 'top_rated') return d.rating >= 5.0;
                    return true;
                  })
                  .map((doctor) => {
                    const isFav = !!favorites[doctor.id];
                    return (
                      <View key={doctor.id} style={styles.doctorListCard}>
                        <View style={styles.docRowHeader}>
                          <Image source={{ uri: doctor.avatarUrl }} style={styles.docListAvatar} />
                          <View style={styles.docListMainInfo}>
                            <View style={styles.docNameFavRow}>
                              <Text style={styles.docListName}>{doctor.name}</Text>
                              <TouchableOpacity onPress={() => toggleFavorite(doctor.id)}>
                                <Ionicons
                                  name={isFav ? 'heart' : 'heart-outline'}
                                  size={22}
                                  color={isFav ? '#ef4444' : '#94a3b8'}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.docListSpecialty}>{doctor.specialty}</Text>
                            <Text style={styles.docListRatingExp}>★ {doctor.rating} ({doctor.reviewsCount} reviews) • {doctor.exp}</Text>
                            <Text style={styles.docListLocation}>📍 {doctor.clinic} • {doctor.distance}</Text>
                          </View>
                        </View>

                        <View style={styles.docBadgesRow}>
                          <View style={styles.badgeGreen}><Text style={styles.badgeGreenText}>AVAILABLE TODAY</Text></View>
                          <View style={styles.badgeGray}><Text style={styles.badgeGrayText}>{doctor.languages.join(', ')}</Text></View>
                        </View>

                        <View style={styles.docFooterRow}>
                          <View>
                            <Text style={styles.feeLabelText}>CONSULTATION FEE</Text>
                            <Text style={styles.feeAmountText}>₹{doctor.fee.toLocaleString()}</Text>
                          </View>
                          <TouchableOpacity
                            style={styles.docViewProfileBtn}
                            onPress={() => navigation.navigate('TherapistDetail', { doctor })}
                          >
                            <Text style={styles.docViewProfileBtnText}>View Profile</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* STEP 4: DATE & TIME SLOT BOOKING */}
      {step === 4 && (
        <View style={styles.stepContainer}>
          <ScrollView contentContainerStyle={styles.scrollInner}>
            <Text style={styles.stepSectionHeader}>RESERVE YOUR TIME SLOT</Text>

            <View style={styles.selectedDocHeaderCard}>
              <Text style={styles.docListName}>{selectedTherapist?.name || 'Selected Specialist'}</Text>
              <Text style={styles.docListSpecialty}>Physiotherapist</Text>
            </View>

            {/* Date Selector */}
            <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 10 }]}>Select Date</Text>
            <View style={styles.dateSelectorRow}>
              {['2026-08-10', '2026-08-11', '2026-08-12'].map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateBtn, selectedDate === d && styles.dateBtnActive]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text style={[styles.dateBtnText, selectedDate === d && styles.dateBtnTextActive]}>
                    {d.split('-').slice(1).join('/')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Slots Grid */}
            <Text style={[styles.sectionTitle, { marginTop: 16, marginBottom: 10 }]}>Available Slots</Text>

            <View style={styles.slotsGrid}>
              {[
                { startTime: '09:00', endTime: '09:30', isAvailable: true },
                { startTime: '10:00', endTime: '10:30', isAvailable: true },
                { startTime: '11:00', endTime: '11:30', isAvailable: false },
                { startTime: '14:00', endTime: '14:30', isAvailable: true },
                { startTime: '15:30', endTime: '16:00', isAvailable: true },
              ].map((slot, idx) => {
                const isSelected = selectedSlot?.startTime === slot.startTime;
                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={!slot.isAvailable}
                    style={[
                      styles.slotItem,
                      !slot.isAvailable && styles.slotDisabled,
                      isSelected && styles.slotSelected,
                    ]}
                    onPress={() => setSelectedSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.slotText,
                        !slot.isAvailable && styles.slotTextDisabled,
                        isSelected && styles.slotTextSelected,
                      ]}
                    >
                      {slot.startTime}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Sticky Book CTA */}
          <View style={styles.bottomCtaContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, (!selectedSlot || booking) && styles.disabledButton]}
              activeOpacity={0.85}
              onPress={handleBookSlot}
              disabled={!selectedSlot || booking}
            >
              {booking ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Confirm & Proceed to Pay</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  headerAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepContainer: {
    flex: 1,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 80,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003D9B',
    letterSpacing: 1.1,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
  recentHorizontalList: {
    gap: 12,
    marginBottom: 16,
  },
  recentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    width: 190,
  },
  recentAvatarWrap: {
    position: 'relative',
    marginRight: 10,
  },
  recentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  recentBadgeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentDocName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  recentDocSub: {
    fontSize: 11,
    color: '#64748b',
  },
  recentDocTime: {
    fontSize: 9,
    fontWeight: '800',
    color: '#003D9B',
    marginTop: 2,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  serviceImageWrap: {
    width: '100%',
    height: 140,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: '#f1f5f9',
  },
  servicePhoto: {
    width: '100%',
    height: '100%',
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
  stepSectionHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003D9B',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 20,
  },
  placeOptionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  placeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  placeCardSelected: {
    borderColor: '#003D9B',
  },
  placeImageWrap: {
    width: '100%',
    height: 140,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f1f5f9',
  },
  placePhoto: {
    width: '100%',
    height: '100%',
  },
  placeIconImageWrap: {
    width: '100%',
    height: 140,
    borderRadius: 22,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  placeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  placeSub: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    paddingHorizontal: 4,
  },
  headerAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bottomCtaContainer: {
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
  primaryButton: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  doctorListContainer: {
    gap: 16,
  },
  doctorListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  docRowHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  docListAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 12,
  },
  docListMainInfo: {
    flex: 1,
  },
  docNameFavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  docListName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  docListSpecialty: {
    fontSize: 12,
    color: '#64748b',
  },
  docListRatingExp: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003D9B',
    marginTop: 2,
  },
  docListLocation: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  docBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  badgeGreen: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGreenText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
  },
  badgeGray: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGrayText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
  },
  docFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  feeLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
  },
  feeAmountText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  docViewProfileBtn: {
    backgroundColor: '#003D9B',
    paddingHorizontal: 18,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docViewProfileBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  selectedDocHeaderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dateBtnActive: {
    backgroundColor: '#003D9B',
    borderColor: '#003D9B',
  },
  dateBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  dateBtnTextActive: {
    color: '#ffffff',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slotItem: {
    width: '30%',
    height: 44,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#f1f5f9',
    opacity: 0.6,
  },
  slotSelected: {
    backgroundColor: '#dbeafe',
    borderColor: '#003D9B',
    borderWidth: 2,
  },
  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  slotTextDisabled: {
    color: '#94a3b8',
  },
  slotTextSelected: {
    color: '#003D9B',
    fontWeight: '800',
  },
  slotTextSelected: {
    color: '#ffffff',
  },
});
