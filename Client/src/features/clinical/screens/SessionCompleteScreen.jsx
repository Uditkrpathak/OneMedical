import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import clinicalApi from '../api';

const { width } = Dimensions.get('window');

export default function SessionCompleteScreen({ route, navigation }) {
  const { token } = useSelector((state) => state.auth);
  const [loggedScores, setLoggedScores] = React.useState(null);

  useEffect(() => {
    const postLog = async () => {
      try {
        const painLevel = route.params?.painLevel !== undefined ? route.params.painLevel : 2;
        const exercisesCompleted = route.params?.exercisesCompleted || 3;
        
        const res = await clinicalApi.logSession(
          {
            date: new Date().toISOString(),
            painLevel,
            exercisesCompleted,
            completedOffline: false,
          },
          token
        );

        if (res?.data?.scores) {
          setLoggedScores(res.data.scores);
        }
      } catch (err) {
        console.warn('Session logging error:', err);
      }
    };
    if (token) postLog();
  }, [token, route.params]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.navigate('RecoveryMain')}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Complete!</Text>
        <View style={styles.headerAvatarCircle}>
          <Ionicons name="person" size={16} color="#ffffff" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* CELEBRATORY SUCCESS BADGE */}
        <View style={styles.successOuter}>
          <View style={styles.successInner}>
            <Ionicons name="checkmark" size={40} color="#ffffff" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Text style={styles.titleText}>Session Complete!</Text>
          <Ionicons name="sparkles" size={22} color="#0284c7" />
        </View>
        <Text style={styles.subText}>
          {"Amazing work! You've completed today's recovery session."}
        </Text>

        {/* 4 STAT METRICS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>EXERCISES</Text>
            <Text style={styles.statVal}>5 of 5</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>DURATION</Text>
            <Text style={styles.statVal}>22 Minutes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>STREAK</Text>
            <Text style={styles.statVal}>8 Days</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RECOVERY</Text>
            <Text style={styles.statVal}>{loggedScores?.recoveryScore || 78}% <Text style={{ fontSize: 10, color: '#16a34a' }}>(+2% today)</Text></Text>
          </View>
        </View>

        {/* NEW ACHIEVEMENTS UNLOCKED */}
        <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>NEW ACHIEVEMENTS</Text>
        <View style={styles.achieveRow}>
          <View style={styles.achieveBadge}>
            <Ionicons name="flame" size={22} color="#d97706" style={{ marginBottom: 4 }} />
            <Text style={styles.badgeText}>8-Day Streak</Text>
          </View>
          <View style={styles.achieveBadge}>
            <Ionicons name="body" size={22} color="#0284c7" style={{ marginBottom: 4 }} />
            <Text style={styles.badgeText}>Flex Master</Text>
          </View>
          <View style={styles.achieveBadge}>
            <Ionicons name="shield-checkmark" size={22} color="#16a34a" style={{ marginBottom: 4 }} />
            <Text style={styles.badgeText}>Consistent</Text>
          </View>
        </View>

        {/* NOTE FROM THERAPIST */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeaderRow}>
            <Ionicons name="chatbox-outline" size={16} color="#0284c7" style={{ marginRight: 6 }} />
            <Text style={styles.noteHeaderTitle}>Note from Therapist</Text>
          </View>
          <Text style={styles.noteBodyText}>
            {' "Excellent work today! Remember to stay hydrated and perform light stretches later this evening."'}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('RecoveryMain')}
        >
          <Text style={styles.primaryBtnText}>Back to Recovery Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryLinkBtn}
          onPress={() => navigation.navigate('RecoveryProgressAnalytics')}
        >
          <Text style={styles.secondaryLinkText}>View Recovery Progress</Text>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    alignSelf: 'flex-start',
  },
  achieveRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 20,
  },
  achieveBadge: {
    flex: 1,
    backgroundColor: '#e6f0ff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  badgeEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#003D9B',
  },
  noteCard: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  noteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  noteHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003D9B',
  },
  noteBodyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  secondaryLinkBtn: {
    paddingVertical: 8,
  },
  secondaryLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#003D9B',
  },
});
