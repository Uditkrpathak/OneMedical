import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import paymentApi from '../api';

export default function InvoiceDetailsScreen({ route, navigation }) {
  const transactionId = route.params?.transactionId;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!transactionId) return;
      setLoading(true);
      try {
        const res = await paymentApi.getInvoiceById(transactionId);
        if (res.success && res.data) {
          setInvoice(res.data);
        }
      } catch (err) {
        console.warn('[Invoice] Fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [transactionId]);

  const defaultInvoice = {
    invoiceNumber: 'INV-009821',
    issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    clinicName: 'ONE MEDICAL Clinic',
    address: 'Downtown Hub, MG Road, Bengaluru',
    gstin: '027-Z99AA9A00Z5A1Z3',
    patientName: 'Sanya Malhotra',
    patientId: '#PT-1024',
    doctorName: 'Dr. Ananya Iyer',
    department: 'Sports Physiotherapy',
    consultationFee: 1500,
    additionalCharges: 193,
    discount: 100,
    totalPaise: 159300,
    paymentMethod: 'UPI (Sanya.m@okhdfcbank)',
  };

  const inv = invoice || defaultInvoice;
  const totalAmount = (inv.totalPaise ? inv.totalPaise / 100 : inv.consultationFee + inv.additionalCharges - inv.discount);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* INVOICE HERO CARD */}
        <View style={styles.invoiceHeroCard}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 4 }} />
            <Text style={styles.statusBadgeText}>PAID</Text>
          </View>
          <Text style={styles.invoiceNumberText}>{inv.invoiceNumber}</Text>
          <Text style={styles.invoiceDateText}>Issued: {inv.issuedDate}</Text>

          <View style={styles.divider} />

          <Text style={styles.clinicTitle}>{inv.clinicName}</Text>
          <Text style={styles.clinicAddress}>{inv.address}</Text>
          <Text style={styles.gstinText}>GSTIN: {inv.gstin}</Text>
        </View>

        {/* DETAILS GRID */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionHeaderTitle}>PATIENT DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Patient Name</Text>
            <Text style={styles.detailValue}>{inv.patientName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Patient ID</Text>
            <Text style={styles.detailValue}>{inv.patientId}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeaderTitle}>SPECIALIST DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Doctor Name</Text>
            <Text style={styles.detailValue}>{inv.doctorName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailValue}>{inv.department}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionHeaderTitle}>FINANCIAL BREAKDOWN</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Consultation Fee</Text>
            <Text style={styles.detailValue}>₹{inv.consultationFee.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Additional Charges</Text>
            <Text style={styles.detailValue}>₹{inv.additionalCharges.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Discount Applied</Text>
            <Text style={[styles.detailValue, { color: '#16a34a' }]}>-₹{inv.discount.toFixed(2)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount Paid</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity
          style={styles.downloadPdfBtn}
          onPress={() => Alert.alert('Download PDF', 'Generating official GSTIN invoice PDF...')}
        >
          <Ionicons name="download" size={18} color="#ffffff" style={{ marginRight: 6 }} />
          <Text style={styles.downloadPdfBtnText}>Download PDF Invoice</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    padding: 6,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
  },
  invoiceHeroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803d',
  },
  invoiceNumberText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  invoiceDateText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    width: '100%',
    marginVertical: 14,
  },
  clinicTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  clinicAddress: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  gstinText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  detailsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#003D9B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#003D9B',
  },
  downloadPdfBtn: {
    backgroundColor: '#003D9B',
    height: 54,
    borderRadius: 27,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadPdfBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
