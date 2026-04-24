# 📧 Mailer Service - Nodemailer + Express

Un système complet pour envoyer des emails HTML via Gmail avec Node.js, Nodemailer et Express.

## 🚀 Configuration Gmail

### Étape 1: Activer les mots de passe d'application

1. Allez sur [myaccount.google.com/security](https://myaccount.google.com/security)
2. **Authentification à 2 facteurs** → Activez-la si ce n'est pas fait
3. **Mots de passe d'application** → Sélectionnez "Mail" et "Windows/Mac/Linux"
4. Copiez le mot de passe généré (16 caractères)

### Étape 2: Configuration du .env

Modifiez le fichier `.env` avec vos données:

```env
EMAIL_USER=votre_email@gmail.com
EMAIL_PASS=votre_mot_de_passe_app_gmail
PORT=3000
```

⚠️ **Ne pas commiter le .env en production!**

## 📁 Fichiers du projet

- **mailer.js** - Module Nodemailer avec:
  - `sendEmail(to, subject, html)` - Envoie l'email
  - `getEmailTemplate(...)` - Génère un template HTML moderne

- **server.js** - Serveur Express avec:
  - `POST /send-email` - Envoi avec template
  - `POST /send-email-custom` - Envoi HTML personnalisé

- **example.js** - Exemple d'utilisation locale

## 🎯 Utilisation

### Option 1: Via l'API Express

Démarrer le serveur:
```bash
node server.js
```

Envoyer un email (cURL):
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "destinataire@example.com",
    "subject": "Bienvenue!",
    "firstName": "Jean",
    "message": "Merci de vous être inscrit.",
    "buttonUrl": "https://example.com/activate",
    "buttonText": "Activer"
  }'
```

Réponse (succès):
```json
{
  "success": true,
  "message": "Email envoyé avec succès",
  "recipient": "destinataire@example.com"
}
```

### Option 2: Via le module directement

```javascript
const { sendEmail, getEmailTemplate } = require('./mailer');

const html = getEmailTemplate(
  'Jean',
  'Merci de votre inscription!',
  'https://example.com/activate'
);

await sendEmail('user@example.com', 'Bienvenue', html);
```

### Option 3: Script d'exemple

```bash
node example.js
```

## 📨 Fonctionnalités

### ✅ Template moderne avec:
- Gradient violet dégradé
- Bouton CTA élégant
- Styles inline (compatible tous les clients)
- Design responsive
- Footer avec lien de désabonnement

### ✅ Sécurité:
- Variables d'environnement via dotenv
- Pas de données sensibles en dur
- Async/await pour gestion propre

### ✅ Logs détaillés:
```
✅ Email envoyé avec succès
   À: user@example.com
   Sujet: Bienvenue
   Message ID: <id@gmail.com>
```

## 🔧 Personnalisation

### Modifier le template

Éditez `getEmailTemplate()` dans `mailer.js`:

```javascript
const html = `
  <h1>Votre titre</h1>
  <p>Votre contenu</p>
  <a href="...">Bouton</a>
`;
```

### Ajouter des pièces jointes

```javascript
const mailOptions = {
  from: process.env.EMAIL_USER,
  to,
  subject,
  html,
  attachments: [
    {
      filename: 'document.pdf',
      path: './uploads/document.pdf'
    }
  ]
};
```

## ⚠️ Dépannage

### "Invalid login: 535-5.7.8"
→ Vérifiez votre mot de passe d'application Gmail (16 caractères)

### "Authenticate using app passwords"
→ Activez la vérification en 2 étapes dans Gmail

### "nodemailer not found"
```bash
npm install
```

## 📦 Dépendances

- **express** ^5.2.1 - Framework web
- **nodemailer** ^8.0.5 - Envoi d'emails
- **dotenv** ^17.4.2 - Variables d'environnement

## 💡 Exemple complet d'intégration

```javascript
app.post('/register', async (req, res) => {
  const { email, name } = req.body;
  
  try {
    // Créer l'utilisateur...
    
    // Envoyer email de bienvenue
    const html = getEmailTemplate(
      name,
      'Activez votre compte pour commencer',
      `https://app.com/activate/${token}`
    );
    
    await sendEmail(email, 'Bienvenue!', html);
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

**Happy emailing! 📧✨**
