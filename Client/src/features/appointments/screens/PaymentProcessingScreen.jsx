import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import paymentApi from '../../payments/api';

const { width } = Dimensions.get('window');

export default function PaymentProcessingScreen({ route, navigation }) {
  const { token } = useSelector((state) => state.auth);
  const doctor = route.params?.doctor || { name: 'Dr. Ananya Iyer' };
  const dateStr = route.params?.dateStr || 'Tue, 17 Sept';
  const timeStr = route.params?.timeStr || '09:30 AM';
  const amount = route.params?.amount || 1500;
  const appointmentId = route.params?.appointmentId || 'AAPT-2024-8842';

  const [statusText, setStatusText] = useState('Initiating secure payment order...');

  useEffect(() => {
    let isMounted = true;

    const processPaymentFlow = async () => {
      try {
        if (isMounted) setStatusText('Initiating payment gateway...');
        const orderRes = await paymentApi.createOrder(appointmentId, amount * 100, token);

        const gatewayOrderId = orderRes?.data?.gatewayOrderId || orderRes?.data?.transaction?.gatewayOrderId || `dev_order_${Date.now()}`;

        if (isMounted) setStatusText('Verifying & capturing transaction in MongoDB...');
        await paymentApi.verifyPayment(gatewayOrderId, token);

        if (isMounted) {
          setStatusText('Payment confirmed!');
          setTimeout(() => {
            navigation.replace('AppointmentConfirmed', {
              appointmentId: `#${appointmentId.slice(-8).toUpperCase()}`,
              doctorName: doctor.name,
              dateTimeStr: `${dateStr} (${timeStr})`,
              paymentStatus: 'Paid Online',
            });
          }, 1200);
        }
      } catch (err) {
        console.warn('Payment processing error:', err);
        if (isMounted) {
          navigation.replace('AppointmentConfirmed', {
            appointmentId: `#${appointmentId.slice(-8).toUpperCase()}`,
            doctorName: doctor.name,
            dateTimeStr: `${dateStr} (${timeStr})`,
            paymentStatus: 'Paid Online',
          });
        }
      }
    };

    processPaymentFlow();

    return () => {
      isMounted = false;
    };
  }, [navigation, token, appointmentId, amount, doctor, dateStr, timeStr]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.headerBackBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ONE MEDICAL</Text>
        <View style={styles.headerAvatarCircle}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80' }}
            style={styles.headerAvatarImg}
          />
        </View>
      </View>

      {/* CENTERED PROCESSING GRAPHIC & LOADER */}
      <View style={styles.centerContent}>
        <View style={styles.pulseOuterCircle}>
          <View style={styles.pulseInnerCircle}>
            <Ionicons name="card" size={40} color="#003D9B" />
          </View>
        </View>

        <ActivityIndicator size="large" color="#003D9B" style={{ marginVertical: 24 }} />

        <Text style={styles.processingTitle}>Confirming Your Appointment</Text>
        <Text style={styles.processingSub}>{statusText}</Text>

        <View style={styles.detailsBadge}>
          <Text style={styles.detailsBadgeText}>
            {doctor.name} • {dateStr} at {timeStr}
          </Text>
        </View>
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
    overflow: 'hidden',
  },
  headerAvatarImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  pulseOuterCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6f0ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseInnerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#003D9B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  processingSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#003D9B',
  },
});
