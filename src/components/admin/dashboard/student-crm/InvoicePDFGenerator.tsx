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
  
  // Company Header with styling
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('AVS INSTITUTE', 105, 15, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Centre de Formation Professionnelle', 105, 22, { align: 'center' });
  doc.text('Avenue Allal El Fassi – Alpha 2000, Marrakech | info@avs.ma', 105, 28, { align: 'center' });
  doc.text('Tél: +212 6 62 63 29 53 / +212 5 24 31 19 82', 105, 34, { align: 'center' });
  
  // Invoice Title
  doc.setFontSize(20);
  doc.setTextColor(59, 130, 246);
  doc.setFont(undefined, 'bold');
  doc.text('FACTURE', 105, 57, { align: 'center' });
  
  // Invoice metadata box
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(0.5);
  doc.rect(130, 65, 60, 25);
  
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'bold');
  doc.text('N° Facture:', 133, 72);
  doc.setFont(undefined, 'normal');
  doc.text(invoice.invoice_number, 133, 77);
  
  doc.setFont(undefined, 'bold');
  doc.text('Date:', 133, 83);
  doc.setFont(undefined, 'normal');
  doc.text(new Date(invoice.invoice_date).toLocaleDateString('fr-FR'), 133, 88);
  
  // Student information box
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Facturé à:', 20, 72);
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(20, 75, 100, 50);
  
  let studentY = 82;
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(student.full_name || 'N/A', 23, studentY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  studentY += 6;
  doc.text(student.email || '', 23, studentY);
  
  if (student.phone) {
    studentY += 6;
    doc.text(`Tél: ${student.phone}`, 23, studentY);
  }
  
  if (student.address) {
    studentY += 6;
    const addressLines = doc.splitTextToSize(student.address, 90);
    doc.text(addressLines, 23, studentY);
    studentY += (addressLines.length * 5);
  }
  
  if (student.city || student.postal_code) {
    studentY += 6;
    doc.text(`${student.postal_code || ''} ${student.city || ''}`, 23, studentY);
  }
  
  if (student.country && student.country !== 'Morocco' && student.country !== 'Maroc') {
    studentY += 6;
    doc.text(student.country, 23, studentY);
  }
  
  // Items table
  const tableStartY = 135;
  
  // Table header
  doc.setFillColor(59, 130, 246);
  doc.rect(20, tableStartY, 170, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'bold');
  doc.text('Description', 25, tableStartY + 7);
  doc.text('Montant (MAD)', 175, tableStartY + 7, { align: 'right' });
  
  // Table content
  doc.setTextColor(0, 0, 0);
  doc.setFont(undefined, 'normal');
  
  let currentY = tableStartY + 17;
  
  // Formation line
  doc.text('Formation Professionnelle', 25, currentY);
  doc.text(invoice.amount.toFixed(2), 175, currentY, { align: 'right' });
  
  // Separator line
  doc.setDrawColor(230, 230, 230);
  doc.line(20, currentY + 3, 190, currentY + 3);
  
  currentY += 10;
  
  // Tax if applicable
  if (invoice.tax_amount > 0) {
    doc.text('TVA (20%)', 25, currentY);
    doc.text(invoice.tax_amount.toFixed(2), 175, currentY, { align: 'right' });
    doc.line(20, currentY + 3, 190, currentY + 3);
    currentY += 10;
  }
  
  // Total section with highlight
  doc.setFillColor(245, 245, 245);
  doc.rect(20, currentY, 170, 12, 'F');
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(59, 130, 246);
  doc.text('TOTAL À PAYER', 25, currentY + 8);
  doc.text(`${invoice.total_amount.toFixed(2)} MAD`, 175, currentY + 8, { align: 'right' });
  
  // Status badge
  doc.setFontSize(9);
  if (invoice.status === 'paid') {
    doc.setFillColor(34, 197, 94);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(25, currentY + 15, 25, 7, 2, 2, 'F');
    doc.text('PAYÉE', 27, currentY + 20);
  } else if (invoice.status === 'pending') {
    doc.setFillColor(234, 179, 8);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(25, currentY + 15, 30, 7, 2, 2, 'F');
    doc.text('EN ATTENTE', 27, currentY + 20);
  }
  
  // Footer with terms
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Conditions de paiement: Paiement à réception de facture', 105, 260, { align: 'center' });
  doc.text('Merci pour votre confiance et votre engagement dans votre formation.', 105, 267, { align: 'center' });
  
  // Bottom border
  doc.setDrawColor(59, 130, 246);
  doc.setLineWidth(2);
  doc.line(20, 280, 190, 280);
  
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 150);
  doc.text('AVS Institute - Avenue Allal El Fassi, Alpha 2000, Marrakech - info@avs.ma', 105, 287, { align: 'center' });
  
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
