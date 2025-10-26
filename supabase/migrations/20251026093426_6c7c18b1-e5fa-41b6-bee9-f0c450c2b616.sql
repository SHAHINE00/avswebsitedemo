-- Phase 1: Add comprehensive knowledge base entries for all platform sections

-- Admin Dashboard Navigation (8 entries)
INSERT INTO knowledge_base (title, content, keywords, role_access, priority, category) VALUES
('Onglet Vue d''ensemble Admin', 
'L''onglet Vue d''ensemble Admin affiche des statistiques globales clés : nombre total d''étudiants actifs, cours disponibles, revenus mensuels, taux de satisfaction, et graphiques de croissance. Accédez via Admin → Vue d''ensemble ou /admin?tab=dashboard', 
ARRAY['vue d''ensemble', 'dashboard', 'statistiques', 'admin', 'overview', 'métriques'], 
ARRAY['admin']::app_role[], 8, 'admin_navigation'),

('Onglet Documents Admin', 
'L''onglet Documents Admin permet de gérer tous les fichiers : upload de supports de cours (PDF, vidéos), organisation par dossiers, partage avec étudiants/professeurs, contrôle de visibilité. Accédez via Admin → Documents ou /admin?tab=documents', 
ARRAY['documents', 'fichiers', 'upload', 'pdf', 'supports de cours', 'admin'], 
ARRAY['admin']::app_role[], 7, 'admin_navigation'),

('Onglet Abonnements Admin', 
'L''onglet Abonnements gère la newsletter : liste des abonnés, export CSV/Excel, statistiques d''engagement, gestion des désabonnements. Idéal pour campagnes marketing. Accédez via Admin → Abonnements ou /admin?tab=subscribers', 
ARRAY['abonnements', 'newsletter', 'subscribers', 'marketing', 'email', 'admin'], 
ARRAY['admin']::app_role[], 6, 'admin_navigation'),

('Onglet Visibilité Admin', 
'L''onglet Visibilité contrôle l''affichage dynamique du site web : show/hide sections homepage, activer/désactiver pages, gérer contenu public vs privé. Permet de personnaliser l''expérience visiteur. Accédez via Admin → Visibilité ou /admin?tab=visibility', 
ARRAY['visibilité', 'visibility', 'homepage', 'affichage', 'site web', 'admin'], 
ARRAY['admin']::app_role[], 7, 'admin_navigation'),

('Onglet Analytics Admin', 
'L''onglet Analytics Admin fournit des analyses approfondies : traffic du site (Google Analytics intégré), engagement par cours, taux de conversion visiteur→étudiant, performance des professeurs, revenus par cours. Accédez via Admin → Analytics ou /admin?tab=analytics', 
ARRAY['analytics', 'analyse', 'traffic', 'performance', 'conversion', 'statistiques', 'admin'], 
ARRAY['admin']::app_role[], 8, 'admin_navigation'),

('Onglet Système Admin', 
'L''onglet Système Admin permet le monitoring technique : santé des Edge Functions Supabase, logs d''erreurs, performance base de données, usage storage, alertes système. Pour les administrateurs techniques. Accédez via Admin → Système ou /admin?tab=system', 
ARRAY['système', 'system', 'monitoring', 'edge functions', 'logs', 'database', 'admin'], 
ARRAY['admin']::app_role[], 7, 'admin_navigation'),

('Onglet Utilisateurs Admin', 
'L''onglet Utilisateurs Admin gère tous les comptes : rôles et permissions (admin/professeur/étudiant), approbations en attente, désactivation de comptes, audit des actions. Différent de l''onglet Étudiants qui est CRM. Accédez via Admin → Utilisateurs ou /admin?tab=users', 
ARRAY['utilisateurs', 'users', 'rôles', 'permissions', 'comptes', 'admin'], 
ARRAY['admin']::app_role[], 8, 'admin_navigation'),

('Onglet Classes Admin', 
'L''onglet Classes Admin permet de créer et gérer des groupes d''étudiants : créer classe, assigner professeur, définir horaires/salles, ajouter/retirer étudiants, voir calendrier de classe. Essentiel pour l''organisation académique. Accédez via Admin → Classes ou /admin?tab=classes', 
ARRAY['classes', 'groupes', 'horaires', 'salles', 'organisation', 'admin'], 
ARRAY['admin']::app_role[], 8, 'admin_navigation'),

-- Student Dashboard Features (10 entries)
('Onglet Vue d''ensemble Étudiant', 
'L''onglet Vue d''ensemble Étudiant affiche votre tableau de bord personnel : cours en cours, prochaines sessions, taux de progression global, dernières notes, rappels importants, statistiques d''assiduité. Accédez via Dashboard → Vue d''ensemble ou /student?tab=overview', 
ARRAY['vue d''ensemble', 'dashboard', 'étudiant', 'overview', 'progression', 'statistiques'], 
ARRAY['student']::app_role[], 9, 'student_dashboard'),

('Onglet Progression Étudiant', 
'L''onglet Progression Étudiant visualise votre avancement : pourcentage de complétion par cours, modules terminés, analytics de performance, temps d''étude total, badges obtenus, objectifs atteints. Accédez via Dashboard → Progression ou /student?tab=progress', 
ARRAY['progression', 'progress', 'avancement', 'complétion', 'performance', 'étudiant'], 
ARRAY['student']::app_role[], 9, 'student_dashboard'),

('Onglet Calendrier Étudiant', 
'L''onglet Calendrier Étudiant affiche votre planning personnel : sessions à venir, examens programmés, deadlines de devoirs, événements AVS.ma, rappels automatiques. Synchronisable avec Google Calendar. Accédez via Dashboard → Calendrier ou /student?tab=calendar', 
ARRAY['calendrier', 'calendar', 'planning', 'sessions', 'examens', 'deadlines', 'étudiant'], 
ARRAY['student']::app_role[], 8, 'student_dashboard'),

('Onglet Assiduité Étudiant', 
'L''onglet Assiduité Étudiant montre votre historique de présence : taux d''assiduité global, présences/absences par cours, absences justifiées vs non justifiées, upload de justificatifs (certificats médicaux), statistiques mensuelles. Accédez via Dashboard → Assiduité ou /student?tab=attendance', 
ARRAY['assiduité', 'attendance', 'présence', 'absences', 'justificatifs', 'étudiant'], 
ARRAY['student']::app_role[], 8, 'student_dashboard'),

('Onglet Certificats Étudiant', 
'L''onglet Certificats Étudiant permet de télécharger vos diplômes numériques : certificats de complétion de cours, diplômes TSIA/TSDI, attestations de présence, codes de vérification blockchain, partage sur LinkedIn. Accédez via Dashboard → Certificats ou /student?tab=certificates', 
ARRAY['certificats', 'certificates', 'diplômes', 'téléchargement', 'vérification', 'étudiant'], 
ARRAY['student']::app_role[], 9, 'student_dashboard'),

('Onglet Récompenses Étudiant', 
'L''onglet Récompenses Étudiant affiche votre gamification : badges obtenus, achievements débloqués, niveau actuel, points XP, classement leaderboard, défis en cours, récompenses à venir. Motivez-vous à apprendre ! Accédez via Dashboard → Récompenses ou /student?tab=rewards', 
ARRAY['récompenses', 'rewards', 'badges', 'achievements', 'gamification', 'leaderboard', 'étudiant'], 
ARRAY['student']::app_role[], 7, 'student_dashboard'),

('Onglet Notifications Étudiant', 
'L''onglet Notifications Étudiant centralise toutes vos alertes : nouvelles notes publiées, messages de professeurs, rappels de sessions, annonces administratives, préférences de notification (email/push/SMS). Accédez via Dashboard → Notifications ou /student?tab=notifications', 
ARRAY['notifications', 'alertes', 'messages', 'rappels', 'annonces', 'étudiant'], 
ARRAY['student']::app_role[], 8, 'student_dashboard'),

('Onglet Profil Étudiant', 
'L''onglet Profil Étudiant permet de gérer vos informations : modifier photo de profil, mettre à jour coordonnées, changer mot de passe, préférences de langue, liens réseaux sociaux, bio personnelle. Accédez via Dashboard → Profil ou /student?tab=profile', 
ARRAY['profil', 'profile', 'compte', 'informations', 'mot de passe', 'étudiant'], 
ARRAY['student']::app_role[], 7, 'student_dashboard'),

('Onglet Confidentialité Étudiant', 
'L''onglet Confidentialité Étudiant contrôle vos données RGPD : export de toutes vos données personnelles, gestion des consentements, visibilité du profil, suppression de compte, historique des accès. Conformité RGPD complète. Accédez via Dashboard → Confidentialité ou /student?tab=privacy', 
ARRAY['confidentialité', 'privacy', 'rgpd', 'données', 'export', 'suppression', 'étudiant'], 
ARRAY['student']::app_role[], 6, 'student_dashboard'),

('Onglet Mes Cours Étudiant', 
'L''onglet Mes Cours Étudiant liste tous vos cours : cours actifs, terminés, en pause, accès direct aux contenus, progression par cours, notes obtenues, prochaines sessions. Hub central d''apprentissage. Accédez via Dashboard → Mes Cours ou /student?tab=courses', 
ARRAY['mes cours', 'courses', 'liste cours', 'apprentissage', 'contenus', 'étudiant'], 
ARRAY['student']::app_role[], 9, 'student_dashboard'),

-- Professor Workflows (5 entries)
('Dashboard Professeur', 
'Dashboard Professeur affiche vos statistiques clés : nombre de cours enseignés, total d''étudiants actuels, taux d''assiduité moyen de vos classes, prochaines sessions à venir, notifications importantes. Accédez via /professor', 
ARRAY['dashboard', 'professeur', 'statistiques', 'overview', 'enseignement'], 
ARRAY['professor']::app_role[], 9, 'professor_workflows'),

('Page Détails de Cours Professeur', 
'Page Détails de Cours Professeur (/professor/course/{id}) permet la gestion complète d''un cours : liste des étudiants inscrits, marquer présences/absences, entrer notes et commentaires, publier annonces, upload de supports, calendrier des sessions, analytics de performance de classe', 
ARRAY['cours', 'détails', 'gestion cours', 'étudiants', 'professeur', 'course'], 
ARRAY['professor']::app_role[], 9, 'professor_workflows'),

('Annonces en Masse Professeur', 
'Annonces en Masse Professeur : envoyez des messages groupés à tous les étudiants d''un cours depuis la page du cours → onglet Communication. Idéal pour rappels d''examens, changements d''horaires, ressources supplémentaires. Notifications email + in-app automatiques', 
ARRAY['annonces', 'messages', 'communication', 'email', 'bulk', 'professeur'], 
ARRAY['professor']::app_role[], 8, 'professor_workflows'),

('Système de Notation Professeur', 
'Système de Notation Professeur : entrez notes et feedback depuis la page de cours → onglet Notes. Barème personnalisable, commentaires par étudiant, export vers Excel, statistiques de classe (moyenne, médiane, écart-type), publication progressive ou groupée', 
ARRAY['notation', 'notes', 'grades', 'feedback', 'évaluation', 'professeur'], 
ARRAY['professor']::app_role[], 9, 'professor_workflows'),

('Marquage d''Assiduité Professeur', 
'Marquage d''Assiduité Professeur : depuis la page de cours → onglet Présence, cochez présents/absents pour chaque session. Justification d''absences, export de rapports d''assiduité, alertes automatiques pour étudiants à risque (<75% présence), historique complet', 
ARRAY['assiduité', 'présence', 'attendance', 'absences', 'marking', 'professeur'], 
ARRAY['professor']::app_role[], 8, 'professor_workflows'),

-- Public Routes (5 entries)
('Page Fonctionnalités', 
'Page Fonctionnalités (/features) présente toutes les capacités de la plateforme AVS.ma : système de cours vidéo, suivi de progression, certificats numériques, CRM étudiant, gamification, IA assistant, analytics, mobile-friendly. Pour visiteurs découvrant la plateforme', 
ARRAY['fonctionnalités', 'features', 'capacités', 'plateforme', 'découverte'], 
ARRAY['admin', 'professor', 'student']::app_role[], 6, 'public_pages'),

('Page Instructeurs', 
'Page Instructeurs (/instructors) affiche tous les professeurs AVS.ma avec profils détaillés : photo, bio, spécialisations, cours enseignés, évaluations étudiants, expérience professionnelle. Permet aux visiteurs de découvrir l''équipe pédagogique', 
ARRAY['instructeurs', 'professeurs', 'instructors', 'équipe', 'profils'], 
ARRAY['admin', 'professor', 'student']::app_role[], 6, 'public_pages'),

('Page FAQ', 
'Page FAQ (/faq) répond aux questions fréquentes : modalités d''inscription, tarifs, durée des cours, certification, méthodes pédagogiques, support technique, politique de remboursement. Organisée par catégories pour navigation facile', 
ARRAY['faq', 'questions', 'aide', 'support', 'informations'], 
ARRAY['admin', 'professor', 'student']::app_role[], 7, 'public_pages'),

('Page Carrières', 
'Page Carrières (/careers) liste les opportunités d''emploi chez AVS.ma : postes de professeur, assistant pédagogique, développeur, marketing. Formulaire de candidature en ligne, description des postes, culture d''entreprise, avantages', 
ARRAY['carrières', 'careers', 'emploi', 'jobs', 'recrutement', 'candidature'], 
ARRAY['admin', 'professor', 'student']::app_role[], 5, 'public_pages'),

('Programmes TSIA/TSDI', 
'Programmes TSIA/TSDI sont des diplômes techniques spécialisés offerts par AVS.ma : Technicien Spécialisé en Informatique Appliquée (TSIA) et Technicien Spécialisé en Développement Informatique (TSDI). Durée 2 ans, certification reconnue, stage en entreprise inclus. Détails sur /curriculum', 
ARRAY['tsia', 'tsdi', 'diplôme', 'technique', 'programmes', 'certification'], 
ARRAY['admin', 'professor', 'student']::app_role[], 8, 'public_pages');