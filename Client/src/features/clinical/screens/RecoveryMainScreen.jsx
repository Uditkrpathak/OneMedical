import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import clinicalApi from '../api';

const { width } = Dimensions.get('window');

export default function RecoveryMainScreen({ navigation }) {
  const { user, token } = useSelector((state) => state.auth);
  const [activeProgram, setActiveProgram] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgram = async () => {
      setLoading(true);
      try {
        const res = await clinicalApi.getActiveProgram(token);
        if (res.success && res.data) {
          setActiveProgram(res.data);
        }
      } catch (err) {
        console.warn('Error fetching active program:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [token]);

  const recoveryScore = activeProgram?.recoveryScore || 72;
  const programName = activeProgram?.name || activeProgram?.programId?.name || 'Lower Back Rehabilitation';
  const therapistName = activeProgram?.therapistName || 'Dr. Ananya Iyer';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 17) return 'Good Afternoon';
    if (hour >= 17 && hour < 22) return 'Good Evening';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* HEADER BAR */}
        <View style={styles.headerRow}>
          <View style={styles.userProfileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitial}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
            <View>
              <Text style={styles.greetingText}>
                {getGreeting()}, {user?.name || 'Sagar'}
              </Text>
              <Text style={styles.subGreetingText}>{"Let's continue today's recovery."}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationBtn}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#0f172a" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* RECOVERY HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <Ionicons name="trending-up" size={14} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.heroBadgeText}>+6% Improvement this week</Text>
          </View>

          <Text style={styles.heroTitle}>Week 4 of Recovery</Text>
          <Text style={styles.heroSubText}>
            {"Keep going! You're making steady progress toward your full strength."}
          </Text>

          {/* CIRCULAR GAUGE */}
          <View style={styles.circleGaugeOuter}>
            <View style={styles.circleGaugeInner}>
              <Text style={styles.gaugeNumberText}>{recoveryScore}%</Text>
              <Text style={styles.gaugeLabelText}>OVERALL</Text>
            </View>
          </View>
        </View>

        {/* TODAY'S SESSION CARD */}
        <Text style={styles.sectionTitle}>{"Today's Session"}</Text>
        <View style={styles.sessionCard}>
          <View style={styles.sessionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sessionTitle}>Movement Foundation</Text>
              <Text style={styles.sessionMetaText}>5 Exercises • ⏱ 20 Minutes • Beginner</Text>
            </View>
            <View style={styles.sessionBadge}>
              <Text style={styles.sessionBadgeText}>READY</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.startSessionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('TodaysSession')}
          >
            <Ionicons name="play" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={styles.startSessionBtnText}>Start Session</Text>
          </TouchableOpacity>
        </View>

        {/* CURRENT PROGRAM CARD */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Current Program</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyRecoveryPrograms')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#003D9B" size="small" style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity
            style={styles.programCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RecoveryProgramDetail')}
          >
            <View style={styles.progHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.progTitle}>{programName}</Text>
                <Text style={styles.progSub}>Prescribed by {therapistName}</Text>
              </View>
              <Text style={styles.progScoreText}>{recoveryScore}% Score</Text>
            </View>

            <View style={styles.progProgressTrack}>
              <View style={[styles.progProgressFill, { width: `${recoveryScore}%` }]} />
            </View>

            <View style={styles.progFooterRow}>
              <Text style={styles.progSessionsText}>18 / 24 Sessions Completed</Text>
              <Text style={styles.viewProgLinkText}>View Program ➔</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* ACHIEVEMENTS GRID */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Achievements</Text>
        <View style={styles.achieveRow}>
          <View style={styles.achieveCard}>
            <View style={[styles.achieveIconCircle, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="flame" size={20} color="#d97706" />
            </View>
            <Text style={styles.achieveValText}>7 Day</Text>
            <Text style={styles.achieveLabelText}>Streak</Text>
          </View>

          <View style={styles.achieveCard}>
            <View style={[styles.achieveIconCircle, { backgroundColor: '#e6f0ff' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#003D9B" />
            </View>
            <Text style={styles.achieveValText}>24</Text>
            <Text style={styles.achieveLabelText}>Sessions</Text>
          </View>

          <View style={styles.achieveCard}>
            <View style={[styles.achieveIconCircle, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="trophy" size={20} color="#16a34a" />
            </View>
            <Text style={styles.achieveValText}>Goal</Text>
            <Text style={styles.achieveLabelText}>Achieved</Text>
          </View>
        </View>

        {/* WEEKLY ACTIVITY CHART */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 12 }]}>Weekly Activity</Text>
        <View style={styles.weeklyChartCard}>
          <View style={styles.barChartRow}>
            {[
              { day: 'Mon', height: '60%', active: true },
              { day: 'Tue', height: '85%', active: true },
              { day: 'Wed', height: '40%', active: true },
              { day: 'Thu', height: '90%', active: true },
              { day: 'Fri', height: '75%', active: true },
              { day: 'Sat', height: '30%', active: false },
              { day: 'Sun', height: '0%', active: false },
            ].map((item, idx) => (
              <View key={idx} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: item.height },
                      item.active ? { backgroundColor: '#003D9B' } : { backgroundColor: '#cbd5e1' },
                    ]}
                  />
                </View>
                <Text style={styles.barDayText}>{item.day}</Text>
              </View>
            ))}
          </View>
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
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  subGreetingText: {
    fontSize: 12,
    color: '#64748b',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notificationDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  heroCard: {
    backgroundColor: '#003D9B',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroHeaderRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubText: {
    fontSize: 12,
    color: '#e6f0ff',
    textAlign: 'center',
    marginBottom: 16,
  },
  circleGaugeOuter: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 6,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleGaugeInner: {
    alignItems: 'center',
  },
  gaugeNumberText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  gaugeLabelText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#e6f0ff',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  sessionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sessionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sessionMetaText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  sessionBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sessionBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
  },
  startSessionBtn: {
    backgroundColor: '#003D9B',
    height: 48,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startSessionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  programCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  progHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  progSub: {
    fontSize: 12,
    color: '#64748b',
  },
  progScoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#003D9B',
  },
  progProgressTrack: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 10,
  },
  progProgressFill: {
    height: '100%',
    backgroundColor: '#003D9B',
    borderRadius: 3,
  },
  progFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progSessionsText: {
    fontSize: 11,
    color: '#64748b',
  },
  viewProgLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  achieveRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  achieveCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  achieveIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  achieveValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  achieveLabelText: {
    fontSize: 10,
    color: '#64748b',
  },
  weeklyChartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  barChartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  barCol: {
    alignItems: 'center',
    width: 30,
    height: '100%',
  },
  barTrack: {
    flex: 1,
    width: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barDayText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 6,
  },
});
