import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PaymentTransaction {
  id: string;
  user_id: string;
  course_id: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  transaction_ref: string | null;
  paid_at: string | null;
  metadata: any;
  notes: string | null;
  created_at: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  user_id: string;
  transaction_id: string | null;
  amount: number;
  tax_amount: number;
  total_amount: number;
  invoice_date: string;
  due_date: string | null;
  status: string;
  pdf_url: string | null;
  created_at: string;
}

interface PaymentPlan {
  id: string;
  user_id: string;
  course_id: string | null;
  total_amount: number;
  paid_amount: number;
  remaining_amount: number;
  installments: any;
  status: string;
  notes: string | null;
  created_at: string;
}

export const useStudentFinancials = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getFinancialSummary = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_student_financial_summary', {
        p_user_id: userId
      });
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching financial summary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le résumé financier",
        variant: "destructive"
      });
      return null;
    }
  };

  const getPaymentHistory = async (userId: string): Promise<PaymentTransaction[]> => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  };

  const getInvoices = async (userId: string): Promise<Invoice[]> => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  };

  const getPaymentPlans = async (userId: string): Promise<PaymentPlan[]> => {
    try {
      const { data, error } = await supabase
        .from('payment_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching payment plans:', error);
      return [];
    }
  };

  const recordPayment = async (paymentData: {
    user_id: string;
    course_id?: string;
    amount: number;
    payment_method: string;
    payment_date?: Date;
    notes?: string;
  }) => {
    setLoading(true);
    try {
      const { data: payment, error } = await supabase
        .from('payment_transactions')
        .insert({
          user_id: paymentData.user_id,
          course_id: paymentData.course_id,
          amount: paymentData.amount,
          payment_method: paymentData.payment_method,
          notes: paymentData.notes,
          payment_status: 'completed',
          paid_at: paymentData.payment_date 
            ? paymentData.payment_date.toISOString() 
            : new Date().toISOString(),
          transaction_ref: `TXN-${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-generate invoice for the payment
      const invoice = await generateInvoice({
        user_id: paymentData.user_id,
        transaction_id: payment.id,
        amount: paymentData.amount,
        tax_amount: 0
      });

      toast({
        title: "Succès",
        description: "Paiement et facture créés avec succès"
      });

      return { payment, invoice };
    } catch (error: any) {
      console.error('Error recording payment:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'enregistrement du paiement",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateInvoice = async (invoiceData: {
    user_id: string;
    transaction_id?: string;
    amount: number;
    tax_amount?: number;
  }) => {
    setLoading(true);
    try {
      // Generate invoice number
      const { data: invoiceNumber, error: invoiceNumError } = await supabase
        .rpc('generate_invoice_number');

      if (invoiceNumError) throw invoiceNumError;

      const totalAmount = invoiceData.amount + (invoiceData.tax_amount || 0);

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          user_id: invoiceData.user_id,
          transaction_id: invoiceData.transaction_id,
          amount: invoiceData.amount,
          tax_amount: invoiceData.tax_amount || 0,
          total_amount: totalAmount,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Succès",
        description: `Facture ${invoiceNumber} générée`
      });

      return data;
    } catch (error: any) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération de la facture",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Statut de la facture mis à jour"
      });

      return true;
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    loading,
    getFinancialSummary,
    getPaymentHistory,
    getInvoices,
    getPaymentPlans,
    recordPayment,
    generateInvoice,
    updateInvoiceStatus
  };
};
