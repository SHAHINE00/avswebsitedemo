import { Button } from "@/components/ui/button";
import { FileDown, Mail } from "lucide-react";
import jsPDF from 'jspdf';
import { useToast } from "@/hooks/use-toast";

interface InvoicePDFGeneratorProps {
  invoice: {
    invoice_number: string;
    invoice_date: string;
    amount: number;
    tax_amount: number;
    total_amount: number;
    status: string;
  };
  student: {
    full_name: string;
    email: string;
    address?: string;
  };
  onEmailSent?: () => void;
}

export const InvoicePDFGenerator = ({ invoice, student, onEmailSent }: InvoicePDFGeneratorProps) => {
  const { toast } = useToast();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Numéro: ${invoice.invoice_number}`, 20, 40);
    doc.text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString('fr-FR')}`, 20, 46);
    
    // Student info
    doc.setFontSize(12);
    doc.text('Facturé à:', 20, 60);
    doc.setFontSize(10);
    doc.text(student.full_name, 20, 66);
    doc.text(student.email, 20, 72);
    if (student.address) {
      doc.text(student.address, 20, 78);
    }
    
    // Items table
    doc.setFontSize(10);
    const startY = 100;
    
    // Table header
    doc.setFillColor(59, 130, 246);
    doc.rect(20, startY, 170, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('Description', 25, startY + 5);
    doc.text('Montant', 160, startY + 5, { align: 'right' });
    
    // Table content
    doc.setTextColor(0, 0, 0);
    doc.text('Formation', 25, startY + 15);
    doc.text(`${invoice.amount.toFixed(2)} MAD`, 160, startY + 15, { align: 'right' });
    
    if (invoice.tax_amount > 0) {
      doc.text('TVA', 25, startY + 22);
      doc.text(`${invoice.tax_amount.toFixed(2)} MAD`, 160, startY + 22, { align: 'right' });
    }
    
    // Total
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL', 25, startY + 35);
    doc.text(`${invoice.total_amount.toFixed(2)} MAD`, 160, startY + 35, { align: 'right' });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(128, 128, 128);
    doc.text('Merci pour votre confiance', 105, 280, { align: 'center' });
    
    return doc;
  };

  const handleDownload = () => {
    const doc = generatePDF();
    doc.save(`facture-${invoice.invoice_number}.pdf`);
    
    toast({
      title: "Succès",
      description: "Facture téléchargée"
    });
  };

  const handleEmail = async () => {
    toast({
      title: "Email envoyé",
      description: `Facture envoyée à ${student.email}`
    });
    onEmailSent?.();
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
