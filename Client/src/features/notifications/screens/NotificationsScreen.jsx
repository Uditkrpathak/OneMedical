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

const NOTIFICATIONS_DATA = [
  {
    group: 'TODAY',
    items: [
      {
        id: 1,
        title: 'Appointment Reminder',
        desc: 'Your session with Dr. Mehta starts in 1 hour.',
        time: '1h ago',
        icon: 'calendar',
        iconBg: '#e6f0ff',
        iconColor: '#003D9B',
        unread: true,
      },
      {
        id: 2,
        title: 'Recovery Milestone',
        desc: "Congratulations! You've reached 80% of your Week 4 goals.",
        time: '3h ago',
        icon: 'trophy',
        iconBg: '#fef3c7',
        iconColor: '#d97706',
        unread: true,
      },
    ],
  },
  {
    group: 'YESTERDAY',
    items: [
      {
        id: 3,
        title: 'New Medical Report Uploaded',
        desc: 'Dr. Ananya Iyer uploaded Knee Scan Analysis.',
        time: 'Yesterday 4:15 PM',
        icon: 'document-text',
        iconBg: '#e6f0ff',
        iconColor: '#003D9B',
        unread: false,
      },
      {
        id: 4,
        title: 'Payment Success',
        desc: 'Invoice #INV-9021 for ₹1,500 has been processed.',
        time: '1d ago',
        icon: 'card',
        iconBg: '#dcfce7',
        iconColor: '#16a34a',
        unread: false,
      },
    ],
  },
  {
    group: 'EARLIER',
    items: [
      {
        id: 5,
        title: 'System Update',
        desc: 'PhysioPro version 3.4 is now live with enhanced tracking.',
        time: '3d ago',
        icon: 'settings',
        iconBg: '#f1f5f9',
        iconColor: '#64748b',
        unread: false,
      },
    ],
  },
];

export default function NotificationsScreen({ navigation }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'appointments' | 'recovery' | 'alerts'

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.headerBackBtn}>
          <Ionicons name="settings-outline" size={20} color="#0f172a" />
        </TouchableOpacity>
      </View>

      {/* FILTER PILLS */}
      <View style={styles.filterRow}>
        {['all', 'appointments', 'recovery', 'alerts'].map((item) => {
          const isSelected = filter === item;
          return (
            <TouchableOpacity
              key={item}
              style={[styles.filterPill, isSelected && styles.filterPillSelected]}
              onPress={() => setFilter(item)}
            >
              <Text style={[styles.filterPillText, isSelected && styles.filterPillTextSelected]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS_DATA.map((groupItem) => (
          <View key={groupItem.group} style={styles.groupContainer}>
            <Text style={styles.groupHeaderTitle}>{groupItem.group}</Text>

            <View style={styles.groupItemsList}>
              {groupItem.items.map((item) => (
                <View key={item.id} style={[styles.notifCard, item.unread && styles.notifCardUnread]}>
                  <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                    <Ionicons name={item.icon} size={18} color={item.iconColor} />
                  </View>

                  <View style={styles.notifContent}>
                    <View style={styles.notifTitleRow}>
                      <Text style={styles.notifTitle}>{item.title}</Text>
                      <Text style={styles.notifTime}>{item.time}</Text>
                    </View>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
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
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  filterPillSelected: {
    backgroundColor: '#003D9B',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  filterPillTextSelected: {
    color: '#ffffff',
  },
  scrollInner: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 10,
  },
  groupItemsList: {
    gap: 10,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  notifCardUnread: {
    backgroundColor: '#f0f9ff',
    borderColor: '#bae6fd',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  notifTime: {
    fontSize: 10,
    color: '#94a3b8',
  },
  notifDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
  },
});
