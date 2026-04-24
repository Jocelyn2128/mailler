const express = require('express');
const path = require('path');
const { sendEmail, getEmailTemplate, getDefaultTemplate, reloadTemplate } = require('./mailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

/**
 * Route GET /template - Retourner le contenu du template.html
 */
app.get('/template', (req, res) => {
  const template = getDefaultTemplate();
  if (!template) {
    return res.status(404).json({
      success: false,
      message: 'Template non trouvé. Assurez-vous que template.html existe.',
    });
  }

  res.json({
    success: true,
    message: 'Template chargé avec succès',
    template: template,
  });
});

/**
 * Route GET / - Page d'accueil
 */
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Mailer Service</h1>
    <p>Service d'envoi d'email HTML avec Nodemailer + Express</p>
    <hr>
    <h3>Exemple d'utilisation (POST /send-email):</h3>
    <pre>
{
  "to": "angenieariliva@gmail.com",
  "subject": "Bienvenue!",
  "firstName": "Jean",
  "message": "Merci de vous être inscrit à notre service.",
  "buttonUrl": "https://example.com/activate",
  "buttonText": "Activer mon compte"
}
    </pre>
  `);
});

/**
 * Route POST /send-email - Envoie un email HTML
 */
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, firstName, message, buttonUrl, buttonText } = req.body;

    // Validation
    if (!to || !subject || !firstName || !message || !buttonUrl) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants. Requis: to, subject, firstName, message, buttonUrl',
      });
    }

    // Générer le template HTML
    const htmlContent = getEmailTemplate(
      firstName,
      message,
      buttonUrl,
      buttonText || 'Cliquez ici'
    );

    // Envoyer l'email
    await sendEmail(to, subject, htmlContent);

    res.json({
      success: true,
      message: 'Email envoyé avec succès',
      recipient: to,
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Route POST /send-email-custom - Envoie un email avec HTML personnalisé
 */
app.post('/send-email-custom', async (req, res) => {
  try {
    const { to, subject, html, cc } = req.body;

    console.log('📨 [Serveur] Requête reçue:', { to, subject, cc, htmlLength: html?.length });

    // Validation
    if (!to || !subject || !html) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants. Requis: to, subject, html',
      });
    }

    // Envoyer l'email avec CC optionnel
    await sendEmail(to, subject, html, cc);

    res.json({
      success: true,
      message: 'Email personnalisé envoyé avec succès',
      recipient: to,
      ccSent: cc ? true : false,
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Route GET /template - Vérifier le statut du template par défaut
 */
app.get('/template', (req, res) => {
  const template = getDefaultTemplate();
  if (!template) {
    return res.status(404).json({
      success: false,
      message: 'Template par défaut non trouvé',
    });
  }

  res.json({
    success: true,
    message: 'Template chargé avec succès',
    templateSize: `${(template.length / 1024).toFixed(2)} KB`,
    previewLength: 500,
    preview: template.substring(0, 500) + '...',
  });
});

/**
 * Route POST /send-email-template - Envoie un email avec le template par défaut
 */
app.post('/send-email-template', async (req, res) => {
  try {
    const { to, subject, cc } = req.body;

    console.log('📨 [Serveur] Envoi avec template par défaut:', { to, subject, cc });

    // Validation
    if (!to || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Paramètres manquants. Requis: to, subject',
      });
    }

    // Obtenir le template par défaut
    const template = getDefaultTemplate();
    if (!template) {
      return res.status(500).json({
        success: false,
        error: 'Template par défaut non disponible. Veuillez recharger.',
      });
    }

    // Envoyer l'email avec le template
    await sendEmail(to, subject, template, cc);

    res.json({
      success: true,
      message: 'Email envoyé avec le template par défaut',
      recipient: to,
      ccSent: cc ? true : false,
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Route POST /reload-template - Recharger le template depuis le fichier
 */
app.post('/reload-template', (req, res) => {
  try {
    const reloadedTemplate = reloadTemplate();
    if (!reloadedTemplate) {
      return res.status(500).json({
        success: false,
        error: 'Impossible de recharger le template',
      });
    }

    res.json({
      success: true,
      message: 'Template rechargé avec succès',
      templateSize: `${(reloadedTemplate.length / 1024).toFixed(2)} KB`,
    });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Démarrage du serveur
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Serveur Mailer démarré sur http://localhost:${PORT}`);
  console.log(`📧 Email configuré: ${process.env.EMAIL_USER}`);
  console.log('\n✨ Routes disponibles:');
  console.log('   GET  /template                 - Vérifier le template par défaut');
  console.log('   POST /send-email               - Envoyer avec template dynamique');
  console.log('   POST /send-email-custom        - Envoyer HTML personnalisé');
  console.log('   POST /send-email-template      - Envoyer avec le template par défaut 🆕');
  console.log('   POST /reload-template          - Recharger le template depuis le fichier 🆕');
  console.log('\n');
});
