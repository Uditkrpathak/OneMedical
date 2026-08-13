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

export default function RecoveryProgramDetailScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recovery Program</Text>
        <TouchableOpacity style={styles.headerBackBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* HERO ANATOMICAL DIAGRAM CARD */}
        <View style={styles.diagramCard}>
          <Image
            source={require('../../../../assets/images/spine_3d_model.jpg')}
            style={styles.spinePhoto}
          />
        </View>

        {/* PROGRAM HEADER INFO */}
        <View style={styles.progInfoCard}>
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT PROGRAM</Text>
          </View>

          <Text style={styles.progTitle}>Lower Back Rehabilitation</Text>
          <Text style={styles.progSub}>Prescribed by Dr. Ananya Iyer</Text>

          <View style={styles.progressRow}>
            <View style={styles.progTrack}>
              <View style={[styles.progFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progCountText}>18 / 24 Sessions</Text>
          </View>
        </View>

        {/* PROGRAM OVERVIEW & METRICS */}
        <View style={styles.overviewCard}>
          <Text style={styles.sectionHeaderTitle}>Program Overview</Text>
          <Text style={styles.overviewText}>
            Goal: Improve lower back strength and mobility through targeted functional movements.
          </Text>

          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Completion</Text>
              <Text style={styles.metaValue}>Nov 15, 2024</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Difficulty</Text>
              <Text style={styles.metaValue}>Intermediate</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Frequency</Text>
              <Text style={styles.metaValue}>3x per week</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Intensity</Text>
              <Text style={styles.metaValue}>Progressive</Text>
            </View>
          </View>
        </View>

        {/* TODAY'S SESSION CARD */}
        <View style={styles.sessionBannerCard}>
          <View style={styles.sessionBannerHeader}>
            <Text style={styles.sessionBannerTitle}>{"Today's Session"}</Text>
            <View style={styles.activePill}><Text style={styles.activePillText}>ACTIVE</Text></View>
          </View>
          <Text style={styles.sessionBannerSub}>5 Exercises • ⏱ 20 Mins • Std. Intensity</Text>

          <TouchableOpacity
            style={styles.startSessionBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('TodaysSession')}
          >
            <Text style={styles.startSessionBtnText}>{"Start Today's Session ➔"}</Text>
          </TouchableOpacity>
        </View>

        {/* RECOVERY ROADMAP TIMELINE */}
        <Text style={[styles.sectionHeaderTitle, { marginTop: 20, marginBottom: 12 }]}>Recovery Roadmap</Text>

        <View style={styles.roadmapCard}>
          {/* Phase 1 */}
          <View style={styles.phaseItem}>
            <View style={[styles.phaseIconCircle, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="checkmark" size={16} color="#16a34a" />
            </View>
            <View style={styles.phaseContent}>
              <Text style={styles.phaseTitle}>Week 1-2: Fundamentals</Text>
              <Text style={styles.phaseDesc}>Core activation and basic flexibility skills.</Text>
            </View>
          </View>

          {/* Phase 2 - Active */}
          <View style={styles.phaseItem}>
            <View style={[styles.phaseIconCircle, { backgroundColor: '#003D9B' }]}>
              <Ionicons name="fitness" size={16} color="#ffffff" />
            </View>
            <View style={styles.phaseContent}>
              <Text style={[styles.phaseTitle, { color: '#003D9B' }]}>Week 3-4: Mobility Focus (Current)</Text>
              <Text style={styles.phaseDesc}>Improving range of motion in lumbar spine.</Text>
            </View>
          </View>

          {/* Phase 3 */}
          <View style={styles.phaseItem}>
            <View style={[styles.phaseIconCircle, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="lock-closed-outline" size={16} color="#94a3b8" />
            </View>
            <View style={styles.phaseContent}>
              <Text style={[styles.phaseTitle, { color: '#94a3b8' }]}>Week 5-6: Strengthening</Text>
              <Text style={styles.phaseDesc}>Advanced core stability and functional loading.</Text>
            </View>
          </View>

          {/* Phase 4 */}
          <View style={styles.phaseItem}>
            <View style={[styles.phaseIconCircle, { backgroundColor: '#f1f5f9' }]}>
              <Ionicons name="trophy-outline" size={16} color="#94a3b8" />
            </View>
            <View style={styles.phaseContent}>
              <Text style={[styles.phaseTitle, { color: '#94a3b8' }]}>Week 7-8: Graduation</Text>
              <Text style={styles.phaseDesc}>Final assessment and maintenance planning.</Text>
            </View>
          </View>
        </View>

        {/* NOTE FROM DR. IYER */}
        <View style={styles.noteCard}>
          <View style={styles.noteHeaderRow}>
            <Ionicons name="chatbox-ellipses-outline" size={18} color="#003D9B" style={{ marginRight: 8 }} />
            <Text style={styles.noteTitle}>Note from Dr. Iyer</Text>
          </View>
          <Text style={styles.noteBodyText}>
            {"\"Focus on slow controlled movements and avoid sudden twisting. Breathing control is vital today—inhale as you prepare, exhale deeply as you move into rotation.\""}
          </Text>
          <Text style={styles.noteTimeText}>Received 2 hours ago</Text>
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
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  diagramCard: {
    height: 180,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinePhoto: {
    width: '100%',
    height: '100%',
  },
  progInfoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  currentBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#003D9B',
  },
  progTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  progSub: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  progFill: {
    height: '100%',
    backgroundColor: '#003D9B',
    borderRadius: 3,
  },
  progCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#003D9B',
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  overviewText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  sessionBannerCard: {
    backgroundColor: '#003D9B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  sessionBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sessionBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#ffffff',
  },
  sessionBannerSub: {
    fontSize: 12,
    color: '#e6f0ff',
    marginBottom: 14,
  },
  startSessionBtn: {
    backgroundColor: '#ffffff',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startSessionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003D9B',
  },
  roadmapCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 16,
    marginBottom: 16,
  },
  phaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phaseContent: {
    flex: 1,
  },
  phaseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  phaseDesc: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  noteCard: {
    backgroundColor: '#f0f6ff',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  noteHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#003D9B',
  },
  noteBodyText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  noteTimeText: {
    fontSize: 10,
    color: '#003D9B',
    fontWeight: '700',
  },
});
