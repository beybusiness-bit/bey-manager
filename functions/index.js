/**
 * 베이 관리자 — Firebase Cloud Functions
 * 커스텀 알림을 매분 체크해 FCM으로 푸시 전송 (등록된 모든 기기)
 *
 * 배포 방법:
 *   cd functions && npm install
 *   firebase deploy --only functions
 *
 * 필요 Firebase 플랜: Blaze (사용량 매우 낮아 사실상 무료)
 */

const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin = require('firebase-admin');

admin.initializeApp();

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

exports.sendScheduledNotifications = onSchedule(
  { schedule: 'every 1 minutes', timeZone: 'Asia/Seoul' },
  async () => {
    const db = admin.firestore();

    const [configSnap, notifSnap] = await Promise.all([
      db.collection('bey-manager').doc('config').get(),
      db.collection('bey-manager').doc('notifications').get()
    ]);

    if (!configSnap.exists || !notifSnap.exists) return;

    const config = configSnap.data();
    const { schedules } = notifSnap.data();
    if (!Array.isArray(schedules) || schedules.length === 0) return;

    /* 등록된 모든 기기 토큰 수집 */
    const tokensMap = config.tokens || {};
    const allTokens = Object.values(tokensMap).filter(Boolean);
    /* 이전 단일 토큰 방식과 하위 호환 */
    if (config.fcmToken && !allTokens.includes(config.fcmToken)) {
      allTokens.push(config.fcmToken);
    }
    if (allTokens.length === 0) return;

    const now = new Date();
    const currentDay = DAYS[now.getDay()];
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hh}:${mm}`;

    const pending = schedules.filter(n => {
      if (!n.enabled) return false;
      const wds = Array.isArray(n.weekdays) && n.weekdays.length > 0
        ? n.weekdays : DAYS;
      return wds.includes(currentDay) && n.time === currentTime;
    });

    if (pending.length === 0) return;

    /* 각 알림을 모든 기기에 발송, 만료된 토큰은 Firestore에서 제거 */
    const expiredTokenKeys = [];
    for (const n of pending) {
      for (const [deviceId, token] of Object.entries(tokensMap)) {
        try {
          await admin.messaging().send({
            token,
            notification: { title: n.title, body: n.body || '' },
            webpush: {
              notification: {
                icon: 'https://beybusiness-bit.github.io/bey-manager/icon-192.png'
              }
            }
          });
        } catch (err) {
          /* 등록되지 않은(만료된) 토큰은 목록에서 제거 */
          if (err.code === 'messaging/registration-token-not-registered' ||
              err.code === 'messaging/invalid-registration-token') {
            if (!expiredTokenKeys.includes(deviceId)) expiredTokenKeys.push(deviceId);
          } else {
            console.error('FCM send error:', err.code, err.message);
          }
        }
      }
    }

    /* 만료 토큰 정리 */
    if (expiredTokenKeys.length > 0) {
      const cleanup = {};
      expiredTokenKeys.forEach(k => { cleanup[`tokens.${k}`] = admin.firestore.FieldValue.delete(); });
      await db.collection('bey-manager').doc('config').update(cleanup).catch(() => {});
    }
  }
);
