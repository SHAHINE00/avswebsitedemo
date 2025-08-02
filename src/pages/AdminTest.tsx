import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { logError } from '@/utils/logger';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Shield, Database, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResponsiveTestSuite from '@/components/testing/ResponsiveTestSuite';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

const AdminTest = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      logError('Error checking admin status:', error);
    }
  };

  const runTests = async () => {
    setLoading(true);
    const testResults: TestResult[] = [];

    // Authentication Status
    testResults.push({
      name: 'Authentification utilisateur',
      status: user ? 'success' : 'error',
      message: user ? `Connecté en tant que: ${user.email}` : 'Utilisateur non connecté'
    });

    // Admin Role Check
    testResults.push({
      name: 'Vérification rôle administrateur',
      status: isAdmin ? 'success' : 'error',
      message: isAdmin ? 'Rôle administrateur confirmé' : 'Accès administrateur requis'
    });

    // Database Connection
    try {
      const { data, error } = await supabase.from('courses').select('count').limit(1);
      testResults.push({
        name: 'Connexion base de données',
        status: error ? 'error' : 'success',
        message: error ? `Erreur DB: ${error.message}` : 'Connexion DB réussie'
      });
    } catch (error) {
      testResults.push({
        name: 'Connexion base de données',
        status: 'error',
        message: 'Échec de connexion à la base de données'
      });
    }

    // Courses Data
    try {
      const { data: courses, error } = await supabase.from('courses').select('*');
      testResults.push({
        name: 'Données des cours',
        status: error ? 'error' : 'success',
        message: error ? `Erreur cours: ${error.message}` : `${courses?.length || 0} cours trouvés`
      });
    } catch (error) {
      testResults.push({
        name: 'Données des cours',
        status: 'error',
        message: 'Échec de récupération des cours'
      });
    }

    // User Profiles
    if (isAdmin) {
      try {
        const { data: profiles, error } = await supabase.from('profiles').select('*');
        testResults.push({
          name: 'Profils utilisateurs',
          status: error ? 'error' : 'success',
          message: error ? `Erreur profils: ${error.message}` : `${profiles?.length || 0} profils trouvés`
        });
      } catch (error) {
        testResults.push({
          name: 'Profils utilisateurs',
          status: 'error',
          message: 'Échec de récupération des profils'
        });
      }
    }

    // Admin Functions
    if (isAdmin) {
      try {
        const { data, error } = await supabase.rpc('get_dashboard_metrics');
        testResults.push({
          name: 'Fonctions administrateur',
          status: error ? 'error' : 'success',
          message: error ? `Erreur fonction admin: ${error.message}` : 'Fonctions admin opérationnelles'
        });
      } catch (error) {
        testResults.push({
          name: 'Fonctions administrateur',
          status: 'error',
          message: 'Échec des fonctions administrateur'
        });
      }
    }

    setTests(testResults);
    setLoading(false);
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600">Cette page de test nécessite des privilèges administrateur.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Réussi</Badge>;
      case 'error':
        return <Badge variant="destructive">Échec</Badge>;
      default:
        return <Badge variant="secondary">En cours</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-6 h-6" />
                  Test de Fonctionnalité Système
                </CardTitle>
                <CardDescription>
                  Vérification de l'état de l'authentification et du système administrateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <User className="w-5 h-5" />
                    <span>Utilisateur: {user.email}</span>
                    {isAdmin && <Badge className="bg-blue-100 text-blue-800">Administrateur</Badge>}
                  </div>
                  <Button onClick={runTests} disabled={loading}>
                    {loading ? 'Test en cours...' : 'Lancer les tests'}
                  </Button>
                </div>

                {tests.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Résultats des tests:</h3>
                    {tests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(test.status)}
                          <div>
                            <p className="font-medium">{test.name}</p>
                            <p className="text-sm text-gray-600">{test.message}</p>
                          </div>
                        </div>
                        {getStatusBadge(test.status)}
                      </div>
                    ))}
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">Résumé:</h4>
                      <div className="flex gap-4">
                        <span className="text-green-600">
                          ✓ {tests.filter(t => t.status === 'success').length} réussis
                        </span>
                        <span className="text-red-600">
                          ✗ {tests.filter(t => t.status === 'error').length} échecs
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <ResponsiveTestSuite />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Actions rapides
                </CardTitle>
                <CardDescription>Accès direct aux fonctionnalités d'administration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button asChild className="h-auto p-4 flex-col gap-2">
                    <a href="/admin/courses">
                      <Database className="w-6 h-6" />
                      <span className="font-medium">Gérer les cours</span>
                      <span className="text-xs opacity-70">Administration des formations</span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                    <a href="/curriculum">
                      <User className="w-6 h-6" />
                      <span className="font-medium">Formations publiques</span>
                      <span className="text-xs opacity-70">Vue utilisateur</span>
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col gap-2">
                    <a href="/contact">
                      <Settings className="w-6 h-6" />
                      <span className="font-medium">Contact</span>
                      <span className="text-xs opacity-70">Formulaire de contact</span>
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTest;