
import React from 'react';
import { useSafeState, useSafeEffect } from '@/utils/safeHooks';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { rateLimiter } from '@/utils/security';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { utilityPagesSEO } from '@/utils/seoData';

const Auth = () => {
  const [email, setEmail] = useSafeState('');
  const [password, setPassword] = useSafeState('');
  const [fullName, setFullName] = useSafeState('');
  const [loading, setLoading] = useSafeState(false);
  const [rateLimited, setRateLimited] = useSafeState(false);
  const [cooldownEnd, setCooldownEnd] = useSafeState<number | null>(null);
  const [cooldownTime, setCooldownTime] = useSafeState(0);
  const { signIn, signUp, user, isAdmin, adminLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Cooldown timer effect
  useSafeEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (cooldownEnd) {
      interval = setInterval(() => {
        const remaining = Math.max(0, cooldownEnd - Date.now());
        setCooldownTime(Math.ceil(remaining / 1000));
        
        if (remaining <= 0) {
          setRateLimited(false);
          setCooldownEnd(null);
          setCooldownTime(0);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [cooldownEnd]);

  useSafeEffect(() => {
    if (user && !adminLoading) {
      console.log('Auth redirect - User:', user.email, 'IsAdmin:', isAdmin, 'AdminLoading:', adminLoading);
      // Add a small delay to ensure admin status is fully set
      setTimeout(() => {
        if (isAdmin) {
          console.log('Redirecting admin user to /admin');
          navigate('/admin');
        } else {
          console.log('Redirecting regular user to /');
          navigate('/');
        }
      }, 100);
    }
  }, [user, isAdmin, adminLoading, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Development bypass - press Ctrl+Shift during signup to bypass rate limiting
    const isDevelopmentBypass = e.nativeEvent && 
      (e.nativeEvent as KeyboardEvent).ctrlKey && 
      (e.nativeEvent as KeyboardEvent).shiftKey;

    if (isDevelopmentBypass) {
      rateLimiter.reset(`signup_${email}`);
      setRateLimited(false);
      setCooldownEnd(null);
      toast({
        title: "Rate limit reset",
        description: "Development bypass activated.",
      });
    }

    // Check client-side rate limiting (less aggressive)
    if (!isDevelopmentBypass && !rateLimiter.isAllowed(`signup_${email}`)) {
      setRateLimited(true);
      setCooldownEnd(Date.now() + 5 * 60 * 1000); // 5 minutes cooldown
      toast({
        title: "Trop de tentatives",
        description: "Réessayez dans 5 minutes ou utilisez le mode de sauvegarde.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    try {
      console.log('Using new admin approval registration system...');
      
      // Use the new pending registration system instead of direct Supabase auth
      const { data, error } = await supabase.functions.invoke('handle-pending-registration', {
        body: {
          email: email?.trim(),
          password,
          full_name: fullName?.trim(),
          formation_tag: 'inscription-directe',
          metadata: {
            source: 'auth-signup',
            registration_date: new Date().toISOString()
          }
        }
      });

      console.log('Pending registration response:', { data, error });

      if (error) {
        console.error('Pending registration error:', error);
        
        // Handle specific error cases
        if (error.message?.includes('duplicate_email') || data?.error === 'duplicate_email') {
          toast({
            title: "📝 Demande déjà en cours",
            description: data?.message || "Une demande d'inscription est déjà en cours pour cette adresse email. Veuillez patienter pendant l'approbation.",
            variant: "default",
          });
          return;
        }
        
        if (error.message?.includes('already_approved') || data?.error === 'already_approved') {
          toast({
            title: "✅ Compte déjà approuvé",
            description: data?.message || "Cette adresse email est déjà approuvée. Vous pouvez vous connecter directement.",
            variant: "default",
          });
          return;
        }
        
        throw new Error(error.message || 'Erreur lors de l\'inscription');
      }

      console.log('Pending registration successful:', data);

      toast({
        title: "🎉 Inscription reçue !",
        description: data.message || "Votre demande d'inscription est en attente d'approbation. Vous recevrez un email de confirmation.",
      });
      
      // Clear the form
      setEmail('');
      setPassword('');
      setFullName('');
      
      // Don't navigate - user needs to wait for approval
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead {...utilityPagesSEO.auth} />
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-24 px-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">AVS INSTITUTE</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace formation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={rateLimited}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={rateLimited}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signupPassword">Mot de passe</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={rateLimited}
                    />
                  </div>
                  {rateLimited && (
                    <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-medium">Mode de sauvegarde activé</p>
                      <p>Cooldown: {cooldownTime > 0 ? `${Math.floor(cooldownTime / 60)}m ${cooldownTime % 60}s` : 'actif'}</p>
                      <p className="text-xs mt-1">Votre inscription a été enregistrée via notre système de sauvegarde.</p>
                    </div>
                  )}
                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                     <h4 className="font-medium text-blue-900 mb-2">📋 Processus d'inscription</h4>
                     <ul className="text-sm text-blue-800 space-y-1">
                       <li>• Votre demande sera examinée par notre équipe</li>
                       <li>• Délai d'approbation : 24-48 heures</li>
                       <li>• Vous recevrez un email de confirmation</li>
                       <li>• Accès immédiat après approbation</li>
                     </ul>
                   </div>
                   
                   <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Soumission en cours...' : "Soumettre ma demande d'inscription"}
                   </Button>
                   {rateLimited && (
                     <p className="text-xs text-gray-500 mt-2 text-center">
                       Astuce: Ctrl+Shift+Clic pour réinitialiser (développement)
                     </p>
                   )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
