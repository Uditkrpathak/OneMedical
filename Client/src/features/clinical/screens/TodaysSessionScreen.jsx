import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const EXERCISES_LIST = [
  { id: 1, name: 'Pelvic Tilt', meta: '12 Reps × 2 Sets', duration: '5 Mins', unlocked: true },
  { id: 2, name: 'Cat-Cow Stretch', meta: '10 Reps × 2 Sets', duration: '5 Mins', unlocked: false },
  { id: 3, name: 'Bird Dog', meta: '10 Reps × 2 Sets', duration: '5 Mins', unlocked: false },
  { id: 4, name: 'Bridge', meta: '12 Reps × 2 Sets', duration: '5 Mins', unlocked: false },
  { id: 5, name: "Child's Pose", meta: 'Hold for 2 Mins', duration: '2 Mins', unlocked: false },
];

export default function TodaysSessionScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{"Today's Session"}</Text>
        <TouchableOpacity style={styles.headerBackBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* HERO IMAGE BANNER */}
        <View style={styles.heroImageWrap}>
          <Image
            source={require('../../../../assets/images/Onboarding.jpg')}
            style={styles.heroPhoto}
          />
          <View style={styles.heroOverlayContent}>
            <Text style={styles.heroTitle}>Lower Back Recovery</Text>
            <View style={styles.heroMetaRow}>
              <View style={styles.heroMetaPill}><Text style={styles.heroMetaPillText}>20 Mins</Text></View>
              <View style={styles.heroMetaPill}><Text style={styles.heroMetaPillText}>5 Exercises</Text></View>
              <View style={styles.heroMetaPill}><Text style={styles.heroMetaPillText}>Beginner</Text></View>
            </View>
          </View>
        </View>

        {/* THE GOAL & EQUIPMENT */}
        <View style={styles.goalCard}>
          <Text style={styles.sectionHeaderTitle}>The Goal</Text>
          <Text style={styles.goalBodyText}>
            Improve flexibility and reduce lower back pain through controlled mobility and core stability movements.
          </Text>

          <Text style={[styles.sectionHeaderTitle, { fontSize: 13, marginTop: 12, marginBottom: 8 }]}>REQUIRED EQUIPMENT</Text>
          <View style={styles.equipmentRow}>
            <View style={styles.equipItem}>
              <Ionicons name="fitness-outline" size={18} color="#003D9B" />
              <Text style={styles.equipText}>Band</Text>
            </View>
            <View style={styles.equipItem}>
              <Ionicons name="body-outline" size={18} color="#003D9B" />
              <Text style={styles.equipText}>Mat</Text>
            </View>
            <View style={styles.equipItem}>
              <Ionicons name="water-outline" size={18} color="#003D9B" />
              <Text style={styles.equipText}>Water</Text>
            </View>
          </View>
        </View>

        {/* EXERCISES LIST */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Exercises</Text>
          <Text style={styles.countText}>1/5 Complete</Text>
        </View>

        <View style={styles.exerciseList}>
          {EXERCISES_LIST.map((item) => (
            <TouchableOpacity
              key={item.id}
              disabled={!item.unlocked}
              style={[styles.exCard, !item.unlocked && styles.exCardLocked]}
              onPress={() => navigation.navigate('ExerciseDetail', { exercise: item })}
            >
              <View style={[styles.exIconCircle, !item.unlocked && styles.exIconCircleLocked]}>
                <Ionicons
                  name={item.unlocked ? 'play' : 'lock-closed'}
                  size={16}
                  color={item.unlocked ? '#003D9B' : '#94a3b8'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.exName, !item.unlocked && styles.exNameLocked]}>{item.name}</Text>
                <Text style={styles.exMeta}>{item.meta} • {item.duration}</Text>
              </View>
              {item.unlocked && <Ionicons name="chevron-forward" size={18} color="#94a3b8" />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* STICKY START SESSION CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.startBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ExerciseDetail', { exercise: EXERCISES_LIST[0] })}
        >
          <Text style={styles.startBtnText}>Start Session</Text>
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
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  heroImageWrap: {
    width: '100%',
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  heroPhoto: {
    width: '100%',
    height: '100%',
  },
  heroOverlayContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    padding: 14,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  heroMetaRow: {
    flexDirection: 'row',
    gap: 6,
  },
  heroMetaPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  heroMetaPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  goalBodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  equipmentRow: {
    flexDirection: 'row',
    gap: 16,
  },
  equipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  equipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
    marginLeft: 6,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  exerciseList: {
    gap: 10,
    marginBottom: 20,
  },
  exCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exCardLocked: {
    backgroundColor: '#f8fafc',
    borderColor: '#f1f5f9',
  },
  exIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exIconCircleLocked: {
    backgroundColor: '#f1f5f9',
  },
  exName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  exNameLocked: {
    color: '#94a3b8',
  },
  exMeta: {
    fontSize: 11,
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
  startBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
