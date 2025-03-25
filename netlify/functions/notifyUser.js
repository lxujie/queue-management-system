const twilio = require('twilio');

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

// Initialize Twilio client
const client = twilio(accountSid, authToken);

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse request body
    const { phoneNumber, message } = JSON.parse(event.body);

    console.log('Received phoneNumber:', phoneNumber);
    console.log('Received message:', message);
    console.log('Twilio FROM number:', twilioNumber);
    console.log('Twilio authToken:', authToken);
    console.log('Twilio accountSid:', accountSid);

    // Validate required fields
    if (!phoneNumber || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing phone number or message' }),
      };
    }

    // Validate environment variables
    if (!accountSid || !authToken || !twilioNumber) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing Twilio environment variables' }),
      };
    }

    // Validate phone number format
    if (!twilioNumber.startsWith('+') || !phoneNumber.startsWith('+')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Phone numbers must start with "+" (E.164 format)' }),
      };
    }

    // Send SMS via Twilio
    const twilioResponse = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: phoneNumber,
    });

    console.log('Twilio message sent successfully:', twilioResponse.sid);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sid: twilioResponse.sid }),
    };
  } catch (err) {
    console.error('Twilio error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
