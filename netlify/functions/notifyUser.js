// const twilio = require('twilio');

// // Load environment variables
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// // Initialize Twilio client
// const client = twilio(accountSid, authToken);

// exports.handler = async (event) => {
//   // Only accept POST requests
//   if (event.httpMethod !== 'POST') {
//     return {
//       statusCode: 405,
//       body: JSON.stringify({ error: 'Method Not Allowed' }),
//     };
//   }

//   try {
//     // Parse request body
//     const { phoneNumber, message } = JSON.parse(event.body);

//     console.log('Received phoneNumber:', phoneNumber);
//     console.log('Received message:', message);
//     console.log('Twilio FROM number:', twilioNumber);
//     console.log('Twilio authToken:', authToken);
//     console.log('Twilio accountSid:', accountSid);

//     // Validate required fields
//     if (!phoneNumber || !message) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Missing phone number or message' }),
//       };
//     }

//     // Validate environment variables
//     if (!accountSid || !authToken || !twilioNumber) {
//       return {
//         statusCode: 500,
//         body: JSON.stringify({ error: 'Missing Twilio environment variables' }),
//       };
//     }

//     // Validate phone number format
//     if (!twilioNumber.startsWith('+') || !phoneNumber.startsWith('+')) {
//       return {
//         statusCode: 400,
//         body: JSON.stringify({ error: 'Phone numbers must start with "+" (E.164 format)' }),
//       };
//     }

//     // Send SMS via Twilio
//     const twilioResponse = await client.messages.create({
//       body: message,
//       from: twilioNumber,
//       to: phoneNumber,
//     });

//     console.log('Twilio message sent successfully:', twilioResponse.sid);

//     return {
//       statusCode: 200,
//       body: JSON.stringify({ success: true, sid: twilioResponse.sid }),
//     };
//   } catch (err) {
//     console.error('Twilio error:', err);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ error: err.message }),
//     };
//   }
// };

const twilio = require('twilio');
const admin = require('firebase-admin');

// Firebase Admin init
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { phoneNumber, message, docId, type } = JSON.parse(event.body);

    if (!phoneNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing phone number' }),
      };
    }

    let textMessage = message;

    // If the request is for "join", calculate position
    if (type === 'join' && docId) {
      const snapshot = await db.collection('queue').orderBy('createdAt').get();

      let position = 0;
      for (const doc of snapshot.docs) {
        if (doc.id === docId) break;
        if (doc.data().status !== 'served') {
          position++;
        }
      }

      textMessage = `You're now in the queue! There are ${position} people ahead of you.`;
    }

    // If message is still missing at this point
    if (!textMessage) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message content' }),
      };
    }

    const response = await client.messages.create({
      body: textMessage,
      from: twilioNumber,
      to: phoneNumber,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sid: response.sid }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
