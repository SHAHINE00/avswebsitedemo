-- Phase 1 & 4: Enhance Knowledge Base with Navigation and CRM-Specific Guidance

-- Admin CRM Navigation
INSERT INTO knowledge_base (title, content, keywords, role_access, priority, category) VALUES
('Student CRM Dashboard', 
'Le **CRM Étudiants** se trouve dans **Admin → Onglet Étudiants**. 

Vous y trouverez:
- 📊 Tableau de bord avec statistiques étudiants
- 🎯 Segmentation automatique (actifs, à risque, inactifs)
- ✉️ Communication Center pour emails personnalisés
- 📝 Historique des interactions
- ⚡ Actions en masse (inscription, envoi emails)

**Pour y accéder:** Allez sur /admin puis cliquez sur l''onglet "Étudiants"',
ARRAY['crm', 'étudiants', 'gestion', 'dashboard', 'admin'], 
ARRAY['admin'::app_role], 10, 'navigation'),

('Créer des templates email',
'Pour créer un **template email**:

1️⃣ **Admin → Étudiants → Communication Center**
2️⃣ Section "Templates Email"
3️⃣ Cliquez "Créer Template"
4️⃣ Donnez un nom, sujet, et corps
5️⃣ Utilisez les variables: {{student_name}}, {{student_email}}
6️⃣ Le template sera disponible pour envois futurs

**Chemin:** /admin → Onglet Étudiants → Communication Center',
ARRAY['email', 'template', 'communication', 'message', 'créer'], 
ARRAY['admin'::app_role], 9, 'crm'),

('Envoyer des emails en masse',
'Pour **envoyer des emails aux étudiants**:

1️⃣ **Admin → Étudiants → Communication Center**
2️⃣ Sélectionnez les étudiants (cochez ou "Sélectionner tout")
3️⃣ Rédigez votre message ou choisissez un template
4️⃣ Variables disponibles: {{student_name}}, {{student_email}}, {{date}}
5️⃣ Cliquez "Envoyer" - Emails envoyés via Hostinger
6️⃣ Toast confirmera l''envoi réussi

**Chemin:** /admin → Onglet Étudiants → Communication Center',
ARRAY['email', 'masse', 'bulk', 'envoyer', 'communication', 'groupe'], 
ARRAY['admin'::app_role], 10, 'crm'),

('Comprendre les segments étudiants',
'Les **segments** sont des groupes automatiques d''étudiants:

- **🟢 Actifs:** Connectés récemment, progression régulière
- **🟡 À Risque:** Pas de connexion depuis 7+ jours, progression stagnante
- **🔴 Inactifs:** Aucune activité depuis 30+ jours
- **🆕 Nouveaux:** Inscrits depuis moins de 7 jours

**Utilisez** les segments pour cibler vos communications et suivis.

**Localisation:** /admin → Étudiants → Student CRM Dashboard',
ARRAY['segment', 'groupe', 'actifs', 'risque', 'inactifs', 'étudiants'], 
ARRAY['admin'::app_role], 9, 'crm'),

-- Admin Navigation Paths
('Navigation Admin - Vue d''ensemble',
'**Dashboard Admin** - Vue d''ensemble générale:

📊 **Vue d''ensemble:** /admin (onglet par défaut)
- Statistiques globales
- Activité récente
- Métriques clés

👥 **Gestion Étudiants (CRM):** /admin → Onglet Étudiants
👨‍🏫 **Gestion Professeurs:** /admin → Onglet Professeurs
📚 **Gestion Cours:** /admin → Onglet Cours
🏫 **Classes:** /admin → Onglet Classes
👤 **Utilisateurs:** /admin → Onglet Utilisateurs
📄 **Documents:** /admin → Onglet Documents
📅 **Rendez-vous:** /admin → Onglet Rendez-vous
📈 **Analytics:** /admin → Onglet Analytics
🔒 **Sécurité:** /admin → Onglet Sécurité',
ARRAY['admin', 'dashboard', 'navigation', 'accès', 'menu'], 
ARRAY['admin'::app_role], 8, 'navigation'),

-- Professor Navigation
('Gérer mes cours - Professeur',
'**Gestion des cours pour professeurs:**

📚 **Mon Dashboard:** /professor
- Vue d''ensemble de mes cours
- Statistiques d''activité

➕ **Créer un cours:** Dashboard → Bouton "Créer un nouveau cours"

👥 **Voir les étudiants:** Sélectionner un cours → Onglet Étudiants

📝 **Gérer les notes:** Cours sélectionné → Onglet Notes',
ARRAY['cours', 'professeur', 'créer', 'gérer', 'notes', 'étudiants'], 
ARRAY['professor'::app_role], 9, 'navigation'),

-- Student Navigation
('S''inscrire à un cours',
'**Pour s''inscrire à une formation:**

1️⃣ Allez sur **/curriculum** (Catalogue des formations)
2️⃣ Parcourez les cours disponibles
3️⃣ Cliquez sur un cours pour voir les détails
4️⃣ Cliquez sur le bouton **"S''inscrire"**
5️⃣ Confirmez votre inscription
6️⃣ Le cours apparaîtra dans **votre Dashboard** (/student ou /dashboard)

**Suivre ma progression:** Dashboard → Onglet "Mes Cours"',
ARRAY['inscription', 'cours', 'étudiant', 'inscrire', 'formation', 'enrollment'], 
ARRAY['student'::app_role], 10, 'navigation'),

('Mon espace étudiant',
'**Navigation Étudiant:**

🏠 **Mon Dashboard:** /student ou /dashboard
- Vue d''ensemble de ma progression
- Statistiques personnelles

📚 **Mes cours:** Dashboard → Onglet "Mes Cours"
📊 **Ma progression:** Dashboard → Cartes de progression
📅 **Mes rendez-vous:** Dashboard → Onglet "Rendez-vous"
🗂️ **Catalogue:** /curriculum (pour découvrir et s''inscrire)',
ARRAY['dashboard', 'étudiant', 'cours', 'progression', 'rendez-vous'], 
ARRAY['student'::app_role], 8, 'navigation'),

-- Visitor/Public Navigation (no role restriction)
('Découvrir les formations',
'**Navigation pour visiteurs:**

📚 **Catalogue des formations:** /curriculum
- Parcourez tous les cours disponibles
- Filtrez par catégorie

ℹ️ **À propos:** /about (Informations sur AVS.ma)
📞 **Contact:** /contact
📅 **Prendre rendez-vous:** /appointment
💬 **Témoignages:** /testimonials
📝 **Blog/Ressources:** /blog
🔐 **S''inscrire/Se connecter:** /auth',
ARRAY['formations', 'catalogue', 'visiteur', 'découvrir', 'inscription'], 
NULL, 9, 'navigation'),

-- Common Tasks
('Créer un professeur',
'**Pour créer un nouveau professeur:**

1️⃣ Allez dans **Admin → Onglet Professeurs**
2️⃣ Cliquez sur **"Nouveau Professeur"**
3️⃣ Remplissez les informations:
   - Nom et prénom
   - Email professionnel
   - Spécialité
4️⃣ Cliquez sur **"Créer"**
5️⃣ Le professeur recevra un email d''invitation

**Chemin:** /admin → Professeurs → Nouveau Professeur',
ARRAY['professeur', 'créer', 'ajouter', 'nouveau', 'enseignant'], 
ARRAY['admin'::app_role], 8, 'action'),

('Créer un nouveau cours',
'**Pour créer un cours:**

**Admin:** /admin → Onglet Cours → Bouton "Créer un cours"
**Professeur:** /professor → Bouton "Créer un nouveau cours"

**Informations requises:**
- Titre du cours
- Description
- Catégorie
- Niveau (débutant, intermédiaire, avancé)
- Modules et leçons

**Après création:** Le cours sera visible dans le catalogue /curriculum',
ARRAY['cours', 'créer', 'nouveau', 'formation', 'ajouter'], 
ARRAY['admin'::app_role, 'professor'::app_role], 9, 'action');