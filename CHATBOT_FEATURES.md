# 🤖 AVS AI Chatbot - Documentation Complète

## Vue d'ensemble

Le chatbot AVS est un assistant conversationnel intelligent, multilingue et hautement personnalisable, conçu pour offrir une expérience utilisateur exceptionnelle sur la plateforme AVS.ma.

## 🎯 Fonctionnalités Principales

### 1. **Persistance des Conversations**
- ✅ Sauvegarde automatique de toutes les conversations
- ✅ Support des utilisateurs authentifiés et anonymes
- ✅ Historique complet accessible à tout moment
- ✅ Synchronisation en temps réel avec la base de données

**Tables concernées:**
- `chatbot_conversations` - Stockage des conversations
- `chatbot_messages` - Stockage des messages
- `chatbot_analytics` - Événements et statistiques

### 2. **Support Multilingue**
- 🇫🇷 **Français** - Langue par défaut
- 🇲🇦 **Arabe** - Support complet RTL
- 🇬🇧 **Anglais** - Traductions complètes

**Fonctionnalités:**
- Détection automatique de la langue du navigateur
- Sélecteur de langue intégré
- Sauvegarde de la préférence linguistique
- Interface adaptée à chaque langue

### 3. **Analytics Avancés**
- 📊 Tableau de bord administrateur complet
- 📈 Statistiques en temps réel:
  - Nombre total de conversations
  - Messages échangés
  - Utilisateurs actifs (7 derniers jours)
  - Moyenne messages/conversation
  - Top 5 des événements

**Événements trackés:**
- `chatbot_opened` - Ouverture du chatbot
- `chatbot_closed` - Fermeture du chatbot
- `message_sent` - Envoi d'un message
- `quick_reply_clicked` - Clic sur réponse rapide
- `contact_action` - Action de contact
- `conversation_started` - Nouvelle conversation
- `file_uploaded` - Upload de fichier

### 4. **Upload de Fichiers**
- 📎 Support des types:
  - Images: JPEG, PNG, GIF, WebP
  - Documents: PDF
- 📏 Limite: 5 MB par fichier
- 🔐 Stockage sécurisé dans Supabase Storage
- 🎨 Prévisualisation des fichiers

**Bucket Supabase:** `chatbot-uploads`

### 5. **Réponses Rapides Contextuelles**
- 🎯 Suggestions adaptées au rôle de l'utilisateur:
  - **Visiteur**: Formations, Frais, Inscription, Contact
  - **Étudiant**: Emploi du temps, Notes, Ressources
  - **Professeur**: Classes, Évaluations, Statistiques
  - **Admin**: Gestion, Tableaux de bord, Paramètres

### 6. **Actions de Contact Directes**
- 📞 **Téléphone**: +212 5 24 31 19 82
- 💬 **WhatsApp**: +212 6 62 63 29 53
- 📧 **Email**: info@avs.ma, admissions@avs.ma
- 🏢 **Adresse**: Avenue Allal El Fassi, Marrakech

### 7. **Gestion de l'Historique**
- 📚 Liste complète des conversations passées
- 🔍 Recherche et filtrage
- 📅 Tri par date
- 🗑️ Suppression de conversations
- 🆕 Création de nouvelles conversations

### 8. **Notifications**
- 🔔 Notifications sonores (optionnelles)
- 🌐 Notifications navigateur
- ⚙️ Paramètres personnalisables

### 9. **Raccourcis Clavier**
- `Ctrl/Cmd + K` - Ouvrir/Fermer le chatbot
- `Ctrl/Cmd + N` - Nouvelle conversation
- `Ctrl/Cmd + /` - Focus sur l'input
- `Escape` - Fermer le chatbot

### 10. **Interface Utilisateur**
- 🎨 Design moderne et élégant
- 📱 Responsive (mobile, tablet, desktop)
- 🌓 Support mode sombre
- ⚡ Animations fluides
- 💬 Indicateur de frappe en temps réel
- 📝 Support Markdown dans les réponses

## 🏗️ Architecture Technique

### Hooks Personnalisés

```typescript
useChatbotAnalytics()      // Tracking des événements
useChatbotPersistence()    // Gestion base de données
useChatbotLanguage()       // Support multilingue
useChatbotFileUpload()     // Upload de fichiers
useChatbotNotifications()  // Notifications
useChatbotKeyboardShortcuts() // Raccourcis clavier
```

### Composants

```typescript
<AIChatbot />                    // Composant principal
<ChatMessage />                  // Affichage d'un message
<TypingIndicator />              // Indicateur de frappe
<ConversationHistoryPanel />     // Panneau historique
<ChatbotSettings />              // Paramètres
<QuickActions />                 // Actions rapides
<ChatbotAnalyticsDashboard />    // Dashboard admin
<ChatbotManagement />            // Gestion complète
```

### Utilitaires

```typescript
chatbotUtils.ts  // Fonctions utilitaires
├── generateConversationTitle()
├── formatMessageTime()
├── sanitizeInput()
├── isSupportedFileType()
├── groupConversationsByDate()
└── playNotificationSound()
```

## 📊 Schéma de Base de Données

### Table: chatbot_conversations
```sql
- id (UUID, PK)
- user_id (UUID, FK) - Nullable pour anonymes
- visitor_id (TEXT) - ID temporaire pour anonymes
- title (TEXT)
- language (TEXT) - 'fr', 'ar', 'en'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_message_at (TIMESTAMP)
- metadata (JSONB)
```

### Table: chatbot_messages
```sql
- id (UUID, PK)
- conversation_id (UUID, FK)
- role (TEXT) - 'user', 'assistant', 'system'
- content (TEXT)
- metadata (JSONB)
- created_at (TIMESTAMP)
```

### Table: chatbot_analytics
```sql
- id (UUID, PK)
- conversation_id (UUID, FK)
- user_id (UUID, FK) - Nullable
- event_type (TEXT)
- event_data (JSONB)
- created_at (TIMESTAMP)
```

## 🔐 Sécurité

### Row Level Security (RLS)
- ✅ Activé sur toutes les tables
- ✅ Utilisateurs voient uniquement leurs conversations
- ✅ Support visiteurs anonymes sécurisé
- ✅ Admins ont accès complet

### Politiques de Stockage
- ✅ Upload public pour faciliter l'expérience
- ✅ Limite de taille fichier: 5 MB
- ✅ Types de fichiers restreints
- ✅ Nettoyage automatique des anciens fichiers

## 📱 Interface Mobile

- Touch-optimisé
- Gestes intuitifs
- Clavier virtuel adapté
- Safe areas respectées
- Performance optimisée

## 🚀 Performance

- Streaming en temps réel des réponses
- Chargement lazy des conversations
- Cache intelligent
- Optimisation des requêtes DB
- Debouncing sur les inputs

## 🎨 Personnalisation

### Couleurs et Thème
```css
--chatbot-primary: hsl(var(--academy-blue))
--chatbot-secondary: hsl(var(--academy-purple))
--chatbot-accent: hsl(var(--academy-lightblue))
```

### Paramètres Disponibles
- Langue de l'interface
- Sons activés/désactivés
- Taille du texte (12-18px)
- Notifications

## 📈 Analytics Dashboard

### Métriques Disponibles
1. **Conversations**
   - Total
   - Actives (7j)
   - Par langue
   - Par rôle utilisateur

2. **Messages**
   - Total échangés
   - Moyenne par conversation
   - Distribution temporelle
   - Temps de réponse

3. **Engagement**
   - Utilisateurs actifs
   - Taux de retour
   - Quick replies utilisées
   - Actions de contact

4. **Performance**
   - Temps de réponse AI
   - Taux de satisfaction
   - Erreurs
   - Uptime

## 🔧 Administration

### Panneau Admin (`/admin/chatbot`)
- 📊 Vue d'ensemble des statistiques
- 💬 Liste des conversations récentes
- ⚙️ Configuration du chatbot
- 📥 Export des données (JSON)
- 🗑️ Nettoyage des anciennes conversations
- 🔧 Gestion du prompt système

### Export de Données
Format: JSON
Contient:
- Toutes les conversations
- Messages associés
- Métadonnées
- Timestamps

## 🌐 Intégration AI

### Edge Function: `/functions/v1/chat`
- Streaming via Server-Sent Events
- Support multilingue
- Gestion des erreurs (429, 402)
- Rate limiting
- Context awareness

### Prompt Système
```
Tu es un assistant virtuel intelligent pour AVS.ma, 
une plateforme éducative marocaine.
Tu réponds en français de manière professionnelle, 
claire et concise.

CONTACT INFORMATION:
- Téléphone: +212 5 24 31 19 82
- WhatsApp: +212 6 62 63 29 53
- Email: info@avs.ma
...
```

## 🐛 Gestion des Erreurs

### Erreurs Gérées
- 429 - Rate limit → Message utilisateur
- 402 - Payment required → Alerte admin
- 500 - Server error → Fallback gracieux
- Network errors → Retry automatique

### Logging
- Tous les événements trackés
- Erreurs loguées côté serveur
- Analytics en temps réel

## 📦 Installation et Configuration

### Prérequis
- Supabase project configuré
- Edge function `chat` déployée
- Storage bucket `chatbot-uploads` créé
- Variables d'environnement configurées

### Migration Base de Données
```bash
# Déjà exécuté dans le projet
- Tables chatbot_* créées
- RLS policies appliquées
- Triggers configurés
- Indexes optimisés
```

### Configuration Edge Function
```toml
[functions.chat]
verify_jwt = false  # Public access
```

## 🎯 Roadmap Futures Fonctionnalités

### Phase 11: Voice Input
- 🎤 Reconnaissance vocale
- 🔊 Réponses audio
- 🌍 Support multilingue vocal

### Phase 12: Smart Suggestions
- 🤖 ML-based suggestions
- 📊 Analyse de sentiment
- 🎯 Prédiction des besoins

### Phase 13: Integration Hub
- 📅 Calendrier
- 📧 Email integration
- 💰 Paiements

### Phase 14: Advanced Analytics
- 📈 Dashboards personnalisés
- 🔮 Prédictions
- 📊 A/B testing

## 📞 Support

Pour toute question ou problème:
- 📧 Email: support@avs.ma
- 💬 WhatsApp: +212 6 62 63 29 53
- 📞 Téléphone: +212 5 24 31 19 82

---

**Développé avec ❤️ pour AVS.ma**
**Version: 2.0.0**
**Dernière mise à jour: 2025**
