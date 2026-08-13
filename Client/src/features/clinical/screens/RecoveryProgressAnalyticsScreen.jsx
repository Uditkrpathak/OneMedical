import React from 'react';
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

const { width } = Dimensions.get('window');

export default function RecoveryProgressAnalyticsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recovery Progress</Text>
        <TouchableOpacity style={styles.headerBackBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* CURRENT STATUS CARD */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeaderRow}>
            <View>
              <Text style={styles.statusMetaLabel}>CURRENT STATUS</Text>
              <Text style={styles.statusTitle}>Recovery Score</Text>
            </View>
            <View style={styles.scoreGaugeCircle}>
              <Text style={styles.scoreGaugeText}>82%</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Ionicons name="trending-up" size={16} color="#16a34a" style={{ marginRight: 6 }} />
            <Text style={styles.statusTrendText}>Improved 6% this week</Text>
          </View>
        </View>

        {/* MOBILITY TREND CHART */}
        <View style={styles.sectionCard}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.sectionHeaderTitle}>Mobility Trend</Text>
            <Text style={styles.chartTimePill}>WEEK</Text>
          </View>

          {/* Simple Visual Line Chart Representation */}
          <View style={styles.lineChartBox}>
            <View style={styles.chartLineTrack}>
              <View style={styles.chartDataPoint1} />
              <View style={styles.chartDataPoint2} />
              <View style={styles.chartDataPoint3} />
              <View style={styles.chartDataPoint4} />
            </View>

            <View style={styles.chartDaysRow}>
              <Text style={styles.chartDayLabel}>Mon</Text>
              <Text style={styles.chartDayLabel}>Tue</Text>
              <Text style={styles.chartDayLabel}>Wed</Text>
              <Text style={styles.chartDayLabel}>Thu</Text>
              <Text style={styles.chartDayLabel}>Fri</Text>
              <Text style={styles.chartDayLabel}>Sat</Text>
              <Text style={[styles.chartDayLabel, { color: '#003D9B', fontWeight: '800' }]}>Today</Text>
            </View>
          </View>
        </View>

        {/* 4 STAT METRICS GRID */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#003D9B" style={{ marginBottom: 4 }} />
            <Text style={styles.statVal}>24</Text>
            <Text style={styles.statLab}>Sessions</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={20} color="#d97706" style={{ marginBottom: 4 }} />
            <Text style={styles.statVal}>8 Days</Text>
            <Text style={styles.statLab}>Streak</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={20} color="#16a34a" style={{ marginBottom: 4 }} />
            <Text style={styles.statVal}>12.5h</Text>
            <Text style={styles.statLab}>Total Time</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="fitness-outline" size={20} color="#9333ea" style={{ marginBottom: 4 }} />
            <Text style={styles.statVal}>120</Text>
            <Text style={styles.statLab}>Exercises</Text>
          </View>
        </View>

        {/* MILESTONES CHECKLIST */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Milestones</Text>

          <View style={styles.milestonesList}>
            <View style={styles.msItem}>
              <View style={[styles.msIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="trophy" size={18} color="#d97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.msTitle}>20 Sessions</Text>
                <Text style={styles.msSub}>Achieved on Oct 12</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            </View>

            <View style={styles.msItem}>
              <View style={[styles.msIconCircle, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="flame" size={18} color="#d97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.msTitle}>10-Day Streak</Text>
                <Text style={styles.msSub}>Achieved on Oct 10</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
            </View>
          </View>
        </View>

        {/* THERAPIST EVALUATION NOTE */}
        <View style={styles.evalCard}>
          <Text style={styles.evalDocName}>DR. SARAH IYER • THERAPIST</Text>
          <Text style={styles.evalText}>
            {"\"You're showing excellent stability in your lumbar spine movements. Keep up the consistency!\""}
          </Text>
        </View>

        {/* NEXT MILESTONE BANNER */}
        <View style={styles.nextMsCard}>
          <Text style={styles.nextMsTitle}>Next Milestone</Text>
          <Text style={styles.nextMsSub}>Complete 2 more sessions to finish Week 4.</Text>
        </View>
      </ScrollView>

      {/* STICKY CONTINUE CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.continueBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('TodaysSession')}
        >
          <Text style={styles.continueBtnText}>Continue Program ➔</Text>
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
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90,
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  statusHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusMetaLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  scoreGaugeCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 4,
    borderColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreGaugeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#003D9B',
  },
  statusTrendText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 10,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  chartTimePill: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  lineChartBox: {
    paddingVertical: 10,
  },
  chartLineTrack: {
    height: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#003D9B',
    position: 'relative',
    justifyContent: 'center',
  },
  chartDataPoint1: {
    position: 'absolute',
    left: '10%',
    bottom: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#003D9B',
  },
  chartDataPoint2: {
    position: 'absolute',
    left: '40%',
    bottom: 30,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#003D9B',
  },
  chartDataPoint3: {
    position: 'absolute',
    left: '70%',
    bottom: 25,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#003D9B',
  },
  chartDataPoint4: {
    position: 'absolute',
    right: '5%',
    bottom: 45,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#003D9B',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  chartDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartDayLabel: {
    fontSize: 11,
    color: '#64748b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLab: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 1,
  },
  milestonesList: {
    gap: 12,
  },
  msItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  msEmoji: {
    fontSize: 16,
  },
  msTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  msSub: {
    fontSize: 11,
    color: '#64748b',
  },
  evalCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  evalDocName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  evalText: {
    fontSize: 12,
    color: '#334155',
    fontStyle: 'italic',
    lineHeight: 17,
  },
  nextMsCard: {
    backgroundColor: '#003D9B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  nextMsTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 2,
  },
  nextMsSub: {
    fontSize: 12,
    color: '#e6f0ff',
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
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
