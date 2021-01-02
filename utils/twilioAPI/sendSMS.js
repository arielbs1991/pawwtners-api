//I think the phone number twilio provided for testing has expired

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = require('twilio')(accountSid, authToken);

// //TODO: test, then create variables for user message body and numbers
// const sendSMS = client.messages
//     .create({
//         body: 'You smell nice. Tell me a story, please.',
//         from: '+14159361408',
//         to: '+12063886228'
//     })
//     .then(message => console.log(message.sid))
//     .catch(err => {
//         console.log(err);
//         status(500).end();
//     })

// module.exports = sendSMS;