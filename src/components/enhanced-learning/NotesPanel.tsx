import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, Clock, StickyNote } from 'lucide-react';
import { useEnhancedLearning, LessonNote } from '@/hooks/useEnhancedLearning';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale/fr';

interface NotesPanelProps {
  lessonId: string;
  currentTimestamp?: number;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ lessonId, currentTimestamp }) => {
  const { 
    fetchLessonNotes, 
    createNote, 
    updateNote, 
    deleteNote 
  } = useEnhancedLearning();

  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<LessonNote | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTimestamp, setNewNoteTimestamp] = useState('');

  useEffect(() => {
    loadNotes();
  }, [lessonId]);

  useEffect(() => {
    if (currentTimestamp !== undefined) {
      setNewNoteTimestamp(formatTimestamp(currentTimestamp));
    }
  }, [currentTimestamp]);

  const loadNotes = async () => {
    const notesData = await fetchLessonNotes(lessonId);
    setNotes(notesData);
  };

  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) return;

    let timestamp: number | undefined;
    if (newNoteTimestamp) {
      timestamp = parseTimestamp(newNoteTimestamp);
    }

    await createNote(lessonId, newNoteContent.trim(), timestamp);
    setNewNoteContent('');
    setNewNoteTimestamp('');
    setIsCreateDialogOpen(false);
    loadNotes();
  };

  const handleUpdateNote = async () => {
    if (!editingNote || !newNoteContent.trim()) return;

    await updateNote(editingNote.id, newNoteContent.trim());
    setEditingNote(null);
    setNewNoteContent('');
    loadNotes();
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    loadNotes();
  };

  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const parseTimestamp = (timeStr: string): number => {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;
      return minutes * 60 + seconds;
    }
    return 0;
  };

  const resetForm = () => {
    setNewNoteContent('');
    setNewNoteTimestamp('');
    setEditingNote(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5" />
            Mes notes ({notes.length})
          </CardTitle>
          <Dialog 
            open={isCreateDialogOpen || !!editingNote} 
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                onClick={() => setIsCreateDialogOpen(true)}
                className="gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Nouvelle note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingNote ? 'Modifier la note' : 'Nouvelle note'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="note-content">Contenu de la note</Label>
                  <Textarea
                    id="note-content"
                    placeholder="Écrivez votre note ici..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="note-timestamp">Timestamp (optionnel)</Label>
                  <Input
                    id="note-timestamp"
                    placeholder="ex: 5:30"
                    value={newNoteTimestamp}
                    onChange={(e) => setNewNoteTimestamp(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: minutes:secondes (ex: 5:30 pour 5 minutes et 30 secondes)
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={editingNote ? handleUpdateNote : handleCreateNote}
                    disabled={!newNoteContent.trim()}
                  >
                    {editingNote ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8">
              <StickyNote className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Aucune note pour cette leçon.</p>
              <p className="text-sm text-muted-foreground">
                Créez votre première note pour vous aider à retenir les points importants.
              </p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {note.note_timestamp !== null && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTimestamp(note.note_timestamp)}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(note.created_at), {
                            addSuffix: true,
                            locale: fr
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingNote(note);
                          setNewNoteContent(note.content);
                          if (note.note_timestamp !== null) {
                            setNewNoteTimestamp(formatTimestamp(note.note_timestamp));
                          }
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesPanel;