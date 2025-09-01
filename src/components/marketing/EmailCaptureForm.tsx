import React from 'react';
import { useSafeState } from '@/utils/safeHooks';
import { Mail, CheckCircle, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';
import { useMarketingTracking } from '@/hooks/useMarketingTracking';
import { toast } from 'sonner';

interface EmailCaptureFormProps {
  title?: string;
  description?: string;
  incentive?: string;
  source: string;
  className?: string;
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({
  title = "Restez informé des dernières innovations IA",
  description = "Recevez nos guides exclusifs et offres spéciales",
  incentive = "Guide gratuit: 'Les 10 métiers d'avenir en IA'",
  source,
  className = ""
}) => {
  const [email, setEmail] = useSafeState('');
  const [isSubscribed, setIsSubscribed] = useSafeState(false);
  const { subscribe, loading } = useNewsletterSubscription();
  const { trackNewsletterSignup } = useMarketingTracking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const success = await subscribe({
      email: email.trim(),
      source
    });

    if (success) {
      setIsSubscribed(true);
      trackNewsletterSignup(source);
      toast.success('Merci! Vérifiez votre email pour accéder au guide gratuit.');
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Inscription réussie!</h3>
          <p className="text-green-700">
            Vérifiez votre boîte email pour accéder à votre guide gratuit.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-academy-blue/20 bg-gradient-to-br from-academy-blue/5 to-academy-purple/5 ${className}`}>
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-academy-blue to-academy-purple rounded-full flex items-center justify-center mx-auto mb-3">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3">{description}</p>
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
            <Gift className="w-3 h-3" />
            {incentive}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-academy-blue"
              required
              disabled={loading}
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-gradient-to-r from-academy-blue to-academy-purple hover:from-academy-purple hover:to-academy-blue"
          >
            {loading ? 'Envoi...' : 'Obtenir le guide gratuit'}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-3 text-center">
          Pas de spam. Désinscription possible à tout moment.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailCaptureForm;