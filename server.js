// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const SibApiV3Sdk = require('sib-api-v3-sdk'); // API de Brevo (Sendinblue)

const app = express();
app.use(express.json());
app.use(cors());

// Configuration de l'API Brevo (Sendinblue)
var defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Utilisation de la clé API dans .env

// Instance de l'API pour envoyer un email
var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

app.post('/send-email', (req, res) => {
  const { qrCodeUrl, recipientEmail } = req.body;

  // Crée l'email avec le QR Code
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail = {
    to: [{
      email: recipientEmail,
      name: 'Destinataire', // Nom du destinataire (facultatif)
    }],
    sender: {
      email: 'souleydse@gmail.com',  // Remplace par ton email validé dans Brevo
      name: 'souley', // Nom de l'expéditeur
    },
    subject: 'Voici votre QR Code',
    htmlContent: `<p>Bonjour,</p><p>Voici votre QR Code :</p><img src="${qrCodeUrl}" alt="QR Code" />`,
  };

  // Envoi de l'email via l'API Brevo
  apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
    console.log('Email envoyé avec succès:', data);
    res.status(200).json({ message: 'Email envoyé avec succès' });
  }, function(error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  });
});

// Lancer le serveur
app.listen(5000, () => {
  console.log('Serveur en écoute sur le port 5000');
});
