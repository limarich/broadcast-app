import * as admin from 'firebase-admin'
import { onSchedule } from 'firebase-functions/v2/scheduler'

admin.initializeApp()

const db = admin.firestore()

export const dispatchScheduledMessages = onSchedule({
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
    timeoutSeconds: 60,
}, async () => {
    const now = admin.firestore.Timestamp.now()

    const snapshot = await db
        .collection('messages')
        .where('status', '==', 'SCHEDULED')
        .where('scheduledAt', '<=', now)
        .get()

    if (snapshot.empty) return

    const batch = db.batch()

    snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
            status: 'SENT',
            sentAt: now,
        })
    })

    await batch.commit()
})