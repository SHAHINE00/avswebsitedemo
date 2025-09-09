
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
      const { error } = await signUp(email, password, fullName);
      
      if (error) {
        // Check if it's a rate limit error (429 or rate limit keywords)
        const isRateLimitError = error.message.includes('rate limit') || 
                                error.message.includes('too many') ||
                                error.message.includes('Email rate limit exceeded') ||
                                error.status === 429;
        
        if (isRateLimitError) {
          console.log('Supabase rate limit detected, activating fallback mode');
          setRateLimited(true);
          setCooldownEnd(Date.now() + 5 * 60 * 1000); // 5 minutes cooldown
          
          toast({
            title: "Mode de sauvegarde activé",
            description: "Traitement de votre inscription...",
          });

          // Immediate fallback to subscribe edge function
          try {
            const { data: subscribeRes, error: subscribeError } = await supabase.functions.invoke('subscribe', {
              body: {
                email: email?.trim(),
                full_name: fullName?.trim(),
                source: 'auth-signup-rate-limited',
                phone: '',
                formation_tag: 'Inscription depuis la page d\'authentification'
              }
            });

            console.log('Subscribe function response:', subscribeRes);

            if (subscribeError) {
              console.error('Subscribe function error:', subscribeError);
              throw subscribeError;
            }

            if (subscribeRes?.status === 'already_subscribed') {
              toast({
                title: "Déjà inscrit",
                description: "Votre email est déjà dans notre système. Nous vous contacterons bientôt pour finaliser votre inscription.",
              });
            } else if (subscribeRes?.status === 'success') {
              toast({
                title: "Inscription enregistrée avec succès",
                description: "Votre demande d'inscription a été enregistrée. Vous recevrez un email de confirmation sous peu.",
              });
            } else {
              toast({
                title: "Inscription enregistrée",
                description: "Votre demande d'inscription a été traitée en mode de sauvegarde.",
              });
            }
          } catch (fallbackError: any) {
            console.error('Fallback error:', fallbackError);
            toast({
              title: "Erreur temporaire",
              description: "Service temporairement surchargé. Réessayez dans quelques minutes.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Erreur d'inscription",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Inscription réussie",
          description: "Vérifiez votre email pour confirmer votre compte.",
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur inattendue s'est produite.",
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
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Inscription...' : rateLimited ? 'Mode sauvegarde - Réessayer' : "S'inscrire"}
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
