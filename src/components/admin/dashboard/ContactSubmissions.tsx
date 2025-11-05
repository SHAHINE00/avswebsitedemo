import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Calendar, MessageSquare, Search, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ContactSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  submitted_at: string;
  read_at: string | null;
  replied_at: string | null;
  admin_notes: string | null;
}

export const ContactSubmissions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      return data as ContactSubmission[];
    },
  });

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ status: "read", read_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast({
        title: "Marqué comme lu",
        description: "La soumission a été marquée comme lue",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme lu",
        variant: "destructive",
      });
    }
  };

  const markAsReplied = async (id: string) => {
    try {
      const { error } = await supabase
        .from("contact_submissions")
        .update({ 
          status: "replied", 
          replied_at: new Date().toISOString(),
          admin_notes: adminNotes 
        })
        .eq("id", id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      setSelectedSubmission(null);
      setAdminNotes("");
      toast({
        title: "Marqué comme traité",
        description: "La soumission a été marquée comme traitée",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de marquer comme traité",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions?.filter((sub) => {
    const matchesSearch = 
      sub.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Nouveau</Badge>;
      case "read":
        return <Badge variant="secondary">Lu</Badge>;
      case "replied":
        return <Badge variant="outline" className="bg-success/10 text-success">Traité</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: submissions?.length || 0,
    new: submissions?.filter(s => s.status === "new").length || 0,
    read: submissions?.filter(s => s.status === "read").length || 0,
    replied: submissions?.filter(s => s.status === "replied").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.new}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Lus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">{stats.read}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.replied}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Soumissions de contact</CardTitle>
          <CardDescription>Gérer les messages reçus via le formulaire de contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email ou sujet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === "new" ? "default" : "outline"}
                onClick={() => setFilterStatus("new")}
              >
                Nouveaux
              </Button>
              <Button
                variant={filterStatus === "read" ? "default" : "outline"}
                onClick={() => setFilterStatus("read")}
              >
                Lus
              </Button>
              <Button
                variant={filterStatus === "replied" ? "default" : "outline"}
                onClick={() => setFilterStatus("replied")}
              >
                Traités
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Aucune soumission trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions?.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(submission.submitted_at), "dd MMM yyyy HH:mm", { locale: fr })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {submission.first_name} {submission.last_name}
                      </TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{submission.subject}</TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setAdminNotes(submission.admin_notes || "");
                            if (submission.status === "new") {
                              markAsRead(submission.id);
                            }
                          }}
                        >
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
            <DialogDescription>
              Reçu le {selectedSubmission && format(new Date(selectedSubmission.submitted_at), "dd MMMM yyyy à HH:mm", { locale: fr })}
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Nom complet
                  </label>
                  <p className="mt-1">{selectedSubmission.first_name} {selectedSubmission.last_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="mt-1">
                    <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline">
                      {selectedSubmission.email}
                    </a>
                  </p>
                </div>
              </div>

              {selectedSubmission.phone && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Téléphone
                  </label>
                  <p className="mt-1">{selectedSubmission.phone}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sujet
                </label>
                <p className="mt-1 font-medium">{selectedSubmission.subject}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </label>
                <p className="mt-1 bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes administratives</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Ajouter des notes internes..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedSubmission.status)}
                  {selectedSubmission.replied_at && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Traité le {format(new Date(selectedSubmission.replied_at), "dd MMM yyyy", { locale: fr })}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  {selectedSubmission.status !== "replied" && (
                    <Button onClick={() => markAsReplied(selectedSubmission.id)}>
                      Marquer comme traité
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <a href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}>
                      Répondre par email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
