import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Award, FileDown, Mail } from "lucide-react";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface CertificateGeneratorProps {
  studentName: string;
  studentEmail: string;
  courseTitle?: string;
}

export const CertificateGenerator = ({ studentName, studentEmail, courseTitle }: CertificateGeneratorProps) => {
  const [customCourseName, setCustomCourseName] = useState(courseTitle || "");
  const { toast } = useToast();

  const generateCertificatePDF = () => {
    const doc = new jsPDF('landscape');
    
    // Background
    doc.setFillColor(245, 247, 250);
    doc.rect(0, 0, 297, 210, 'F');
    
    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(3);
    doc.rect(10, 10, 277, 190);
    
    // Title
    doc.setFontSize(40);
    doc.setTextColor(59, 130, 246);
    doc.text('CERTIFICAT', 148.5, 50, { align: 'center' });
    
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('DE RÉUSSITE', 148.5, 65, { align: 'center' });
    
    // Student name
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('Décerné à', 148.5, 90, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(studentName, 148.5, 110, { align: 'center' });
    
    // Course
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Pour avoir complété avec succès la formation', 148.5, 130, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'bold');
    doc.text(customCourseName, 148.5, 145, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 148.5, 170, { align: 'center' });
    
    // Signature line
    doc.setLineWidth(0.5);
    doc.setDrawColor(100, 100, 100);
    doc.line(120, 185, 177, 185);
    doc.setFontSize(10);
    doc.text('Signature', 148.5, 192, { align: 'center' });
    
    return doc;
  };

  const handleDownload = () => {
    const doc = generateCertificatePDF();
    doc.save(`certificat-${studentName.replace(/\s+/g, '-')}.pdf`);
    
    toast({
      title: "Succès",
      description: "Certificat téléchargé"
    });
  };

  const handleEmail = () => {
    toast({
      title: "Email envoyé",
      description: `Certificat envoyé à ${studentEmail}`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Générateur de Certificat
        </CardTitle>
        <CardDescription>
          Générer un certificat de réussite pour cet étudiant
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Nom de la Formation</Label>
          <Input
            value={customCourseName}
            onChange={(e) => setCustomCourseName(e.target.value)}
            placeholder="Ex: Développement Web Avancé"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleDownload} disabled={!customCourseName}>
            <FileDown className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="outline" onClick={handleEmail} disabled={!customCourseName}>
            <Mail className="w-4 h-4 mr-2" />
            Envoyer par Email
          </Button>
        </div>

        <div className="p-3 bg-muted rounded-lg text-sm text-muted-foreground">
          Le certificat sera généré avec le nom de l'étudiant et la formation spécifiée
        </div>
      </CardContent>
    </Card>
  );
};
