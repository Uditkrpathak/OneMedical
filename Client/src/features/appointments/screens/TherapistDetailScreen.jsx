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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

export default function TherapistDetailScreen({ route, navigation }) {
  const doctor = route.params?.doctor || {
    name: 'Dr. Ananya Iyer',
    specialty: 'Senior Orthopedic Specialist',
    exp: '12+ Years Exp.',
    clinic: 'One Medical Hub',
    fee: 1500,
    rating: 4.9,
    reviewsCount: 124,
  };

  const [selectedSlot, setSelectedSlot] = useState('04:30 PM');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE BANNER */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: doctor.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800' }}
            style={styles.heroPhoto}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.backBtnFloating} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={20} color="#0f172a" />
          </TouchableOpacity>

          <View style={styles.heroOverlayBadges}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#38bdf8" style={{ marginRight: 4 }} />
              <Text style={styles.verifiedBadgeText}>VERIFIED SPECIALIST</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>★ {doctor.rating || 4.9} ({doctor.reviewsCount || 128} reviews)</Text>
            </View>
          </View>
        </View>

        {/* MAIN DOCTOR INFO HEADER */}
        <View style={styles.mainInfoCard}>
          <Text style={styles.docTitleName}>{doctor.name}</Text>
          <Text style={styles.docTitleSub}>{doctor.specialty || 'Sports Rehabilitation Specialist'} • {doctor.exp || '12+ Years Exp.'}</Text>
          
          <View style={styles.locationFeeRow}>
            <View style={styles.metaIconRow}>
              <Ionicons name="location-outline" size={15} color="#003D9B" style={{ marginRight: 4 }} />
              <Text style={styles.metaText}>{doctor.clinic || 'One Medical Hub'}</Text>
            </View>
            <View style={styles.metaIconRow}>
              <Ionicons name="cash-outline" size={15} color="#16a34a" style={{ marginRight: 4 }} />
              <Text style={styles.metaTextBold}>₹{doctor.fee || 1500} Fee</Text>
            </View>
          </View>
        </View>

        {/* 4 STAT METRIC CARDS (2x2) */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>12k+</Text>
            <Text style={styles.statLabel}>Patients</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Success</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Clinics</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>MPT</Text>
            <Text style={styles.statLabel}>Qualified</Text>
          </View>
        </View>

        {/* ABOUT SECTION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>About</Text>
          <Text style={styles.aboutBodyText}>
            "I believe in movement as medicine, focusing on holistic recovery and personalized protocols. My approach combines advanced clinical expertise with deep empathy to help patients regain their freedom of motion."
          </Text>
        </View>

        {/* SPECIALIZATIONS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Specializations</Text>
          <View style={styles.tagWrapRow}>
            {['Sports Injury', 'Back Pain', 'Manual Therapy', 'Post-Surgery Rehab', 'Neurological Physiotherapy'].map((tag) => (
              <View key={tag} style={styles.tagPill}>
                <Text style={styles.tagPillText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* EDUCATION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Education</Text>
          <View style={styles.eduRow}>
            <View style={styles.eduIconCircle}>
              <Ionicons name="school-outline" size={18} color="#003D9B" />
            </View>
            <View>
              <Text style={styles.eduDegreeText}>Masters in Physiotherapy (MPT)</Text>
              <Text style={styles.eduSchoolText}>Orthopedics, AIIMS Delhi</Text>
            </View>
          </View>
        </View>

        {/* LANGUAGES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Languages</Text>
          <View style={styles.langRow}>
            <Ionicons name="language-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
            <Text style={styles.langText}>English, Hindi, Kannada</Text>
          </View>
        </View>

        {/* CLINIC LOCATION */}
        <View style={styles.sectionCard}>
          <View style={styles.cardTitleActionRow}>
            <Text style={styles.sectionHeaderTitle}>Clinic Location</Text>
            <TouchableOpacity
              onPress={() => {
                const query = encodeURIComponent(doctor.clinic || 'One Medical Hub Indiranagar Bengaluru');
                Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => {});
              }}
            >
              <Text style={styles.linkActionText}>Get Directions</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.clinicNameBold}>One Medical Hub</Text>
          <Text style={styles.clinicAddrText}>
            4th Floor, Health Tower, Indiranagar, Bengaluru, 560038
          </Text>

          {/* Clinic Photo & Map Box */}
          <View style={styles.clinicPhotosRow}>
            <Image
              source={require('../../../../assets/images/clinic_location_1.png')}
              style={styles.clinicPhotoThumb}
            />
            <View style={styles.mapBoxPreview}>
              <Ionicons name="location" size={28} color="#003D9B" />
              <Text style={styles.mapBoxText}>Interactive Map</Text>
            </View>
          </View>
        </View>

        {/* NEXT AVAILABILITY */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Next Availability</Text>

          <Text style={styles.dayGroupLabel}>TODAY, 14 OCT</Text>
          <View style={styles.slotPillRow}>
            {['04:30 PM', '05:15 PM', '06:00 PM'].map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotPillBtn, selectedSlot === slot && styles.slotPillBtnActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotPillBtnText, selectedSlot === slot && styles.slotPillBtnTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.dayGroupLabel, { marginTop: 12 }]}>TOMORROW, 15 OCT</Text>
          <View style={styles.slotPillRow}>
            {['10:00 AM', '11:30 AM', '02:00 PM'].map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotPillBtn, selectedSlot === slot && styles.slotPillBtnActive]}
                onPress={() => setSelectedSlot(slot)}
              >
                <Text style={[styles.slotPillBtnText, selectedSlot === slot && styles.slotPillBtnTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PATIENT REVIEWS */}
        <View style={styles.sectionCard}>
          <View style={styles.cardTitleActionRow}>
            <Text style={styles.sectionHeaderTitle}>Patient Reviews</Text>
            <TouchableOpacity onPress={() => navigation.navigate('WriteDoctorReview', { doctor })}>
              <Text style={styles.reviewScoreHeader}>4.9 ★ (View All)</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.reviewItemCard}>
            <View style={styles.reviewerHeader}>
              <View style={styles.reviewerAvatar}>
                <Text style={styles.reviewerAvatarText}>AK</Text>
              </View>
              <View>
                <Text style={styles.reviewerName}>Ananya Kapoor</Text>
                <Text style={styles.reviewStars}>★★★★★</Text>
              </View>
            </View>
            <Text style={styles.reviewComment}>
              Dr. Ananya was exceptionally empathetic and knowledgeable. My lower back pain improved within 3 sessions!
            </Text>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#e6f0ff',
              borderColor: '#bae6fd',
              borderWidth: 1,
              paddingVertical: 10,
              borderRadius: 12,
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('WriteDoctorReview', { doctor })}
          >
            <Ionicons name="create-outline" size={16} color="#003D9B" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#003D9B' }}>Write a Review for Doctor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* STICKY CONTINUE CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SelectDateTime', { doctor })}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollInner: {
    paddingBottom: 90,
  },
  heroWrap: {
    width: '100%',
    height: 320,
    backgroundColor: '#0f172a',
    position: 'relative',
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  backBtnFloating: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroOverlayBadges: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  verifiedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  ratingBadge: {
    backgroundColor: '#38bdf8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  ratingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  mainInfoCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  docTitleName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  docTitleSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  locationFeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 10,
  },
  metaIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#64748b',
  },
  metaTextBold: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16a34a',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 10,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#003D9B',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#003D9B',
    marginBottom: 8,
  },
  aboutBodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    fontStyle: 'italic',
  },
  tagWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagPill: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  eduRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eduIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eduDegreeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  eduSchoolText: {
    fontSize: 12,
    color: '#64748b',
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    fontSize: 13,
    color: '#334155',
  },
  cardTitleActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linkActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  clinicNameBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  clinicAddrText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  clinicPhotosRow: {
    flexDirection: 'row',
    gap: 10,
  },
  clinicPhotoThumb: {
    flex: 1,
    height: 90,
    borderRadius: 12,
  },
  mapBoxPreview: {
    flex: 1,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  mapBoxText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003D9B',
    marginTop: 4,
  },
  dayGroupLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  slotPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotPillBtn: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotPillBtnActive: {
    backgroundColor: '#003D9B',
  },
  slotPillBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  slotPillBtnTextActive: {
    color: '#ffffff',
  },
  reviewScoreHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003D9B',
  },
  reviewItemCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  reviewerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  reviewerAvatarText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#334155',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  reviewStars: {
    fontSize: 11,
    color: '#eab308',
  },
  reviewComment: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
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
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
