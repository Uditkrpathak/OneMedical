import React, { useState } from 'react';
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

export default function MyRecoveryProgramsScreen({ navigation }) {
  const [tab, setTab] = useState('active'); // 'active' | 'completed' | 'paused'

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Recovery Programs</Text>
        <View style={styles.headerAvatarCircle}>
          <Ionicons name="person" size={16} color="#ffffff" />
        </View>
      </View>

      {/* SEGMENT TABS */}
      <View style={styles.segmentBar}>
        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'active' && styles.segmentBtnActive]}
          onPress={() => setTab('active')}
        >
          <Text style={[styles.segmentText, tab === 'active' && styles.segmentTextActive]}>Active</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'completed' && styles.segmentBtnActive]}
          onPress={() => setTab('completed')}
        >
          <Text style={[styles.segmentText, tab === 'completed' && styles.segmentTextActive]}>Completed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, tab === 'paused' && styles.segmentBtnActive]}
          onPress={() => setTab('paused')}
        >
          <Text style={[styles.segmentText, tab === 'paused' && styles.segmentTextActive]}>Paused</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {tab === 'active' && (
          <View>
            {/* ACTIVE PROGRAM CARD */}
            <View style={styles.activeCard}>
              <View style={styles.activeHeaderRow}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>ACTIVE</Text>
                </View>
                <Text style={styles.scoreText}>Recovery Score: <Text style={{ fontWeight: '800' }}>72%</Text></Text>
              </View>

              <Text style={styles.activeTitle}>Lower Back Rehabilitation</Text>
              <Text style={styles.activeSub}>Prescribed by Dr. Ananya Iyer</Text>

              <View style={styles.gaugeRow}>
                <View style={styles.gaugeCircle}>
                  <Text style={styles.gaugeValText}>75%</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sessionsText}>18 of 24 Sessions Completed</Text>
                  <Text style={styles.improvementText}>📈 Improved 6% this week</Text>
                </View>
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => navigation.navigate('TodaysSession')}
                >
                  <Text style={styles.continueBtnText}>Continue Program</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('RecoveryProgramDetail')}
                >
                  <Text style={styles.detailsBtnText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* PAST PROGRAMS SECTION */}
            <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 12 }]}>Past Programs</Text>

            <View style={styles.pastCard}>
              <View style={styles.pastHeaderRow}>
                <View>
                  <Text style={styles.pastTitle}>Shoulder Mobility</Text>
                  <Text style={styles.pastSub}>Completed Jan 2024 • 12/12 Sessions</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('RecoveryProgressAnalytics')}>
                  <Text style={styles.summaryLinkText}>View Summary</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.pastCard}>
              <View style={styles.pastHeaderRow}>
                <View>
                  <Text style={styles.pastTitle}>Ankle Stability</Text>
                  <Text style={styles.pastSub}>Completed Nov 2023 • 10/10 Sessions</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('RecoveryProgressAnalytics')}>
                  <Text style={styles.summaryLinkText}>View Summary</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {tab !== 'active' && (
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No {tab} programs</Text>
            <Text style={styles.emptySub}>Your {tab} programs will appear here.</Text>
          </View>
        )}

        {/* NEED A NEW PLAN BANNER */}
        <View style={styles.needCard}>
          <Text style={styles.needTitle}>Need a new plan?</Text>
          <Text style={styles.needSub}>
            Schedule a consultation with our recovery specialists to get a personalized program tailored to your goals.
          </Text>
          <TouchableOpacity
            style={styles.consultBtn}
            onPress={() => navigation.navigate('Book')}
          >
            <Text style={styles.consultBtnText}>Book a Consult</Text>
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
    backgroundColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
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
  activeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activeBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
  },
  scoreText: {
    fontSize: 12,
    color: '#003D9B',
  },
  activeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  activeSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  gaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  gaugeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#003D9B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  gaugeValText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  sessionsText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  improvementText: {
    fontSize: 11,
    color: '#16a34a',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  continueBtn: {
    width: '100%',
    backgroundColor: '#003D9B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  detailsBtn: {
    width: '100%',
    backgroundColor: '#f1f5f9',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  pastCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  pastHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  pastSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  summaryLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  needCard: {
    backgroundColor: '#003D9B',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    marginTop: 24,
  },
  needTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  needSub: {
    fontSize: 12,
    color: '#e6f0ff',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 17,
  },
  consultBtn: {
    backgroundColor: '#ffffff',
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#003D9B',
  },
});
