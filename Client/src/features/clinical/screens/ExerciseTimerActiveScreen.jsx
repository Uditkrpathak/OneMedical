import React, { useState } from 'react';
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

export default function ExerciseTimerActiveScreen({ route, navigation }) {
  const exercise = route.params?.exercise || { name: 'Pelvic Tilt' };
  const [repCount, setRepCount] = useState(6);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [coachMessage, setCoachMessage] = useState('Keep your core engaged & breathe normally.');
  const totalReps = 12;

  const handleMarkRep = () => {
    const nextRep = repCount + 1;
    if (nextRep <= totalReps) {
      setRepCount(nextRep);
      if (nextRep === Math.floor(totalReps / 2)) {
        setCoachMessage('Halfway done! Excellent form, hold for 3 seconds.');
      } else if (nextRep === totalReps - 1) {
        setCoachMessage('One last rep! Finish strong.');
      } else {
        setCoachMessage(`Rep ${nextRep} completed! Inhale slowly.`);
      }
    } else {
      navigation.navigate('ExerciseProgress', { exercise });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EXERCISE 1 OF 5</Text>
        <TouchableOpacity
          style={[styles.headerBackBtn, isVoiceEnabled && { backgroundColor: '#e6f0ff' }]}
          onPress={() => setIsVoiceEnabled(!isVoiceEnabled)}
        >
          <Ionicons
            name={isVoiceEnabled ? "volume-high" : "volume-mute"}
            size={20}
            color={isVoiceEnabled ? "#003D9B" : "#94a3b8"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* ACTIVE DEMO VIDEO BOX */}
        <View style={styles.videoWrap}>
          <Image
            source={require('../../../../assets/images/Onboarding.jpg')}
            style={styles.videoPhoto}
          />
          {isVoiceEnabled && (
            <View style={styles.audioCoachBadge}>
              <Ionicons name="mic-outline" size={14} color="#ffffff" style={{ marginRight: 4 }} />
              <Text style={styles.audioCoachBadgeText}>Voice Coach Active</Text>
            </View>
          )}
        </View>

        <Text style={styles.exTitle}>{exercise.name}</Text>
        <Text style={styles.exTargetSub}>LOWER BACK RECOVERY</Text>

        {/* CIRCULAR REP COUNTER GAUGE */}
        <View style={styles.counterCircleOuter}>
          <View style={styles.counterCircleInner}>
            <Text style={styles.countText}>{repCount} / {totalReps}</Text>
            <Text style={styles.countLabelText}>REPS</Text>
          </View>
        </View>

        {/* VOICE COACH PROMPT CARD */}
        <View style={styles.coachCard}>
          <Ionicons name="sparkles" size={18} color="#003D9B" style={{ marginRight: 8 }} />
          <Text style={styles.cueText}>"{coachMessage}"</Text>
        </View>
      </ScrollView>

      {/* STICKY MARK REP COMPLETE CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.markRepBtn}
          activeOpacity={0.88}
          onPress={handleMarkRep}
        >
          <Text style={styles.markRepBtnText}>
            {repCount < totalReps ? `MARK REP ${repCount + 1} COMPLETE` : 'FINISH EXERCISE ➔'}
          </Text>
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
    paddingVertical: 14,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1,
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 95,
    alignItems: 'center',
  },
  videoWrap: {
    width: '100%',
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  videoPhoto: {
    width: '100%',
    height: '100%',
  },
  audioCoachBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 61, 155, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  audioCoachBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  exTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  exTargetSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 24,
  },
  counterCircleOuter: {
    width: 144,
    height: 144,
    borderRadius: 72,
    borderWidth: 8,
    borderColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f4ff',
  },
  counterCircleInner: {
    alignItems: 'center',
  },
  countText: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
  },
  countLabelText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748b',
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  cueText: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#003D9B',
    flex: 1,
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
  markRepBtn: {
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
  markRepBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
});
