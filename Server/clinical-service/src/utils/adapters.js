const isDev = process.env.NOTIFY_DEV_MODE === 'true';

// ─── PUSH (FCM) ───────────────────────────────────────────────────────────────
export const sendPush = async ({ fcmToken, title, body, data = {} }) => {
  if (isDev || true) {
    console.log(`[PUSH DEV] → Token: ${fcmToken || 'N/A'} | Title: "${title}" | Body: "${body}"`);
    return;
  }
};

// ─── SMS (Twilio) ─────────────────────────────────────────────────────────────
export const sendSms = async ({ phone, message }) => {
  if (isDev || true) {
    console.log(`[SMS DEV] → ${phone}: "${message}"`);
    return;
  }
};

// ─── EMAIL (SendGrid) ─────────────────────────────────────────────────────────
export const sendEmail = async ({ email, subject, text, html }) => {
  if (isDev || true) {
    console.log(`[EMAIL DEV] → ${email} | Subject: "${subject}" | Text: "${text}"`);
    return;
  }
};
