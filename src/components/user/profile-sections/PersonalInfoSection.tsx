import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Edit, Save, X, Phone, MapPin, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  full_name: string;
  phone: string;
  date_of_birth: Date | null;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  bio: string;
}

const PersonalInfoSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    full_name: '',
    phone: '',
    date_of_birth: null,
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
    bio: ''
  });

  useEffect(() => {
    fetchPersonalInfo();
  }, [user]);

  const fetchPersonalInfo = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      const profile: any = data;
      if (profile) {
        setPersonalInfo({
          full_name: profile.full_name || '',
          phone: profile.phone || '',
          date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth) : null,
          address: profile.address || '',
          city: profile.city || '',
          postal_code: profile.postal_code || '',
          country: profile.country || 'France',
          bio: profile.bio || ''
        });
      }
    } catch (error) {
      console.error('Error fetching personal info:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: personalInfo.full_name,
          phone: personalInfo.phone,
          date_of_birth: personalInfo.date_of_birth?.toISOString() as any,
          address: personalInfo.address,
          city: personalInfo.city,
          postal_code: personalInfo.postal_code,
          country: personalInfo.country,
          bio: personalInfo.bio,
          updated_at: new Date().toISOString()
        } as any)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Informations personnelles mises à jour",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les informations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Informations personnelles</h3>
        {!isEditing ? (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
            <Button 
              size="sm"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom complet</Label>
              {isEditing ? (
                <Input
                  value={personalInfo.full_name}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Votre nom complet"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-accent/20 rounded">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.full_name || 'Non renseigné'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <div className="flex items-center gap-2 p-2 bg-accent/20 rounded">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
                <Badge variant="secondary" className="ml-auto">Vérifié</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Téléphone</Label>
              {isEditing ? (
                <Input
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+33 6 12 34 56 78"
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-accent/20 rounded">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{personalInfo.phone || 'Non renseigné'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Date de naissance</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !personalInfo.date_of_birth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {personalInfo.date_of_birth ? (
                        format(personalInfo.date_of_birth, "PPP", { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={personalInfo.date_of_birth || undefined}
                      onSelect={(date) => setPersonalInfo(prev => ({ ...prev, date_of_birth: date || null }))}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-accent/20 rounded">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {personalInfo.date_of_birth 
                      ? format(personalInfo.date_of_birth, "PPP", { locale: fr })
                      : 'Non renseigné'
                    }
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-5 w-5" />
              Adresse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Adresse</Label>
              {isEditing ? (
                <Input
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 rue de la République"
                />
              ) : (
                <div className="p-2 bg-accent/20 rounded">
                  {personalInfo.address || 'Non renseigné'}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ville</Label>
                {isEditing ? (
                  <Input
                    value={personalInfo.city}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Paris"
                  />
                ) : (
                  <div className="p-2 bg-accent/20 rounded">
                    {personalInfo.city || 'Non renseigné'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Code postal</Label>
                {isEditing ? (
                  <Input
                    value={personalInfo.postal_code}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, postal_code: e.target.value }))}
                    placeholder="75001"
                  />
                ) : (
                  <div className="p-2 bg-accent/20 rounded">
                    {personalInfo.postal_code || 'Non renseigné'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pays</Label>
              {isEditing ? (
                <Input
                  value={personalInfo.country}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, country: e.target.value }))}
                  placeholder="France"
                />
              ) : (
                <div className="p-2 bg-accent/20 rounded">
                  {personalInfo.country || 'Non renseigné'}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Biographie</Label>
              {isEditing ? (
                <Textarea
                  value={personalInfo.bio}
                  onChange={(e) => setPersonalInfo(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Présentez-vous en quelques mots..."
                  rows={3}
                />
              ) : (
                <div className="p-2 bg-accent/20 rounded min-h-[60px]">
                  {personalInfo.bio || 'Aucune biographie renseignée'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PersonalInfoSection;