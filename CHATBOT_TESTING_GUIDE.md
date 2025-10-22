# 🧪 Guide de Test du Chatbot AVS

## Tests Fonctionnels

### 1. Test de Base - Conversation Simple
**Objectif**: Vérifier que le chatbot répond correctement

**Étapes**:
1. Ouvrir la page d'accueil
2. Cliquer sur le bouton chatbot (en bas à droite)
3. Envoyer "Bonjour"
4. Vérifier que l'assistant répond en français
5. Poser une question: "Quelles formations proposez-vous ?"
6. Vérifier la réponse

**Résultat attendu**:
- ✅ Le chatbot s'ouvre
- ✅ Message de bienvenue affiché
- ✅ Réponse en streaming visible
- ✅ Réponse pertinente et en français

---

### 2. Test Multilingue
**Objectif**: Vérifier le support des 3 langues

**Étapes Français**:
1. Ouvrir chatbot
2. Langue par défaut = FR
3. Envoyer "Bonjour"
4. Vérifier réponse en français

**Étapes Arabe**:
1. Changer langue → AR (🇲🇦)
2. Envoyer "مرحبا"
3. Vérifier réponse en arabe
4. Vérifier alignement RTL

**Étapes Anglais**:
1. Changer langue → EN (🇬🇧)
2. Envoyer "Hello"
3. Vérifier réponse en anglais

**Résultat attendu**:
- ✅ Les 3 langues fonctionnent
- ✅ Interface adaptée à chaque langue
- ✅ Réponses cohérentes

---

### 3. Test de Persistance
**Objectif**: Vérifier la sauvegarde des conversations

**Étapes**:
1. Créer une nouvelle conversation
2. Envoyer plusieurs messages
3. Fermer le chatbot
4. Rafraîchir la page
5. Rouvrir le chatbot
6. Cliquer sur l'icône historique
7. Sélectionner la conversation précédente

**Résultat attendu**:
- ✅ Messages toujours présents après rafraîchissement
- ✅ Historique accessible
- ✅ Possibilité de reprendre la conversation

---

### 4. Test des Réponses Rapides
**Objectif**: Vérifier les suggestions contextuelles

**Étapes**:
1. Ouvrir chatbot (nouveau)
2. Observer les quick replies affichées
3. Cliquer sur "📚 Formations disponibles"
4. Vérifier l'envoi et la réponse
5. Observer si de nouvelles suggestions apparaissent

**Résultat attendu**:
- ✅ Quick replies visibles au démarrage
- ✅ Adaptées au rôle de l'utilisateur
- ✅ Fonctionnent correctement
- ✅ Nouvelles suggestions après réponse

---

### 5. Test des Actions de Contact
**Objectif**: Vérifier les actions directes

**Test Téléphone**:
1. Cliquer sur "📞 Appeler AVS"
2. Vérifier ouverture du dialer avec le bon numéro

**Test WhatsApp**:
1. Cliquer sur "💬 WhatsApp"
2. Vérifier ouverture de WhatsApp Web
3. Vérifier message pré-rempli

**Test Email**:
1. Cliquer sur "📧 Email"
2. Vérifier affichage des emails

**Résultat attendu**:
- ✅ Téléphone: +212 5 24 31 19 82
- ✅ WhatsApp: +212 6 62 63 29 53
- ✅ Emails affichés correctement

---

### 6. Test d'Upload de Fichiers
**Objectif**: Vérifier l'upload et le traitement

**Étapes**:
1. Ouvrir chatbot
2. Cliquer sur icône upload (📎)
3. Sélectionner une image JPG < 5MB
4. Attendre l'upload
5. Vérifier l'affichage
6. Demander à l'AI de décrire l'image

**Test fichier trop volumineux**:
1. Essayer d'upload un fichier > 5MB
2. Vérifier message d'erreur

**Test format non supporté**:
1. Essayer d'upload un .exe ou .zip
2. Vérifier message d'erreur

**Résultat attendu**:
- ✅ Upload réussi pour fichiers valides
- ✅ Erreurs appropriées pour fichiers invalides
- ✅ Fichier visible dans la conversation

---

### 7. Test de l'Historique
**Objectif**: Gérer plusieurs conversations

**Étapes**:
1. Créer 3 conversations différentes
2. Cliquer sur icône historique (⏱️)
3. Vérifier liste des conversations
4. Cliquer sur une conversation
5. Vérifier chargement des messages
6. Supprimer une conversation (🗑️)
7. Vérifier suppression

**Résultat attendu**:
- ✅ Toutes conversations listées
- ✅ Dates affichées correctement
- ✅ Changement de conversation fluide
- ✅ Suppression fonctionne

---

### 8. Test des Notifications
**Objectif**: Vérifier les notifications

**Étapes**:
1. Activer notifications dans paramètres
2. Minimiser le chatbot
3. Envoyer un message
4. Attendre réponse AI
5. Vérifier notification sonore
6. Vérifier notification navigateur (si autorisé)

**Résultat attendu**:
- ✅ Son joué à la réception
- ✅ Notification navigateur si autorisé
- ✅ Possibilité de désactiver

---

### 9. Test Raccourcis Clavier
**Objectif**: Vérifier les shortcuts

**Étapes**:
1. Page d'accueil
2. Appuyer `Ctrl+K` (ou `Cmd+K` Mac)
3. Vérifier ouverture chatbot
4. Appuyer `Ctrl+N`
5. Vérifier nouvelle conversation
6. Appuyer `Escape`
7. Vérifier fermeture

**Résultat attendu**:
- ✅ Ctrl+K ouvre/ferme
- ✅ Ctrl+N crée conversation
- ✅ Ctrl+/ focus input
- ✅ Escape ferme

---

### 10. Test Utilisateur Anonyme
**Objectif**: Fonctionnement sans authentification

**Étapes**:
1. Se déconnecter (ou mode navigation privée)
2. Ouvrir chatbot
3. Créer conversation
4. Envoyer messages
5. Fermer navigateur
6. Rouvrir
7. Vérifier si conversation persiste (visitor_id)

**Résultat attendu**:
- ✅ Fonctionne sans connexion
- ✅ Visitor_id créé automatiquement
- ✅ Conversations sauvegardées

---

### 11. Test Roles Utilisateurs
**Objectif**: Quick replies adaptées au rôle

**Test Visiteur**:
- Quick replies: Formations, Frais, Inscription

**Test Étudiant** (connexion requise):
- Quick replies: Emploi du temps, Notes, Ressources

**Test Professeur** (connexion requise):
- Quick replies: Classes, Évaluations, Statistiques

**Test Admin** (connexion requise):
- Quick replies: Gestion, Dashboard, Paramètres

**Résultat attendu**:
- ✅ Suggestions adaptées au rôle
- ✅ Contenu pertinent

---

### 12. Test Mobile
**Objectif**: Responsive et touch-friendly

**Étapes**:
1. Ouvrir sur mobile (ou DevTools mobile)
2. Cliquer sur chatbot
3. Vérifier interface adaptée
4. Scroller dans messages
5. Taper au clavier virtuel
6. Tester quick replies
7. Fermer chatbot

**Résultat attendu**:
- ✅ Interface adaptée mobile
- ✅ Touch gestures fonctionnent
- ✅ Clavier ne cache pas l'input
- ✅ Scrolling fluide

---

## Tests Administrateur

### 13. Test Dashboard Admin
**Objectif**: Vérifier les analytics

**Prérequis**: Compte admin

**Étapes**:
1. Se connecter en tant qu'admin
2. Aller sur `/admin/chatbot` (si route créée)
3. Vérifier statistiques:
   - Nombre conversations
   - Nombre messages
   - Utilisateurs actifs
   - Top événements
4. Tester export données
5. Tester nettoyage conversations

**Résultat attendu**:
- ✅ Dashboard accessible
- ✅ Statistiques correctes
- ✅ Export fonctionne (JSON)
- ✅ Nettoyage fonctionne

---

### 14. Test Export de Conversation
**Objectif**: Export utilisateur

**Étapes**:
1. Ouvrir une conversation avec messages
2. Cliquer sur menu export (si ajouté)
3. Exporter en JSON
4. Exporter en TXT
5. Exporter en HTML
6. Ouvrir les fichiers exportés

**Résultat attendu**:
- ✅ 3 formats disponibles
- ✅ Fichiers téléchargés
- ✅ Contenu correct et lisible

---

## Tests de Performance

### 15. Test Streaming
**Objectif**: Vérifier le streaming temps réel

**Étapes**:
1. Poser une longue question
2. Observer l'affichage token par token
3. Vérifier fluidité
4. Tester pendant streaming:
   - Scroll
   - Input désactivé
   - Indicateur de frappe

**Résultat attendu**:
- ✅ Tokens affichés progressivement
- ✅ Pas de lag
- ✅ UI responsive pendant streaming

---

### 16. Test Charge
**Objectif**: Comportement sous charge

**Étapes**:
1. Créer 10+ conversations
2. Envoyer 50+ messages
3. Vérifier performances
4. Tester historique avec beaucoup de conversations
5. Vérifier temps de chargement

**Résultat attendu**:
- ✅ Pas de ralentissement
- ✅ Historique charge rapidement
- ✅ Messages s'affichent vite

---

## Tests d'Erreurs

### 17. Test Erreur API
**Objectif**: Gestion erreurs réseau

**Simulation**:
1. Désactiver internet
2. Envoyer message
3. Observer erreur
4. Réactiver internet
5. Réessayer

**Résultat attendu**:
- ✅ Message d'erreur clair
- ✅ Possibilité de réessayer
- ✅ Pas de crash

---

### 18. Test Rate Limit
**Objectif**: Gestion 429

**Étapes**:
1. Envoyer rapidement 20+ messages
2. Observer si rate limit atteint
3. Vérifier message 429
4. Vérifier indicateur limite

**Résultat attendu**:
- ✅ Message clair sur rate limit
- ✅ Indicateur visible si proche limite
- ✅ Retry après délai

---

## Tests de Sécurité

### 19. Test XSS
**Objectif**: Protection contre injections

**Étapes**:
1. Envoyer: `<script>alert('xss')</script>`
2. Vérifier que le script ne s'exécute pas
3. Envoyer: `<img src=x onerror=alert('xss')>`
4. Vérifier sanitization

**Résultat attendu**:
- ✅ Pas d'exécution de code
- ✅ Contenu échappé correctement

---

### 20. Test RLS
**Objectif**: Sécurité base de données

**Étapes**:
1. Créer conversation avec User A
2. Se connecter avec User B
3. Essayer d'accéder conversation User A
4. Vérifier accès refusé

**Résultat attendu**:
- ✅ User B ne voit pas conversations de User A
- ✅ RLS appliquée correctement

---

## Checklist Finale

Avant la mise en production:

- [ ] Tous les tests fonctionnels passent
- [ ] Responsive mobile testé
- [ ] 3 langues fonctionnent
- [ ] Upload fichiers OK
- [ ] Persistance OK
- [ ] Analytics OK
- [ ] Sécurité OK
- [ ] Performances OK
- [ ] Erreurs gérées
- [ ] Documentation à jour

---

## Outils de Test

### Tests Manuels
- Chrome DevTools (mobile simulation)
- Network throttling
- Console pour logs

### Tests Automatisés (à implémenter)
```bash
# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Tests de charge
npm run test:load
```

---

## Signalement de Bugs

Format pour signaler un bug:

```
**Description**: [Description claire du bug]
**Étapes pour reproduire**:
1. Étape 1
2. Étape 2
3. ...

**Comportement attendu**: [Ce qui devrait se passer]
**Comportement observé**: [Ce qui se passe réellement]
**Navigateur**: [Chrome 120, Firefox 121, etc.]
**Appareil**: [Desktop, iPhone 14, etc.]
**Screenshots**: [Si applicable]
```

---

**Date du guide**: 2025
**Version testée**: 2.0.0
**Testeur**: _______________
