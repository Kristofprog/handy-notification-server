const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json'); // Your downloaded file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
app.use(express.json());

app.post('/send-notification', async (req, res) => {
  const { receiverFcmToken, title, body } = req.body;

  if (!receiverFcmToken) {
    return res.status(400).send('Missing token');
  }

  const message = {
    token: receiverFcmToken,
    notification: {
      title: title,
      body: body
    }
  };

  try {
    await admin.messaging().send(message);
    res.status(200).send('Sent');
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send(error.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});