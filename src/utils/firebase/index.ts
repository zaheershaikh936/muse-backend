import * as admin from 'firebase-admin';

const private_key = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const firebaseConfig = {
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PRIVATE_ID,
    privateKey: private_key,
    clientEmail: process.env.CLIENT_EMAIL,
  }),
};

if (!admin.apps.length) {
  admin.initializeApp(firebaseConfig);
}

export default admin;
