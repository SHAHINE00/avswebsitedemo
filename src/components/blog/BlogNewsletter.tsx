import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { useNewsletterSubscription } from '@/hooks/useNewsletterSubscription';

const BlogNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { subscribe, loading } = useNewsletterSubscription();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }

    const success = await subscribe({
      email: email.trim(),
      source: 'blog-newsletter'
    });
    
    if (success) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-gradient-to-br from-academy-blue to-academy-purple">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto text-center border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Merci pour votre inscription !</h3>
              <p className="text-gray-600 mb-6">
                Vous recevrez bientôt nos meilleurs articles tech directement dans votre boîte email.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsSubscribed(false)}
                className="border-academy-blue text-academy-blue hover:bg-academy-blue hover:text-white"
              >
                S'inscrire avec un autre email
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-academy-lightblue/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <Card className="max-w-2xl mx-auto text-center border-0 shadow-2xl bg-white text-gray-900">
          <CardContent className="p-8">
            <div className="bg-gradient-to-br from-academy-blue to-academy-purple w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Restez à la pointe de la tech
            </h3>
            
            <p className="text-gray-600 mb-6">
              Recevez chaque semaine nos meilleurs articles sur l'IA, la programmation, 
              la cybersécurité et les carrières tech directement dans votre boîte email.
            </p>
            
            <form onSubmit={handleSubscribe} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-academy-blue hover:bg-academy-purple text-white px-8"
                >
                  {loading ? "Inscription..." : "S'abonner"}
                </Button>
              </div>
            </form>
            
            <div className="flex items-center justify-center text-xs text-gray-500 mt-4">
              <AlertCircle className="w-4 h-4 mr-2" />
              Pas de spam. Désabonnement possible à tout moment.
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["IA & ML", "Développement", "Cybersécurité", "Carrières Tech"].map((tag, index) => (
                <span 
                  key={index}
                  className="bg-academy-gray/10 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default BlogNewsletter;