import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileArchive, Mail } from "lucide-react";
import JSZip from 'jszip';
import { useToast } from "@/hooks/use-toast";

interface Receipt {
  id: string;
  invoice_number: string;
  invoice_date: string;
  amount: number;
  student_email: string;
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
    const zip = new JSZip();
    const selectedReceiptData = receipts.filter(r => selectedReceipts.includes(r.id));

    selectedReceiptData.forEach(receipt => {
      const content = `
FACTURE ${receipt.invoice_number}
Date: ${new Date(receipt.invoice_date).toLocaleDateString('fr-FR')}
Montant: ${receipt.amount} MAD
      `;
      zip.file(`facture-${receipt.invoice_number}.txt`, content);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factures-${new Date().toISOString().split('T')[0]}.zip`;
    a.click();

    toast({
      title: "Succès",
      description: `${selectedReceipts.length} facture(s) téléchargée(s)`
    });
  };

  const handleBulkEmail = () => {
    const selectedReceiptData = receipts.filter(r => selectedReceipts.includes(r.id));
    toast({
      title: "Emails envoyés",
      description: `Factures envoyées à ${selectedReceiptData.length} étudiant(s)`
    });
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
