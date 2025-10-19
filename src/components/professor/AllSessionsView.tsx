import { useState, useEffect } from 'react';
import { useClassSessions } from '@/hooks/useClassSessions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Search, Edit2, Trash2, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AllSessionsViewProps {
  courseId: string;
}

const SESSION_TYPES = ['lecture', 'tutorial', 'lab', 'exam', 'workshop'];
const SESSION_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'];

const AllSessionsView = ({ courseId }: AllSessionsViewProps) => {
  const { sessions, loading, fetchSessions, updateSession, deleteSession } = useClassSessions(courseId);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingSession, setEditingSession] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    room_location: '',
    start_time: '',
    end_time: '',
    notes: '',
    status: '',
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch = 
      searchTerm === '' ||
      session.room_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || session.session_type === filterType;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: sessions.length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-primary/10 text-primary';
      case 'in_progress': return 'bg-accent text-accent-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Programmée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'lecture': return 'Cours';
      case 'tutorial': return 'TD';
      case 'lab': return 'TP';
      case 'exam': return 'Examen';
      case 'workshop': return 'Atelier';
      default: return type;
    }
  };

  const handleEdit = (session: any) => {
    setEditingSession(session);
    setEditForm({
      room_location: session.room_location || '',
      start_time: session.start_time,
      end_time: session.end_time,
      notes: session.notes || '',
      status: session.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingSession) return;
    
    const success = await updateSession(editingSession.id, editForm);
    if (success) {
      setEditingSession(null);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Programmées</p>
              <p className="text-2xl font-bold">{stats.scheduled}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Terminées</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Annulées</p>
              <p className="text-2xl font-bold">{stats.cancelled}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par salle ou notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Type de séance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {SESSION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {getTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {SESSION_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Sessions Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Horaire</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune séance trouvée
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(session.session_date), 'EEE dd MMM yyyy', { locale: fr })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {session.start_time} - {session.end_time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getTypeLabel(session.session_type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {session.room_location || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(session.status)}>
                        {getStatusLabel(session.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {session.notes || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(session)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(session.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingSession} onOpenChange={() => setEditingSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la séance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Salle</label>
              <Input
                value={editForm.room_location}
                onChange={(e) => setEditForm({ ...editForm, room_location: e.target.value })}
                placeholder="Ex: Salle A101"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Heure de début</label>
                <Input
                  type="time"
                  value={editForm.start_time}
                  onChange={(e) => setEditForm({ ...editForm, start_time: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Heure de fin</label>
                <Input
                  type="time"
                  value={editForm.end_time}
                  onChange={(e) => setEditForm({ ...editForm, end_time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Notes additionnelles..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingSession(null)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllSessionsView;
