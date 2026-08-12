import amqplib from 'amqplib';
import { sendPush, sendSms, sendEmail } from './adapters.js';

const EXCHANGE = 'onemedical.events';
const QUEUE    = 'clinical-service.notification.queue';

const handlers = {
  'appointment.confirmed': async (payload) => {
    const { appointmentId } = payload;
    console.log(`[Notify] appointment.confirmed — appointmentId: ${appointmentId}`);
    await sendPush({ fcmToken: null, title: 'Appointment Confirmed!', body: `Your booking #${appointmentId} is confirmed.`, data: { appointmentId } });
    await sendSms({ phone: null, message: `Your One Medical appointment is confirmed. ID: ${appointmentId}` });
  },
  'appointment.cancelled': async (payload) => {
    const { appointmentId } = payload;
    console.log(`[Notify] appointment.cancelled — appointmentId: ${appointmentId}`);
    await sendPush({ fcmToken: null, title: 'Appointment Cancelled', body: `Booking #${appointmentId} has been cancelled.` });
  },
  'appointment.completed': async (payload) => {
    const { appointmentId } = payload;
    console.log(`[Notify] appointment.completed — appointmentId: ${appointmentId}`);
    await sendPush({ fcmToken: null, title: 'How was your session?', body: 'Rate your therapist and track your recovery progress!' });
  },
  'payment.succeeded': async (payload) => {
    const { transactionId, amountPaise } = payload;
    const amountRupees = (amountPaise / 100).toFixed(2);
    console.log(`[Notify] payment.succeeded — txnId: ${transactionId}, ₹${amountRupees}`);
    await sendEmail({ email: null, subject: 'Payment Successful — One Medical', text: `Your payment of ₹${amountRupees} was received. Transaction ID: ${transactionId}` });
    await sendPush({ fcmToken: null, title: `Payment Confirmed ₹${amountRupees}`, body: 'Your appointment is now booked!' });
  },
  'payment.refunded': async (payload) => {
    const { refundId, amountPaise } = payload;
    const amountRupees = (amountPaise / 100).toFixed(2);
    console.log(`[Notify] payment.refunded — refundId: ${refundId}, ₹${amountRupees}`);
    await sendEmail({ email: null, subject: 'Refund Initiated — One Medical', text: `A refund of ₹${amountRupees} has been initiated. Refund ID: ${refundId}` });
  },
  'clinical.alert': async (payload) => {
    const { patientId, painLevel, message } = payload;
    console.log(`[Notify] clinical.alert — patientId: ${patientId}, painLevel: ${painLevel}`);
    await sendPush({ fcmToken: null, title: '⚠️ Pain Alert', body: message });
    await sendSms({ phone: null, message: `One Medical Alert: Patient pain level is ${painLevel}/10 for 2+ consecutive sessions. Please review.` });
  },
};

export const startNotificationWorker = async () => {
  try {
    const connection = await amqplib.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE, 'topic', { durable: true });
    await channel.assertQueue(QUEUE, { durable: true });

    const routingKeys = Object.keys(handlers);
    for (const key of routingKeys) {
      await channel.bindQueue(QUEUE, EXCHANGE, key);
    }

    channel.prefetch(1);
    console.log(`[Embedded Notification Worker] Listening for events: ${routingKeys.join(', ')}`);

    channel.consume(QUEUE, async (msg) => {
      if (!msg) return;
      const routingKey = msg.fields.routingKey;
      try {
        const payload = JSON.parse(msg.content.toString());
        const handler = handlers[routingKey];
        if (handler) {
          await handler(payload);
          channel.ack(msg);
        } else {
          channel.nack(msg, false, false);
        }
      } catch (err) {
        console.error(`[Notify] Handler error for ${routingKey}:`, err.message);
        channel.nack(msg, false, false);
      }
    });
  } catch (err) {
    console.warn(`[Notification Worker] RabbitMQ offline (${err.message}) — notification listener skipped.`);
  }
};
