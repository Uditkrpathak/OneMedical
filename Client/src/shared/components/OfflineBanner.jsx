import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function OfflineBanner({ isOffline = false, message = "You are currently offline. Changes will sync when reconnected." }) {
  if (!isOffline) return null;

  return (
    <View style={styles.bannerContainer}>
      <Ionicons name="cloud-offline-outline" size={16} color="#ffffff" style={{ marginRight: 8 }} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bannerContainer: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});
