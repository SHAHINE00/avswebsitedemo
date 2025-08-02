import React, { useState, useEffect } from 'react';
import { X, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useHostingerEmail } from '@/hooks/useHostingerEmail';
import { toast } from 'sonner';

const NewsletterPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const { sendNewsletterWelcome, loading } = useHostingerEmail();

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen');
    const hasSubscribed = localStorage.getItem('newsletter-subscribed');
    
    if (!hasSeenPopup && !hasSubscribed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 15000); // Show after 15 seconds
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('newsletter-popup-seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const success = await sendNewsletterWelcome({
      email: email.trim(),
      source: 'popup'
    });

    if (success) {
      localStorage.setItem('newsletter-subscribed', 'true');
      setIsVisible(false);
      toast.success('Merci! Vous recevrez bientôt des contenus exclusifs sur l\'IA.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative animate-in fade-in-0 zoom-in-95 duration-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-2 top-2 z-10"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-academy-blue to-academy-purple rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Offre Spéciale!</h3>
          <p className="text-muted-foreground mb-4">
            Recevez <strong>20% de réduction</strong> sur votre première formation + nos guides exclusifs sur l'IA
          </p>
          
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
              {loading ? 'Envoi...' : 'Obtenir ma réduction'}
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-3">
            Pas de spam, désinscription possible à tout moment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterPopup;