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

export default function ExerciseProgressScreen({ route, navigation }) {
  const exercise = route.params?.exercise || { name: 'Pelvic Tilt' };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Progress</Text>
        <View style={styles.headerAvatarCircle}>
          <Ionicons name="person" size={16} color="#ffffff" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* CHECKMARK ICON */}
        <View style={styles.successOuter}>
          <View style={styles.successInner}>
            <Ionicons name="checkmark" size={32} color="#ffffff" />
          </View>
        </View>

        <Text style={styles.greatJobTitle}>Great Job! 🎉</Text>
        <Text style={styles.subText}>You completed {exercise.name} successfully.</Text>

        {/* 20% SESSION PROGRESS CIRCLE */}
        <View style={styles.progressCircleOuter}>
          <View style={styles.progressCircleInner}>
            <Text style={styles.progressPercentText}>20%</Text>
            <Text style={styles.progressLabelText}>Session Complete</Text>
          </View>
        </View>

        {/* REMAINING STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>4</Text>
            <Text style={styles.statLab}>Exercises Remaining</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>16</Text>
            <Text style={styles.statLab}>Minutes Left</Text>
          </View>
        </View>

        <Text style={styles.quoteText}>"You're getting stronger every session."</Text>

        {/* NEXT UP CARD */}
        <View style={styles.nextUpCard}>
          <Text style={styles.nextUpLabel}>NEXT UP</Text>
          <View style={styles.nextUpContentRow}>
            <View style={styles.nextUpIconCircle}>
              <Ionicons name="fitness" size={18} color="#0284c7" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nextUpTitle}>Cat-Cow Stretch</Text>
              <Text style={styles.nextUpSub}>5 Minutes • 10 Reps × 2</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* STICKY ACTION BUTTONS */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SessionComplete')}
        >
          <Text style={styles.continueBtnText}>Continue to Next Exercise ➔</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.breakBtn}
          onPress={() => navigation.navigate('SessionComplete')}
        >
          <Text style={styles.breakBtnText}>Take a Short Break (30s)</Text>
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
  headerAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 110,
    alignItems: 'center',
  },
  successOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greatJobTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20,
  },
  progressCircleOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressCircleInner: {
    alignItems: 'center',
  },
  progressPercentText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  progressLabelText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0284c7',
  },
  statLab: {
    fontSize: 11,
    color: '#64748b',
  },
  quoteText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#0284c7',
    marginBottom: 24,
  },
  nextUpCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  nextUpLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nextUpContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextUpIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  nextUpTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  nextUpSub: {
    fontSize: 11,
    color: '#64748b',
  },
  bottomCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  continueBtn: {
    backgroundColor: '#0284c7',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  breakBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
});
