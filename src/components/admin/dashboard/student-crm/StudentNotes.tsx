import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, StickyNote } from 'lucide-react';
import { useStudentCRM } from '@/hooks/useStudentCRM';

interface StudentNotesProps {
  userId: string;
}

const StudentNotes: React.FC<StudentNotesProps> = ({ userId }) => {
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const { getStudentNotes, addStudentNote, loading } = useStudentCRM();

  useEffect(() => {
    fetchNotes();
  }, [userId]);

  const fetchNotes = async () => {
    const data = await getStudentNotes(userId);
    setNotes(data);
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const success = await addStudentNote(userId, newNote, noteType);
    if (success) {
      setNewNote('');
      setNoteType('general');
      fetchNotes();
    }
  };

  const getNoteTypeBadge = (type: string) => {
    const colors: Record<string, any> = {
      general: 'default',
      academic: 'secondary',
      financial: 'outline',
      behavioral: 'destructive',
      administrative: 'default'
    };
    return <Badge variant={colors[type] || 'default'}>{type}</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Add Note Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Ajouter une Note
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Type de Note</Label>
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Général</SelectItem>
                <SelectItem value="academic">Académique</SelectItem>
                <SelectItem value="financial">Financier</SelectItem>
                <SelectItem value="behavioral">Comportemental</SelectItem>
                <SelectItem value="administrative">Administratif</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Note</Label>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Écrivez votre note ici..."
              rows={4}
            />
          </div>
          <Button onClick={handleAddNote} disabled={loading || !newNote.trim()}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter Note
          </Button>
        </CardContent>
      </Card>

      {/* Notes List */}
      <Card>
        <CardHeader>
          <CardTitle>Notes de l'Étudiant</CardTitle>
          <CardDescription>{notes.length} note(s) au total</CardDescription>
        </CardHeader>
        <CardContent>
          {notes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune note</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    {getNoteTypeBadge(note.note_type)}
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.created_at).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{note.note_text}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentNotes;
