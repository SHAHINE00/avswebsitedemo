import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StandardPageLayout from '@/components/layouts/StandardPageLayout';
import PageHero from '@/components/layouts/PageHero';
import SectionWrapper from '@/components/layouts/SectionWrapper';
import {
  Brain,
  Target,
  Zap,
  Clock,
  AlertTriangle,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  Users,
  Award,
  Briefcase,
  Rocket,
  Shield,
  Phone,
  Mail,
  ArrowRight
} from 'lucide-react';

const AIExcellenceCourse: React.FC = () => {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StandardPageLayout>
      {/* 1. SECTION HÉROS */}
      <PageHero
        title="Vos Équipes Perdent du Temps ?"
        subtitle="Transformez-les en Experts de la Productivité"
        backgroundGradient="from-academy-blue via-academy-purple to-academy-lightblue"
      >
        <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto mb-8">
          La formation stratégique qui transforme vos collaborateurs en maîtres de l'IA générative. 
          Décuplez leur efficacité, stimulez leur innovation, gardez l'avantage compétitif.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          <Button 
            size="lg" 
            className="bg-white text-academy-blue hover:bg-white/90 text-lg px-8 py-6 h-auto"
            onClick={scrollToContact}
          >
            <Phone className="mr-2 h-5 w-5" />
            Planifier une Démo Gratuite
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
            onClick={scrollToContact}
          >
            Demander une Consultation
          </Button>
        </div>

        <p className="text-white/90 font-medium">
          ✓ Rejoignez les entreprises qui ont déjà fait le saut vers l'excellence
        </p>
      </PageHero>

      {/* 2. SECTION PROBLÈME / AGITATION */}
      <SectionWrapper background="white" padding="xl">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Votre Équipe Est-Elle Vraiment Prête pour Demain ?
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Pendant que vos concurrents gagnent en vitesse, vos collaborateurs font face à ces défis :
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Clock className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-xl mb-2">Temps Perdu sur des Tâches Répétitives</CardTitle>
                    <CardDescription className="text-base">
                      Rapports, e-mails, synthèses... Des heures gaspillées chaque semaine sur du travail à faible valeur ajoutée.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <TrendingDown className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-xl mb-2">Créativité en Panne</CardTitle>
                    <CardDescription className="text-base">
                      Les mêmes solutions qui reviennent. L'innovation ralentit. Vos équipes tournent en rond.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-xl mb-2">Retard Technologique Dangereux</CardTitle>
                    <CardDescription className="text-base">
                      La peur ou la méconnaissance de l'IA crée un désavantage compétitif critique face aux acteurs qui maîtrisent déjà ces outils.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-destructive/20 bg-destructive/5">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Users className="h-8 w-8 text-destructive flex-shrink-0 mt-1" />
                  <div>
                    <CardTitle className="text-xl mb-2">Manque de Structure et de Rapidité</CardTitle>
                    <CardDescription className="text-base">
                      Réunions interminables, projets qui s'enlisent. Sans méthodologie claire, l'efficacité collective en pâtit.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      {/* 3. SECTION SOLUTION / PRÉSENTATION */}
      <SectionWrapper background="gradient" padding="xl">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 text-base px-4 py-2">La Solution</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Une Formation qui Transforme, Pas qui Informe
          </h2>
          <div className="text-lg text-muted-foreground space-y-4 text-left bg-card p-8 rounded-xl border shadow-sm">
            <p>
              <strong>Oubliez les cours théoriques.</strong> Cette formation est conçue pour les professionnels exigeants qui veulent des résultats mesurables, rapidement.
            </p>
            <p>
              Notre approche ? <strong>100% pratique, 0% technique.</strong> Chaque participant construit son propre "système de productivité intelligent" qu'il utilisera dès le lendemain au bureau.
            </p>
            <p>
              En 6 semaines, vos collaborateurs passent de novices à experts en IA générative. Ils ne se contentent pas d'apprendre à "utiliser ChatGPT" — ils maîtrisent l'art de dialoguer avec l'intelligence artificielle pour obtenir des résultats de niveau consultant, automatiser leurs tâches chronophages, et libérer leur créativité.
            </p>
            <p className="font-semibold text-primary">
              Le résultat ? Des équipes autonomes, rapides, innovantes. Et un ROI visible dès la première semaine.
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 4. SECTION BÉNÉFICES (LA TRANSFORMATION) */}
      <SectionWrapper background="white" padding="xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Ce que Vos Équipes Sauront FAIRE (et DEVENIR)
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Des compétences concrètes qui transforment la performance de votre entreprise
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Dialoguer avec l'IA Comme des Experts</CardTitle>
                    <CardDescription className="text-base">
                      <strong>→ Impact :</strong> Obtenir des résultats de haute qualité en quelques minutes, pas en quelques heures. Fini les prompts approximatifs, place à la précision chirurgicale.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Gérer des Problèmes Complexes Étape par Étape</CardTitle>
                    <CardDescription className="text-base">
                      <strong>→ Impact :</strong> Transformer les défis en plans d'action structurés, plus rapidement. Plus de blocages, que des solutions claires et actionnables.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Créer Leurs Propres Outils sur Mesure (Personas)</CardTitle>
                    <CardDescription className="text-base">
                      <strong>→ Impact :</strong> Obtenir des analyses et des conseils de niveau 'consultant' sur demande, 24/7. Chaque collaborateur a son assistant expert personnalisé.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Accélérer Radicalement la Rédaction et la Synthèse</CardTitle>
                    <CardDescription className="text-base">
                      <strong>→ Impact :</strong> Libérer jusqu'à 5 heures par semaine et par collaborateur, à réinvestir dans des tâches à haute valeur ajoutée. Le temps, c'est de l'argent.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors md:col-span-2">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">Innover et Expérimenter Sans Limites</CardTitle>
                    <CardDescription className="text-base">
                      <strong>→ Impact :</strong> Générer des idées créatives, tester de nouveaux concepts, et prendre des décisions éclairées grâce à des analyses instantanées. L'IA devient le partenaire d'innovation de chaque équipe.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-primary/5 border-2 border-primary/20 rounded-xl text-center">
            <p className="text-xl font-bold text-primary mb-2">
              Résultat : Un Retour sur Investissement Mesurable
            </p>
            <p className="text-lg text-muted-foreground">
              Productivité x2 à x3 sur les tâches courantes • Temps de formation récupéré en 2 semaines • Équipes motivées et autonomes
            </p>
          </div>
        </div>
      </SectionWrapper>

      {/* 5. SECTION PARCOURS (COMMENT ÇA MARCHE) */}
      <SectionWrapper background="gray" padding="xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Un Parcours de 6 Semaines : De Novice à Expert
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Chaque module construit sur le précédent pour une progression logique et efficace
          </p>

          <div className="space-y-6">
            {/* Module 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 1 : Fondations de l'IA Générative</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Découvrez le potentiel, maîtrisez la sécurité.</strong> Comprendre ce que l'IA peut (et ne peut pas) faire. Adopter les bonnes pratiques dès le départ.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Module 2 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 2 : L'Art du Prompt Engineering</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Apprenez la méthode pour des résultats parfaits.</strong> Maîtriser les techniques avancées pour obtenir exactement ce que vous voulez de l'IA, à chaque fois.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Module 3 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 3 : Résolution de Problèmes Complexes</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Transformez les défis en opportunités.</strong> Décomposer les problèmes difficiles et créer des solutions structurées avec l'aide de l'IA.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Module 4 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 4 : Création de Personas et Outils Personnalisés</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Construisez vos propres assistants experts.</strong> Créer des personas IA sur mesure pour chaque fonction : consultant stratégique, rédacteur, analyste...
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Module 5 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    5
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 5 : Automatisation et Gains de Productivité Massifs</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Libérez du temps, créez de la valeur.</strong> Automatiser les tâches répétitives (rapports, e-mails, synthèses) pour se concentrer sur l'essentiel.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Module 6 */}
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                    6
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">Semaine 6 : Projet Final et Certification</CardTitle>
                    <CardDescription className="text-base">
                      <strong>Consolidez et certifiez votre expertise.</strong> Créer votre guide personnel de productivité IA et obtenir votre certification reconnue.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </SectionWrapper>

      {/* 6. SECTION "POURQUOI NOUS ?" */}
      <SectionWrapper background="white" padding="xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Plus qu'un Cours, un Partenariat pour l'Excellence
          </h2>
          <p className="text-lg text-center text-muted-foreground mb-12">
            Ce qui nous rend différents et garantit vos résultats
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-3">Pédagogie Active 70% Pratique</CardTitle>
                <CardDescription className="text-base">
                  Pas de slides interminables. Chaque concept est immédiatement appliqué sur des cas réels tirés de votre secteur. Vos équipes apprennent en FAISANT.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-3">Projet Final Concret et Personnalisé</CardTitle>
                <CardDescription className="text-base">
                  Chaque participant repart avec SON propre guide de productivité IA, adapté à SON poste. Un outil qu'il utilisera tous les jours, pas un certificat oublié dans un tiroir.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center border-2 hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Briefcase className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-xl mb-3">Adapté à VOTRE Contexte Professionnel</CardTitle>
                <CardDescription className="text-base">
                  Conçu pour les professionnels, par des professionnels. Nous adaptons les exemples, les cas pratiques, et les exercices à votre industrie et vos défis spécifiques.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 p-8 bg-card border-2 border-primary/20 rounded-xl">
            <div className="flex items-start gap-4">
              <Shield className="h-10 w-10 text-primary flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Garantie Résultats</h3>
                <p className="text-muted-foreground">
                  Si vos équipes n'ont pas gagné au moins 3 heures par semaine après la formation, nous vous offrons une session de coaching individuel gratuite pour identifier et débloquer leurs gains de productivité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 7. SECTION APPEL À L'ACTION FINAL */}
      <SectionWrapper background="gradient" padding="xl" id="contact-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Prêt à Donner un Avantage Décisif à Vos Équipes ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Le monde professionnel évolue à vitesse grand V. Pendant que certaines entreprises forment leurs équipes et prennent de l'avance, d'autres accumulent du retard. 
            <strong> Dans quel camp voulez-vous être dans 6 mois ?</strong>
          </p>

          <div className="bg-card p-8 rounded-xl border-2 border-primary/20 mb-8 shadow-lg">
            <p className="text-xl font-semibold text-foreground mb-6">
              Ne laissez pas passer cette opportunité. Les places sont limitées pour garantir un accompagnement de qualité.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 h-auto shadow-lg"
                onClick={scrollToContact}
              >
                <Phone className="mr-2 h-5 w-5" />
                Planifier un Appel Stratégique
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Sans engagement • ✓ Réponse sous 24h • ✓ Consultation personnalisée offerte
            </p>
          </div>

          {/* Contact Information */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl mb-6">Contactez-Nous Dès Maintenant</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <Phone className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Téléphone</p>
                    <a href="tel:+212123456789" className="text-primary hover:underline">
                      +212 5 22 XX XX XX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Email</p>
                    <a href="mailto:formations@avsinstitute.ma" className="text-primary hover:underline">
                      formations@avsinstitute.ma
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground italic">
                  "Investir dans la formation de vos équipes, c'est investir dans l'avenir de votre entreprise. 
                  Faites-le maintenant, avant que vos concurrents ne prennent trop d'avance."
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </StandardPageLayout>
  );
};

export default AIExcellenceCourse;
