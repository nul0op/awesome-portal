const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const serviceAccount = require('../secure/firebase-server-sa.json');

const app = initializeApp({
  credential: cert(serviceAccount)
});

const auth = getAuth(app);

module.exports = { auth };