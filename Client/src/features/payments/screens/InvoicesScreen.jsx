import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../../theme/colors';

const MOCK_INVOICES = [
  { id: 'INV-2026-001', date: '2026-08-08', service: 'ACL Rehabilitation Initial Assessment', amount: '₹1,200', status: 'PAID', method: 'UPI', pdfName: 'Invoice_INV-2026-001.pdf' },
  { id: 'INV-2026-002', date: '2026-08-01', service: 'Follow-up Consultation (Knee Extension)', amount: '₹1,200', status: 'PAID', method: 'Credit Card', pdfName: 'Invoice_INV-2026-002.pdf' },
  { id: 'INV-2026-003', date: '2026-07-25', service: 'Physical Therapy Session #1', amount: '₹1,200', status: 'PAID', method: 'Razorpay NetBanking', pdfName: 'Invoice_INV-2026-003.pdf' },
];

export default function InvoicesScreen({ navigation }) {
  const [invoices] = useState(MOCK_INVOICES);

  const handleDownloadInvoice = (inv) => {
    Alert.alert(
      'Download Tax Invoice',
      `Downloading ${inv.pdfName}...\n\nInvoice breakdown:\nSubtotal: ${inv.amount}\nTax (18% GST): Included\nTotal Paid: ${inv.amount}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Payment History & Invoices</Text>
        <Text style={styles.subtitle}>Download official GST tax invoices for physiotherapy consultations</Text>
      </View>

      {/* List */}
      {invoices.map((inv) => (
        <View key={inv.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.invNumber}>{inv.id}</Text>
              <Text style={styles.invDate}>{inv.date} • {inv.method}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{inv.status}</Text>
            </View>
          </View>

          <Text style={styles.serviceName}>{inv.service}</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.amountText}>{inv.amount}</Text>
            <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownloadInvoice(inv)}>
              <Text style={styles.downloadBtnText}>📄 PDF Invoice</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Info card */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 Refund Policy & Support</Text>
        <Text style={styles.infoDesc}>Cancellations up to 2 hours before scheduled consultation qualify for 100% refund. Refunds process within 3-5 business days to original payment method.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  backBtn: { marginBottom: 12 },
  backBtnText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700', color: colors.slate800 },
  subtitle: { fontSize: 13, color: colors.slate500, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  invNumber: { fontSize: 15, fontWeight: '700', color: colors.slate800 },
  invDate: { fontSize: 12, color: colors.slate400, marginTop: 2 },
  statusBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#15803d', fontSize: 12, fontWeight: '700' },
  serviceName: { fontSize: 14, color: colors.slate700, marginVertical: 6, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  amountText: { fontSize: 18, fontWeight: '800', color: colors.primary },
  downloadBtn: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#bfdbfe' },
  downloadBtnText: { color: colors.primary, fontSize: 12, fontWeight: '600' },
  infoCard: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 14, marginTop: 16 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: colors.slate800 },
  infoDesc: { fontSize: 12, color: colors.slate600, marginTop: 4, lineHeight: 17 },
});
