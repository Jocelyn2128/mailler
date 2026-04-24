const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration du transporteur Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Charger le template au démarrage
let defaultTemplate = null;

function loadDefaultTemplate() {
  try {
    const templatePath = path.join(__dirname, 'template.html');
    defaultTemplate = fs.readFileSync(templatePath, 'utf-8');
    console.log('✅ [Mailer] Template HTML chargé par défaut (template.html)');
    return defaultTemplate;
  } catch (error) {
    console.error('❌ [Mailer] Erreur lors du chargement du template:', error.message);
    return null;
  }
}

// Charger le template au module load
loadDefaultTemplate();

/**
 * Envoie un email HTML
 * @param {string} to - Adresse email du destinataire
 * @param {string} subject - Sujet de l'email
 * @param {string} htmlContent - Contenu HTML de l'email
 * @param {string} cc - Adresse CC (optionnel)
 * @returns {Promise<void>}
 */
async function sendEmail(to, subject, htmlContent, cc = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    // Ajouter CC si fourni
    if (cc) {
      mailOptions.cc = cc;
      console.log('🔗 [Mailer] CC ajouté au mailOptions:', cc);
    } else {
      console.log('⚠️  [Mailer] Pas de CC fourni');
    }

    console.log('📧 [Mailer] mailOptions complètes:', {
      from: mailOptions.from,
      to: mailOptions.to,
      cc: mailOptions.cc || 'none',
      subject: mailOptions.subject
    });

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès');
    console.log(`   À: ${to}`);
    if (cc) console.log(`   CC: ${cc}`);
    console.log(`   Sujet: ${subject}`);
    console.log(`   Message ID: ${result.messageId}`);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:');
    console.error(`   ${error.message}`);
    throw error;
  }
}

/**
 * Template HTML modern avec bouton
 * @param {string} firstName - Prénom du destinataire
 * @param {string} message - Message principal
 * @param {string} buttonUrl - URL du bouton CTA
 * @param {string} buttonText - Texte du bouton
 * @returns {string} HTML formaté
 */
function getEmailTemplate(firstName, message, buttonUrl, buttonText = 'Cliquez ici') {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <!-- Container principal -->
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
        
        <!-- Header avec gradient -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Bonjour ${firstName}! 👋</h1>
        </div>

        <!-- Contenu principal -->
        <div style="padding: 40px 30px;">
          <!-- Message -->
          <p style="font-size: 16px; line-height: 1.6; color: #333333; margin: 0 0 25px 0;">
            ${message}
          </p>

          <!-- Bouton CTA -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${buttonUrl}" style="display: inline-block; padding: 14px 35px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);">
              ${buttonText}
            </a>
          </div>

          <!-- Ligne séparatrice -->
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">

          <!-- Footer -->
          <p style="font-size: 14px; color: #999999; margin: 0; text-align: center;">
            Cet email a été envoyé depuis votre application mailer.<br>
            <a href="#" style="color: #667eea; text-decoration: none;">Se désabonner</a>
          </p>
        </div>
      </div>

      <!-- Espacement -->
      <div style="height: 20px;"></div>
    </body>
    </html>
  `;
}

/**
 * Obtient le template par défaut chargé depuis le fichier
 * @returns {string|null} Template HTML ou null si non trouvé
 */
function getDefaultTemplate() {
  return defaultTemplate;
}

/**
 * Recharge le template depuis le fichier (utile pour les modifications à chaud)
 * @returns {string|null} Template HTML reloadé
 */
function reloadTemplate() {
  console.log('🔄 [Mailer] Rechargement du template...');
  return loadDefaultTemplate();
}

module.exports = {
  sendEmail,
  getEmailTemplate,
  getDefaultTemplate,
  reloadTemplate,
  loadDefaultTemplate,
};
