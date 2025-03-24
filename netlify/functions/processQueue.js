const admin = require('firebase-admin');

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Make sure your private key is stored with newline characters escaped.
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the request body
    const { docId } = JSON.parse(event.body);
    if (!docId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing docId in request body' }),
      };
    }

    // Retrieve the queue document from Firestore
    const docRef = db.collection('queues').doc(docId);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Queue item not found' }),
      };
    }

    const data = docSnapshot.data();
    console.log('Processing queue entry:', data);

    // TODO: Add your additional processing here (e.g., sending an email, updating status, etc.)

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Queue processed successfully', data }),
    };
  } catch (error) {
    console.error('Error processing queue:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};