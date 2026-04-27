/**
 * 베이 관리자 — Firebase Cloud Functions
 * 커스텀 알림을 매분 체크해 FCM으로 푸시 전송
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

    const { fcmToken } = configSnap.data();
    const { schedules } = notifSnap.data();
    if (!fcmToken || !Array.isArray(schedules) || schedules.length === 0) return;

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

    await Promise.all(pending.map(n =>
      admin.messaging().send({
        token: fcmToken,
        notification: { title: n.title, body: n.body || '' },
        webpush: {
          notification: {
            icon: 'https://beybusiness-bit.github.io/bey-manager/icon-192.png'
          }
        }
      }).catch(err => console.error('FCM send error:', err))
    ));
  }
);
