/**
 * Exemple d'utilisation locale du mailer
 * Exécuter: node example.js
 */

const { sendEmail, getEmailTemplate } = require('./mailer');
require('dotenv').config();

async function main() {
  try {
    console.log('🔄 Envoi d\'un email de test...\n');

    // Données de l'email
    const to = 'destinataire@example.com'; // À remplacer
    const subject = 'Bienvenue sur notre plateforme! 🎉';
    const firstName = 'Jean';
    const message = `
      Nous sommes heureux de vous accueillir!<br><br>
      Votre compte a été créé avec succès. 
      Cliquez sur le bouton ci-dessous pour activer votre compte 
      et commencer à utiliser nos services.
    `;
    const buttonUrl = 'https://example.com/activate/abc123';
    const buttonText = 'Activer mon compte';

    // Générer le HTML
    const htmlContent = getEmailTemplate(firstName, message, buttonUrl, buttonText);

    // Envoyer l'email
    const result = await sendEmail(to, subject, htmlContent);

    console.log('\n✨ Email envoyé avec succès!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('\n⚠️  Une erreur s\'est produite:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error(error.message);
    console.error('\nVérifiez que:');
    console.error('  1. Votre .env contient EMAIL_USER et EMAIL_PASS');
    console.error('  2. Vous avez activé "Mots de passe d\'application" dans Gmail');
    console.error('  3. L\'email de destination existe');
  }
}

main();
