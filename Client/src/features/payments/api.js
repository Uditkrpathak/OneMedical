import { resilientFetch } from '../../shared/apiClient';

export const paymentApi = {
  createOrder: async (appointmentId, amountPaise, token) => {
    const mockFn = () => ({
      orderId: 'pay_ord_' + Math.random().toString(36).substr(2, 9),
      gatewayOrderId: 'dev_order_' + Date.now(),
      amountPaise,
      appointmentId,
    });

    const res = await resilientFetch(
      '/payments/orders',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ appointmentId, amountPaise }),
      },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued };
  },

  verifyPayment: async (gatewayOrderId, token) => {
    const mockFn = () => ({
      message: 'Payment captured successfully (Mock Mode)',
      transactionId: 'txn_' + Date.now(),
      status: 'SUCCESS'
    });

    const res = await resilientFetch(
      '/payments/dev/capture',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ gatewayOrderId }),
      },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source, isOfflineQueued: res.isOfflineQueued };
  },

  getMyTransactions: async (token) => {
    const mockFn = () => [
      {
        id: 'txn_101',
        appointmentId: '#APT-2024-8842',
        doctorName: 'Dr. Ananya Iyer',
        serviceName: 'Post-Surgery Knee Rehab',
        amountPaise: 150000,
        status: 'captured',
        paymentMethod: 'UPI (Google Pay)',
        date: 'Oct 24, 2024 • 10:30 AM',
        receiptUrl: 'https://onemedical.com/receipt/txn_101.pdf',
      },
      {
        id: 'txn_102',
        appointmentId: '#APT-2024-7719',
        doctorName: 'Dr. Rahul Sharma',
        serviceName: 'Spinal Mobility Consult',
        amountPaise: 120000,
        status: 'captured',
        paymentMethod: 'Credit Card (Visa ending 4242)',
        date: 'Oct 15, 2024 • 02:00 PM',
        receiptUrl: 'https://onemedical.com/receipt/txn_102.pdf',
      },
      {
        id: 'txn_103',
        appointmentId: '#APT-2024-5501',
        doctorName: 'Dr. Sarah Johnson',
        serviceName: 'Initial Physical Assessment',
        amountPaise: 200000,
        status: 'refunded',
        paymentMethod: 'Netbanking (HDFC)',
        date: 'Sep 28, 2024 • 11:30 AM',
        receiptUrl: 'https://onemedical.com/receipt/txn_103.pdf',
      },
    ];

    const res = await resilientFetch(
      '/payments/transactions/my',
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source };
  },

  getInvoiceById: async (transactionId, token) => {
    const mockFn = () => ({
      invoiceNumber: `INV-${transactionId || '009821'}`,
      issuedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      patientName: 'Udit Kumar Pathak',
      doctorName: 'Dr. Ananya Iyer',
      serviceName: 'Post-Surgery Knee Rehab',
      clinicName: 'One Medical Central, Indiranagar',
      subtotal: 1500,
      tax: 0,
      totalAmount: 1500,
      paymentMethod: 'UPI (Google Pay)',
      status: 'PAID',
    });

    const res = await resilientFetch(
      `/invoices/${transactionId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      mockFn
    );

    return { success: res.success, data: res.data, source: res.source };
  },
};

export default paymentApi;
