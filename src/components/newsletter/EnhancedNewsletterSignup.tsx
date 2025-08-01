import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, User, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { trackNewsletterSignup } from '@/utils/analytics';

interface EnhancedNewsletterSignupProps {
  title?: string;
  description?: string;
  showInterests?: boolean;
  source?: string;
  className?: string;
}

const INTERESTS = [
  { id: 'cybersecurity', label: 'Cybersécurité', color: 'bg-red-500' },
  { id: 'programming', label: 'Programmation', color: 'bg-blue-500' },
  { id: 'ai', label: 'Intelligence Artificielle', color: 'bg-purple-500' },
  { id: 'web-development', label: 'Développement Web', color: 'bg-green-500' },
  { id: 'data-science', label: 'Data Science', color: 'bg-orange-500' },
  { id: 'digital-marketing', label: 'Marketing Digital', color: 'bg-pink-500' },
];

export const EnhancedNewsletterSignup: React.FC<EnhancedNewsletterSignupProps> = ({
  title = "Restez informé(e) de nos actualités",
  description = "Recevez nos dernières formations et conseils d'experts directement dans votre boîte mail",
  showInterests = true,
  source = "newsletter",
  className = ""
}) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    interests: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  const handleInterestChange = (interestId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir votre adresse email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Save to subscribers table  
      const { error: dbError } = await supabase
        .from('subscribers')
        .insert({
          email: formData.email,
          full_name: formData.fullName || null
        });

      if (dbError) {
        if (dbError.code === '23505') { // Unique constraint violation
          toast({
            title: "Déjà inscrit(e)",
            description: "Cette adresse email est déjà inscrite à notre newsletter.",
            variant: "destructive",
          });
          return;
        }
        throw dbError;
      }

      // Send welcome email
      const { error: emailError } = await supabase.functions.invoke('send-hostinger-email', {
        body: {
          type: 'newsletter',
          email: formData.email,
          fullName: formData.fullName,
          interests: formData.interests.map(id => 
            INTERESTS.find(interest => interest.id === id)?.label
          ).filter(Boolean),
          source
        }
      });

      if (emailError) {
        console.error('Email sending error:', emailError);
        // Don't fail the whole process if email fails
      }

      // Track newsletter signup in analytics
      trackNewsletterSignup(source);

      setIsSubscribed(true);
      toast({
        title: "Inscription réussie!",
        description: "Merci de vous être inscrit(e) à notre newsletter. Vérifiez votre email de bienvenue.",
      });

      // Reset form
      setFormData({ email: '', fullName: '', interests: [] });

    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`max-w-md mx-auto ${className}`}>
        <CardContent className="pt-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Inscription confirmée!</h3>
          <p className="text-muted-foreground mb-4">
            Vous recevrez bientôt un email de confirmation avec tous les détails.
          </p>
          <Button 
            variant="outline" 
            onClick={() => setIsSubscribed(false)}
            className="w-full"
          >
            S'inscrire avec une autre adresse
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubscribe} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Votre nom complet (optionnel)"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {showInterests && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <label className="text-sm font-medium">
                  Centres d'intérêt (optionnel)
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest.id}
                      checked={formData.interests.includes(interest.id)}
                      onCheckedChange={(checked) => 
                        handleInterestChange(interest.id, checked as boolean)
                      }
                    />
                    <label
                      htmlFor={interest.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center space-x-1"
                    >
                      <div className={`w-2 h-2 rounded-full ${interest.color}`} />
                      <span>{interest.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              {formData.interests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.interests.map(interestId => {
                    const interest = INTERESTS.find(i => i.id === interestId);
                    return interest ? (
                      <Badge key={interestId} variant="secondary" className="text-xs">
                        {interest.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Inscription...</span>
              </div>
            ) : (
              "S'inscrire à la newsletter"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            En vous inscrivant, vous acceptez de recevoir nos emails. 
            Vous pouvez vous désabonner à tout moment.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};