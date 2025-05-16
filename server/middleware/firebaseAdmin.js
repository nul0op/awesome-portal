const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVER_CONFIG);

const app = initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth(app);

module.exports = { auth };