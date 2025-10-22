-- Create chat sessions table
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  visitor_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create knowledge base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  role_access app_role[],
  language TEXT DEFAULT 'fr',
  priority INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON public.chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_keywords ON public.knowledge_base USING GIN(keywords);
CREATE INDEX IF NOT EXISTS idx_knowledge_role ON public.knowledge_base USING GIN(role_access);

-- Enable RLS
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_sessions
CREATE POLICY "Users can view own sessions"
  ON public.chat_sessions FOR SELECT
  USING (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Users can create own sessions"
  ON public.chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Users can update own sessions"
  ON public.chat_sessions FOR UPDATE
  USING (auth.uid() = user_id OR visitor_id IS NOT NULL);

CREATE POLICY "Admins can manage all sessions"
  ON public.chat_sessions FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from their sessions"
  ON public.chat_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND (chat_sessions.user_id = auth.uid() OR chat_sessions.visitor_id IS NOT NULL)
    )
  );

CREATE POLICY "Users can insert messages to their sessions"
  ON public.chat_messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE chat_sessions.id = chat_messages.session_id
      AND (chat_sessions.user_id = auth.uid() OR chat_sessions.visitor_id IS NOT NULL)
    )
  );

CREATE POLICY "Admins can manage all messages"
  ON public.chat_messages FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for knowledge_base
CREATE POLICY "Anyone can view public knowledge"
  ON public.knowledge_base FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage knowledge base"
  ON public.knowledge_base FOR ALL
  USING (is_admin(auth.uid()));

-- Insert initial knowledge base data (NULL role_access = public, specific roles = restricted)
INSERT INTO public.knowledge_base (category, title, content, keywords, role_access, priority) VALUES
-- Admin guides
('admin_guide', 'Créer un professeur', 'Pour créer un professeur: 1) Allez dans Admin → Gestion des Professeurs, 2) Cliquez sur "Nouveau Professeur", 3) Remplissez email, nom, spécialisation, 4) Le professeur reçoit un email d''invitation avec ses identifiants.', ARRAY['professeur', 'créer', 'ajouter', 'enseignant', 'nouveau'], ARRAY['admin'::app_role], 10),
('admin_guide', 'Gérer les rôles utilisateurs', 'Pour modifier le rôle d''un utilisateur: 1) Admin → Utilisateurs, 2) Trouvez l''utilisateur, 3) Cliquez sur Modifier, 4) Sélectionnez le nouveau rôle (étudiant, professeur, admin), 5) Sauvegardez. Les changements sont instantanés.', ARRAY['rôle', 'utilisateur', 'modifier', 'permissions', 'admin'], ARRAY['admin'::app_role], 9),
('admin_guide', 'Tableau de bord analytics', 'Le tableau de bord admin affiche: nombre d''utilisateurs actifs, inscriptions par cours, taux de complétion, présences, et revenus. Actualisé en temps réel. Exportez les données via le bouton "Exporter".', ARRAY['analytics', 'statistiques', 'dashboard', 'données', 'rapport'], ARRAY['admin'::app_role], 8),
('admin_guide', 'Importer des utilisateurs en masse', 'Pour importer plusieurs utilisateurs: 1) Admin → Utilisateurs → Import CSV, 2) Téléchargez le modèle CSV, 3) Remplissez avec les données (email, nom, prénom, rôle), 4) Uploadez le fichier, 5) Vérifiez et validez l''import.', ARRAY['import', 'csv', 'masse', 'bulk', 'utilisateurs'], ARRAY['admin'::app_role], 7),

-- Professor guides
('professor_guide', 'Créer un cours', 'Pour créer un cours: 1) Professeur → Mes Cours → Nouveau Cours, 2) Remplissez titre, description, niveau, 3) Ajoutez des leçons et matériaux, 4) Publiez quand prêt. Les étudiants peuvent s''inscrire immédiatement après publication.', ARRAY['cours', 'créer', 'nouveau', 'leçon', 'publier'], ARRAY['professor'::app_role], 10),
('professor_guide', 'Enregistrer les présences', 'Pour marquer les présences: 1) Professeur → Présences, 2) Sélectionnez le cours et la séance, 3) Cochez présent/absent pour chaque étudiant, 4) Ajoutez des notes si nécessaire, 5) Sauvegardez. Les étudiants voient leur statut immédiatement.', ARRAY['présence', 'absence', 'marquer', 'attendance', 'séance'], ARRAY['professor'::app_role], 9),
('professor_guide', 'Attribuer des notes', 'Pour noter les étudiants: 1) Professeur → Notes, 2) Sélectionnez le cours et l''évaluation, 3) Entrez les notes pour chaque étudiant, 4) Ajoutez des commentaires optionnels, 5) Validez. Les notes sont visibles par les étudiants.', ARRAY['note', 'évaluation', 'grade', 'devoir', 'examen'], ARRAY['professor'::app_role], 9),
('professor_guide', 'Publier une annonce', 'Pour créer une annonce: 1) Professeur → Cours → Annonces, 2) Cliquez "Nouvelle Annonce", 3) Rédigez le titre et contenu, 4) Choisissez la priorité (normale/urgente), 5) Publiez. Tous les étudiants inscrits reçoivent une notification.', ARRAY['annonce', 'notification', 'message', 'publier', 'communication'], ARRAY['professor'::app_role], 8),

-- Student guides
('student_guide', 'S''inscrire à un cours', 'Pour vous inscrire: 1) Accédez au Catalogue de Cours, 2) Trouvez le cours souhaité, 3) Cliquez "S''inscrire", 4) Confirmez votre inscription, 5) Accédez immédiatement au contenu. Certains cours nécessitent l''approbation du professeur.', ARRAY['inscription', 'inscrire', 'cours', 'rejoindre', 'enroll'], ARRAY['student'::app_role], 10),
('student_guide', 'Suivre votre progression', 'Votre progression est visible: 1) Tableau de bord → Mes Cours, 2) Cliquez sur un cours pour voir le détail, 3) Les leçons complétées sont marquées en vert, 4) Le pourcentage global s''affiche en haut, 5) Consultez vos notes et présences dans les onglets dédiés.', ARRAY['progression', 'avancement', 'progrès', 'suivi', 'cours'], ARRAY['student'::app_role], 9),
('student_guide', 'Accéder aux matériaux de cours', 'Les matériaux sont dans: 1) Mes Cours → Sélectionnez un cours, 2) Onglet "Matériaux", 3) Téléchargez les PDF, vidéos, exercices, 4) Certains fichiers nécessitent de compléter les leçons précédentes.', ARRAY['matériaux', 'fichier', 'pdf', 'télécharger', 'ressource'], ARRAY['student'::app_role], 8),
('student_guide', 'Obtenir un certificat', 'Conditions pour le certificat: 1) Compléter 100% du cours, 2) Réussir les évaluations (note minimale 60%), 3) Présence minimum 80%, 4) Le certificat se génère automatiquement dans Mes Certificats, 5) Téléchargez ou partagez via un lien unique.', ARRAY['certificat', 'diplôme', 'attestation', 'télécharger', 'complétion'], ARRAY['student'::app_role], 10),

-- General platform info (NULL = accessible to all including visitors)
('faq', 'Tarifs et paiements', 'AVS.ma propose des cours gratuits et payants. Paiements acceptés: Carte bancaire, virement, CIH Bank. Les tarifs varient selon le cours (300-2000 DH). Réductions disponibles pour étudiants (20%) et inscriptions multiples (10%). Contact: paiements@avs.ma', ARRAY['tarif', 'prix', 'paiement', 'coût', 'gratuit', 'payant'], NULL, 10),
('faq', 'Assistance technique', 'Support disponible: 1) Chat en direct (lun-ven 9h-18h), 2) Email: support@avs.ma (réponse sous 24h), 3) Téléphone: +212 5XX-XXXXXX, 4) Centre d''aide: docs.avs.ma. Pour urgences techniques, contactez tech@avs.ma.', ARRAY['support', 'aide', 'assistance', 'contact', 'problème', 'bug'], NULL, 9),
('faq', 'Configuration requise', 'Navigateurs supportés: Chrome, Firefox, Safari, Edge (dernières versions). Connexion internet: minimum 2 Mbps. Appareils: PC, Mac, tablettes, smartphones. Les cours vidéo nécessitent 5 Mbps. Aucun logiciel à installer.', ARRAY['technique', 'navigateur', 'système', 'configuration', 'prérequis'], NULL, 7),
('faq', 'À propos d''AVS.ma', 'AVS.ma est la première plateforme éducative marocaine spécialisée en Intelligence Artificielle, Data Science, et Technologies. Fondée en 2023, basée à Casablanca. Mission: démocratiser l''éducation tech au Maroc avec des formations certifiantes reconnues.', ARRAY['avs', 'plateforme', 'propos', 'mission', 'maroc', 'about'], NULL, 8),
('course_info', 'Cours disponibles IA', 'Formations IA: 1) Introduction à l''IA (12 semaines, gratuit), 2) Machine Learning Avancé (16 semaines, 1500 DH), 3) Deep Learning (20 semaines, 2000 DH), 4) NLP et Vision (18 semaines, 1800 DH). Tous incluent certificats + projets pratiques.', ARRAY['cours', 'formation', 'ia', 'intelligence artificielle', 'catalogue'], NULL, 10),
('course_info', 'Cours Data Science', 'Formations Data: 1) Python pour Data (10 semaines, 800 DH), 2) Analyse de Données (14 semaines, 1200 DH), 3) Big Data (16 semaines, 1600 DH), 4) Business Intelligence (12 semaines, 1000 DH). Prérequis: connaissances Python de base.', ARRAY['data science', 'données', 'python', 'analyse', 'cours'], NULL, 9),
('course_info', 'Certifications reconnues', 'Nos certificats sont reconnus par: 1) Ministère de l''Éducation Marocain, 2) AMDIE (Agence Marocaine de Développement des Investissements), 3) 50+ entreprises partenaires au Maroc, 4) Équivalence internationale via nos partenariats.', ARRAY['certification', 'reconnaissance', 'diplôme', 'valide', 'officiel'], NULL, 8);

-- Function to auto-close inactive sessions
CREATE OR REPLACE FUNCTION close_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.chat_sessions
  SET ended_at = NOW()
  WHERE ended_at IS NULL
  AND last_activity_at < NOW() - INTERVAL '30 minutes';
END;
$$;