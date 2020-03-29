const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase_tools = require('firebase-tools');

admin.initializeApp();

exports.cleanUpSessions = functions.pubsub
  .schedule('every 12 hours')
  .onRun(async () => {
    const terminated = await admin
      .firestore()
      .collection('sessions')
      .where('state', '==', 'TERMINATED')
      .get();
    const aDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const outdated = await admin
      .firestore()
      .collection('sessions')
      .where('createdAt', '<', aDayAgo)
      .get();
    const toDelete = [...terminated.docs, ...outdated.docs];
    const done = await Promise.all([
      toDelete.map((doc) => {
        return firebase_tools.firestore.delete(doc.ref.path, {
          project: process.env.GCLOUD_PROJECT,
          recursive: true,
          yes: true,
          token: functions.config().fb.token,
        });
      }),
    ]);
    console.log(`Deleted ${done.length} outdated or terminated sessions.`);
  });
