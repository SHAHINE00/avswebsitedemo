import { Button } from "@/components/ui/button";
import { FileDown, Mail } from "lucide-react";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface InvoicePDFGeneratorProps {
  invoice: {
    id?: string;
    invoice_number: string;
    invoice_date: string;
    amount: number;
    tax_amount: number;
    total_amount: number;
    status: string;
  };
  student: {
    id?: string;
    full_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    postal_code?: string;
    country?: string;
  };
  onEmailSent?: () => void;
}

// Export the PDF generation function for reuse
export const generateInvoicePDF = (invoice: InvoicePDFGeneratorProps['invoice'], student: InvoicePDFGeneratorProps['student']) => {
  const doc = new jsPDF();
  
  // Modern Tech Header - Dark gradient background
  doc.setFillColor(15, 23, 42); // #0f172a
  doc.rect(0, 0, 210, 50, 'F');
  
  // Accent gradient bar
  doc.setFillColor(14, 165, 233); // #0ea5e9
  doc.rect(0, 0, 210, 3, 'F');
  
  // Circuit board pattern lines (decorative)
  doc.setDrawColor(51, 65, 85); // #334155
  doc.setLineWidth(0.3);
  for (let i = 0; i < 5; i++) {
    doc.line(20 + (i * 35), 45, 30 + (i * 35), 50);
    doc.line(30 + (i * 35), 50, 40 + (i * 35), 45);
  }
  
  // Company Name - Large and Bold
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('AVS INNOVATION INSTITUT', 105, 18, { align: 'center' });
  
  // Subtitle
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(6, 182, 212); // #06b6d4 cyan
  doc.text('Institut d\'Innovation et de Formation Technologique', 105, 26, { align: 'center' });
  
  // Contact info
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // #94a3b8
  doc.text('Avenue Allal El Fassi – Alpha 2000, Marrakech – MAROC', 105, 33, { align: 'center' });
  doc.text('Email: info@avs.ma | Tél: +212 6 62 63 29 53 / +212 5 24 31 19 82', 105, 38, { align: 'center' });
  doc.text('Web: www.avs.ma', 105, 43, { align: 'center' });
  
  // INVOICE Title - Large with accent
  doc.setFontSize(24);
  doc.setTextColor(14, 165, 233); // #0ea5e9
  doc.setFont(undefined, 'bold');
  doc.text('FACTURE', 105, 63, { align: 'center' });
  
  // Tech-style line under title
  doc.setDrawColor(139, 92, 246); // #8b5cf6 purple
  doc.setLineWidth(1);
  doc.line(75, 65, 135, 65);
  
  // Invoice metadata box - Modern card style
  doc.setFillColor(30, 41, 59); // #1e293b dark
  doc.roundedRect(130, 72, 65, 35, 3, 3, 'F');
  
  // Border accent
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(0.5);
  doc.roundedRect(130, 72, 65, 35, 3, 3);
  
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont(undefined, 'bold');
  doc.text('N° FACTURE', 133, 78);
  
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.setFont('courier', 'normal'); // Monospace for invoice number
  doc.text(invoice.invoice_number, 133, 85);
  
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont(undefined, 'bold');
  doc.text('DATE', 133, 93);
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'normal');
  doc.text(new Date(invoice.invoice_date).toLocaleDateString('fr-FR'), 133, 100);
  
  // Student information box - Modern card
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(15, 72, 110, 55, 3, 3, 'F');
  
  // Border accent
  doc.setDrawColor(139, 92, 246); // purple accent
  doc.setLineWidth(0.5);
  doc.roundedRect(15, 72, 110, 55, 3, 3);
  
  // Header
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text('FACTURÉ À', 19, 78);
  
  // Student details
  let studentY = 86;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(student.full_name || 'N/A', 19, studentY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  studentY += 6;
  doc.text(student.email || '', 19, studentY);
  
  if (student.phone) {
    studentY += 5;
    doc.text(`Tél: ${student.phone}`, 19, studentY);
  }
  
  if (student.address) {
    studentY += 5;
    const addressLines = doc.splitTextToSize(student.address, 100);
    doc.text(addressLines, 19, studentY);
    studentY += (addressLines.length * 4.5);
  }
  
  if (student.city || student.postal_code) {
    studentY += 5;
    doc.text(`${student.postal_code || ''} ${student.city || ''}`, 19, studentY);
  }
  
  if (student.country && student.country !== 'Morocco' && student.country !== 'Maroc') {
    studentY += 5;
    doc.text(student.country, 19, studentY);
  }
  
  // Items table - Modern design
  const tableStartY = 140;
  
  // Table header - Dark with gradient accent
  doc.setFillColor(15, 23, 42);
  doc.rect(15, tableStartY, 180, 12, 'F');
  
  // Top accent line
  doc.setFillColor(14, 165, 233);
  doc.rect(15, tableStartY, 180, 2, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('DESCRIPTION', 20, tableStartY + 9);
  doc.text('MONTANT (MAD)', 180, tableStartY + 9, { align: 'right' });
  
  // Table content with alternating rows
  doc.setFillColor(248, 250, 252); // light background
  doc.rect(15, tableStartY + 12, 180, 10, 'F');
  
  doc.setTextColor(15, 23, 42);
  doc.setFont(undefined, 'normal');
  
  let currentY = tableStartY + 19;
  
  // Formation line
  doc.text('Formation Professionnelle', 20, currentY);
  doc.text(invoice.amount.toFixed(2), 180, currentY, { align: 'right' });
  
  currentY += 10;
  
  // Tax if applicable
  if (invoice.tax_amount > 0) {
    doc.setFillColor(241, 245, 249);
    doc.rect(15, currentY - 5, 180, 10, 'F');
    
    doc.text('TVA (20%)', 20, currentY);
    doc.text(invoice.tax_amount.toFixed(2), 180, currentY, { align: 'right' });
    currentY += 10;
  }
  
  // Total section - Highlighted with gradient
  doc.setFillColor(30, 41, 59);
  doc.rect(15, currentY, 180, 15, 'F');
  
  // Accent border
  doc.setDrawColor(14, 165, 233);
  doc.setLineWidth(1);
  doc.line(15, currentY, 195, currentY);
  
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(6, 182, 212);
  doc.text('TOTAL À PAYER', 20, currentY + 10);
  
  doc.setFontSize(16);
  doc.setTextColor(14, 165, 233);
  doc.text(`${invoice.total_amount.toFixed(2)} MAD`, 180, currentY + 10, { align: 'right' });
  
  // Status badge - Modern with glow effect
  currentY += 22;
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  
  if (invoice.status === 'paid') {
    doc.setFillColor(16, 185, 129); // #10b981 green
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(20, currentY, 28, 8, 2, 2, 'F');
    doc.text('PAYÉE', 22, currentY + 5.5);
  } else if (invoice.status === 'pending') {
    doc.setFillColor(245, 158, 11); // #f59e0b amber
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(20, currentY, 35, 8, 2, 2, 'F');
    doc.text('EN ATTENTE', 22, currentY + 5.5);
  }
  
  // Legal information section
  currentY += 20;
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('INFORMATIONS LÉGALES', 20, currentY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('ICE: 002876419000039 | RC: 145892 | IF: 40254941 | CNSS: 8514623', 20, currentY + 5);
  
  // Payment terms
  currentY += 12;
  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('CONDITIONS DE PAIEMENT', 20, currentY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Paiement à réception de facture | Virement bancaire, espèces ou carte acceptés', 20, currentY + 5);
  doc.text('RIB: 007 810 0001172000012345 67 | IBAN: MA64 007 810 0001172000012345 67', 20, currentY + 9);
  
  // Footer - Tech style
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 270, 210, 27, 'F');
  
  // Top accent line
  doc.setFillColor(139, 92, 246);
  doc.rect(0, 270, 210, 1.5, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.setFont(undefined, 'normal');
  doc.text('Merci pour votre confiance et votre engagement dans votre formation technologique.', 105, 279, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('AVS INNOVATION INSTITUT - Avenue Allal El Fassi, Alpha 2000, Marrakech – MAROC', 105, 286, { align: 'center' });
  doc.text('info@avs.ma | www.avs.ma | +212 6 62 63 29 53', 105, 291, { align: 'center' });
  
  return doc;
};

export const InvoicePDFGenerator = ({ invoice, student, onEmailSent }: InvoicePDFGeneratorProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    const doc = generateInvoicePDF(invoice, student);
    doc.save(`facture-${invoice.invoice_number}.pdf`);
    
    toast({
      title: "Succès",
      description: "Facture téléchargée"
    });
  };

  const handleEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-invoice-email', {
        body: {
          invoice,
          student,
          user_id: student.id
        }
      });

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Facture envoyée à ${student.email}`
      });
      onEmailSent?.();
    } catch (error: any) {
      console.error('Error sending invoice email:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi de l'email",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={handleDownload}>
        <FileDown className="w-4 h-4 mr-2" />
        Télécharger PDF
      </Button>
      <Button size="sm" variant="outline" onClick={handleEmail}>
        <Mail className="w-4 h-4 mr-2" />
        Envoyer par Email
      </Button>
    </div>
  );
};
