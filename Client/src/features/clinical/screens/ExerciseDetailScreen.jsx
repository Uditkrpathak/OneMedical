import React from 'react';
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

export default function ExerciseDetailScreen({ route, navigation }) {
  const exercise = route.params?.exercise || {
    name: 'Pelvic Tilt',
    meta: '12 Reps × 2 Sets',
    duration: '5 Mins',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Details</Text>
        <TouchableOpacity style={styles.headerBackBtn}>
          <Ionicons name="share-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {/* VIDEO DEMO PLAYER BOX */}
        <View style={styles.videoWrap}>
          <Image
            source={{ uri: exercise.videoThumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800' }}
            style={styles.videoPhoto}
          />
          <TouchableOpacity
            style={styles.playButtonCircle}
            activeOpacity={0.85}
            onPress={() => {
              if (exercise.videoUrl) {
                Linking.openURL(exercise.videoUrl).catch(() => {});
              }
            }}
          >
            <Ionicons name="play" size={28} color="#0284c7" style={{ marginLeft: 3 }} />
          </TouchableOpacity>

          <View style={styles.videoBadgeTag}>
            <Ionicons name="videocam" size={12} color="#ffffff" style={{ marginRight: 4 }} />
            <Text style={styles.videoBadgeTagText}>THERAPIST GUIDED VIDEO</Text>
          </View>
        </View>

        {/* TITLE & TARGET METRICS */}
        <View style={styles.titleCard}>
          <Text style={styles.exTitle}>{exercise.name}</Text>
          
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Target Area</Text>
              <Text style={styles.metricValue}>{exercise.category || exercise.targetMuscle || 'Lower Back'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Equipment</Text>
              <Text style={styles.metricValue}>{exercise.equipment || 'Yoga Mat'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Duration</Text>
              <Text style={styles.metricValue}>{exercise.durationSec ? `${exercise.durationSec}s Hold` : '5 Minutes'}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Reps / Sets</Text>
              <Text style={styles.metricValue}>{exercise.reps || 10} Reps × {exercise.sets || 3}</Text>
            </View>
          </View>
        </View>

        {/* INSTRUCTIONS STEP-BY-STEP */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Instructions</Text>

          <View style={styles.stepList}>
            {[
              '1. Lie flat on your back with knees bent.',
              '2. Tighten your abdominal muscles.',
              '3. Gently tilt your pelvis upward.',
              '4. Hold for 5 seconds.',
              '5. Return slowly.',
            ].map((stepText, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepNumBadge}><Text style={styles.stepNumText}>{idx + 1}</Text></View>
                <Text style={styles.stepText}>{stepText.replace(/^\d+\.\s*/, '')}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CLINICAL TIPS BOX */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeaderRow}>
            <Ionicons name="medical-outline" size={18} color="#16a34a" style={{ marginRight: 8 }} />
            <Text style={styles.tipsTitle}>Clinical Tips</Text>
          </View>

          <View style={styles.tipsGrid}>
            <Text style={styles.tipItemText}>✔ Breathe normally</Text>
            <Text style={styles.tipItemText}>✔ Move slowly</Text>
            <Text style={styles.tipItemText}>✔ Avoid jerk movements</Text>
            <Text style={styles.tipItemText}>✔ Stop if you feel sharp pain</Text>
          </View>
        </View>

        {/* MISTAKES TO AVOID ACCORDION */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeaderTitle}>Mistakes to Avoid</Text>
          <Text style={styles.mistakeItemText}>• Arching your back too much</Text>
          <Text style={styles.mistakeItemText}>• Holding your breath</Text>
          <Text style={styles.mistakeItemText}>• Moving too quickly</Text>
        </View>
      </ScrollView>

      {/* STICKY START EXERCISE CTA */}
      <View style={styles.bottomCtaBar}>
        <TouchableOpacity
          style={styles.startExBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ExerciseTimerActive', { exercise })}
        >
          <Ionicons name="play" size={18} color="#ffffff" style={{ marginRight: 8 }} />
          <Text style={styles.startExBtnText}>Start Exercise Session</Text>
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
  videoWrap: {
    width: '100%',
    height: 220,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  videoBadgeTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(2, 132, 199, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  videoBadgeTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  videoPhoto: {
    width: '100%',
    height: '100%',
  },
  playButtonCircle: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  titleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  exTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  stepList: {
    gap: 10,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284c7',
  },
  stepText: {
    fontSize: 12,
    color: '#334155',
    flex: 1,
  },
  tipsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 14,
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803d',
  },
  tipsGrid: {
    gap: 4,
  },
  tipItemText: {
    fontSize: 12,
    color: '#166534',
  },
  mistakeItemText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
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
  startExBtn: {
    backgroundColor: '#0284c7',
    height: 52,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  startExBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
