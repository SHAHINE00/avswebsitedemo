
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const fullName = `${formData.firstName} ${formData.lastName}`;
    const { error } = await signUp(formData.email, formData.password, fullName);
    
    if (error) {
      toast({
        title: "Erreur d'inscription",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Inscription réussie",
        description: "Vérifiez votre email pour confirmer votre compte.",
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-br from-academy-blue to-academy-purple text-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Inscription</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Commencez votre parcours vers une carrière réussie dans la technologie.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Formulaire d'inscription</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="course">Formation</Label>
                <select
                  id="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-academy-blue"
                >
                  <option value="">Sélectionnez une formation</option>
                  <option value="ai">Formation Intelligence Artificielle</option>
                  <option value="programming">Formation Programmation</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="mt-1 mr-2"
                    required
                  />
                  <span className="text-sm text-gray-700">
                    J'accepte les conditions générales et la politique de confidentialité
                  </span>
                </label>
              </div>
              
              <div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-academy-blue hover:bg-academy-purple text-white font-semibold py-3"
                >
                  {loading ? 'Inscription en cours...' : "S'inscrire maintenant"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
