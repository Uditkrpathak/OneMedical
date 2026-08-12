import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { updateAppointmentStatus } from '../../appointments/appointmentSlice';
import paymentApi from '../api';
import { colors } from '../../../theme/colors';
import { themeStyles } from '../../../theme/styles';

export default function PaymentMockScreen({ route, navigation }) {
  const { appointment } = route.params;
  const { token } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [processing, setProcessing] = useState(false);

  const handlePaymentSuccess = async () => {
    setProcessing(true);
    try {
      const mockPayload = {
        appointmentId: appointment.appointmentId,
        razorpayOrderId: 'order_' + Math.random().toString(36).substr(2, 9),
        razorpayPaymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
        razorpaySignature: 'mock_signature_hash_value'
      };

      const res = await paymentApi.verifyPayment(mockPayload, token);
      if (res.success) {
        // Update local Redux state for appointments
        dispatch(updateAppointmentStatus({ id: appointment.appointmentId, status: 'confirmed' }));
        Alert.alert('Payment Captured', 'Booking confirmed! Notification worker has processed your billing receipt.');
        
        // Navigate back to core screens
        navigation.popToTop();
      }
    } catch (err) {
      Alert.alert('Verification Failed', err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handlePaymentFailure = () => {
    Alert.alert(
      'Payment Declined',
      'The transaction was cancelled or declined. Your slot hold will expire in 5 minutes if unpaid.',
      [
        { text: 'Try Again', onPress: () => {} },
        { text: 'Go Back', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <SafeAreaView style={[themeStyles.container, styles.container]}>
      <View style={styles.cardHeader}>
        <Text style={styles.razorpayTitle}>Razorpay Checkout</Text>
        <Text style={styles.subtext}>Secured Gateway Simulation</Text>
      </View>

      <View style={themeStyles.card}>
        <Text style={themeStyles.headingMedium}>Payment Summary</Text>
        <View style={styles.divider} />
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation with:</Text>
          <Text style={styles.val}>{appointment.therapistName}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Appointment ID:</Text>
          <Text style={styles.val}>{appointment.appointmentId}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Scheduled Date:</Text>
          <Text style={styles.val}>{appointment.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time Slot:</Text>
          <Text style={styles.val}>{appointment.startTime} - {appointment.endTime}</Text>
        </View>
        
        <View style={styles.divider} />
        <View style={styles.detailRow}>
          <Text style={[styles.label, { fontWeight: '700' }]}>Total Amount:</Text>
          <Text style={styles.amount}>₹750.00</Text>
        </View>
      </View>

      {processing ? (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.processingText}>Verifying HMAC SHA256 Webhook Signature...</Text>
        </View>
      ) : (
        <View style={styles.btnRow}>
          <TouchableOpacity style={[themeStyles.button, styles.successBtn]} onPress={handlePaymentSuccess}>
            <Text style={themeStyles.buttonText}>✓ MOCK SUCCESS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[themeStyles.button, styles.failBtn]} onPress={handlePaymentFailure}>
            <Text style={themeStyles.buttonText}>✗ MOCK FAILURE</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  razorpayTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: 1,
  },
  subtext: {
    fontSize: 14,
    color: colors.slate500,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: colors.slate100,
    marginVertical: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    color: colors.slate500,
    fontSize: 14,
    fontWeight: '500',
  },
  val: {
    color: colors.slate800,
    fontSize: 14,
    fontWeight: '700',
  },
  amount: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.slate900,
  },
  btnRow: {
    marginTop: 20,
  },
  successBtn: {
    backgroundColor: colors.success,
    marginBottom: 12,
  },
  failBtn: {
    backgroundColor: colors.danger,
  },
  processingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  processingText: {
    color: colors.slate600,
    marginTop: 10,
    fontWeight: '600',
    fontSize: 13,
  }
});
