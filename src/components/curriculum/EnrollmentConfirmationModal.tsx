
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, Clock, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface EnrollmentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  courseDuration?: string;
  onViewDashboard: () => void;
}

const EnrollmentConfirmationModal: React.FC<EnrollmentConfirmationModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  courseDuration,
  onViewDashboard
}) => {
  const { user } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Inscription confirmée !
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Félicitations ! Vous êtes maintenant inscrit à la formation
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              {courseTitle}
            </h3>
            {courseDuration && (
              <p className="text-sm text-blue-600 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Durée: {courseDuration}
              </p>
            )}
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <Award className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Accès immédiat au contenu de formation</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Suivi de progression personnalisé</span>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Support pédagogique inclus</span>
            </div>
          </div>
          
          {user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Un email de confirmation a été envoyé à <strong>{user.email}</strong>
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={onClose} variant="outline" className="w-full sm:w-auto">
            Continuer à explorer
          </Button>
          <Button onClick={onViewDashboard} className="w-full sm:w-auto bg-academy-blue hover:bg-academy-purple">
            Voir mon tableau de bord
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentConfirmationModal;
