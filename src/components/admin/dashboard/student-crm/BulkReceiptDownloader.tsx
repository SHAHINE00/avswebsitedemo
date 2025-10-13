import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileArchive, Mail, Download } from "lucide-react";
import JSZip from 'jszip';
import { useToast } from "@/hooks/use-toast";
import { generateInvoicePDF } from "./InvoicePDFGenerator";
import { supabase } from "@/integrations/supabase/client";

interface Receipt {
  id: string;
  invoice_number: string;
  invoice_date: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  status: string;
  student_email: string;
  user_id: string;
}

interface BulkReceiptDownloaderProps {
  receipts: Receipt[];
}

export const BulkReceiptDownloader = ({ receipts }: BulkReceiptDownloaderProps) => {
  const [selectedReceipts, setSelectedReceipts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelectAll = () => {
    if (selectedReceipts.length === receipts.length) {
      setSelectedReceipts([]);
    } else {
      setSelectedReceipts(receipts.map(r => r.id));
    }
  };

  const handleToggleReceipt = (id: string) => {
    setSelectedReceipts(prev =>
      prev.includes(id)
        ? prev.filter(r => r !== id)
        : [...prev, id]
    );
  };

  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      const selectedReceiptData = receipts.filter(r => selectedReceipts.includes(r.id));

      // Fetch student profiles for selected receipts
      const userIds = [...new Set(selectedReceiptData.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, city, postal_code, country')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      selectedReceiptData.forEach(receipt => {
        const student = profileMap.get(receipt.user_id) || {
          full_name: 'N/A',
          email: receipt.student_email,
          phone: undefined,
          address: undefined,
          city: undefined,
          postal_code: undefined,
          country: undefined
        };

        const pdf = generateInvoicePDF(receipt, student);
        const pdfBlob = pdf.output('blob');
        zip.file(`facture-${receipt.invoice_number}.pdf`, pdfBlob);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factures-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: `${selectedReceipts.length} facture(s) téléchargée(s)`
      });
    } catch (error: any) {
      console.error('Error downloading receipts:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive"
      });
    }
  };

  const handleDownloadAll = async () => {
    try {
      const zip = new JSZip();

      // Fetch all student profiles
      const userIds = [...new Set(receipts.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, address, city, postal_code, country')
        .in('id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      receipts.forEach(receipt => {
        const student = profileMap.get(receipt.user_id) || {
          full_name: 'N/A',
          email: receipt.student_email,
          phone: undefined,
          address: undefined,
          city: undefined,
          postal_code: undefined,
          country: undefined
        };

        const pdf = generateInvoicePDF(receipt, student);
        const pdfBlob = pdf.output('blob');
        zip.file(`facture-${receipt.invoice_number}.pdf`, pdfBlob);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `toutes-factures-${new Date().toISOString().split('T')[0]}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: `${receipts.length} facture(s) téléchargée(s)`
      });
    } catch (error: any) {
      console.error('Error downloading all receipts:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement",
        variant: "destructive"
      });
    }
  };

  const handleBulkEmail = async () => {
    try {
      const selectedReceiptData = receipts.filter(r => selectedReceipts.includes(r.id));
      
      const promises = selectedReceiptData.map(receipt =>
        supabase.functions.invoke('send-invoice-email', {
          body: {
            invoice: receipt,
            student: { email: receipt.student_email, id: receipt.user_id },
            user_id: receipt.user_id
          }
        })
      );

      const results = await Promise.allSettled(promises);
      const succeeded = results.filter(r => r.status === 'fulfilled').length;

      toast({
        title: "Emails envoyés",
        description: `${succeeded}/${selectedReceipts.length} facture(s) envoyée(s)`
      });
    } catch (error: any) {
      console.error('Error sending bulk emails:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'envoi des emails",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selectedReceipts.length === receipts.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            Sélectionner tout ({selectedReceipts.length}/{receipts.length})
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownloadAll}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger Tout
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedReceipts.length === 0}
            onClick={handleDownloadZip}
          >
            <FileArchive className="w-4 h-4 mr-2" />
            Télécharger ZIP
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedReceipts.length === 0}
            onClick={handleBulkEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            Envoyer par Email
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {receipts.map(receipt => (
          <div key={receipt.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <Checkbox
              checked={selectedReceipts.includes(receipt.id)}
              onCheckedChange={() => handleToggleReceipt(receipt.id)}
            />
            <div className="flex-1">
              <p className="font-medium">{receipt.invoice_number}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(receipt.invoice_date).toLocaleDateString('fr-FR')} - {receipt.amount} MAD
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
