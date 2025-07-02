import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useBlogManagement, BlogPost } from '@/hooks/useBlogManagement';
import { Edit, Eye, MessageSquare, Plus, Trash2 } from 'lucide-react';

const BlogManagement = () => {
  const {
    posts,
    categories,
    loading,
    fetchPosts,
    fetchPublishedPosts,
    createPost,
    updatePost,
    deletePost,
    publishPost,
  } = useBlogManagement();

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    category_id: '',
    featured_image_url: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!formData.title || !formData.content) return;

    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    await createPost({
      ...formData,
      slug,
    });

    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      category_id: '',
      featured_image_url: '',
      status: 'draft',
    });
    setIsEditDialogOpen(false);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost || !formData.title || !formData.content) return;

    await updatePost(selectedPost.id, formData);
    setIsEditDialogOpen(false);
    setSelectedPost(null);
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      category_id: post.category_id,
      featured_image_url: post.featured_image_url || '',
      status: post.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      await deletePost(postId);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      slug: '',
      category_id: '',
      featured_image_url: '',
      status: 'draft',
    });
    setSelectedPost(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion du Blog</h2>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedPost ? 'Modifier l\'article' : 'Créer un nouvel article'}
              </DialogTitle>
              <DialogDescription>
                {selectedPost ? 'Modifiez les informations de l\'article' : 'Créez un nouvel article pour votre blog'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Titre</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de l'article"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="url-de-l-article"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Extrait</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Résumé de l'article"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contenu</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Contenu de l'article"
                  rows={10}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={formData.status} onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Image de couverture (URL)</label>
                <Input
                  value={formData.featured_image_url}
                  onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={selectedPost ? handleUpdatePost : handleCreatePost}>
                  {selectedPost ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" onClick={() => fetchPosts()}>Tous</TabsTrigger>
          <TabsTrigger value="published" onClick={() => fetchPosts('published')}>Publiés</TabsTrigger>
          <TabsTrigger value="draft" onClick={() => fetchPosts('draft')}>Brouillons</TabsTrigger>
          <TabsTrigger value="archived" onClick={() => fetchPosts('archived')}>Archivés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              <div className="text-center py-8">Chargement...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">Aucun article trouvé</div>
            ) : (
              posts.map((post) => (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription>
                          Par {post.profiles?.full_name} • {post.blog_categories?.name} • 
                          {new Date(post.created_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(post.status)}>
                          {post.status === 'published' ? 'Publié' : 
                           post.status === 'draft' ? 'Brouillon' : 'Archivé'}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Eye className="mr-1 h-4 w-4" />
                          {post.view_count}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Slug: /{post.slug}
                      </div>
                      <div className="flex space-x-2">
                        {post.status === 'draft' && (
                          <Button size="sm" onClick={() => publishPost(post.id)}>
                            Publier
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleEditPost(post)}>
                          <Edit className="mr-1 h-4 w-4" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeletePost(post.id)}>
                          <Trash2 className="mr-1 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="published">
          <div className="text-center py-8">Contenu filtré par statut publié</div>
        </TabsContent>

        <TabsContent value="draft">
          <div className="text-center py-8">Contenu filtré par statut brouillon</div>
        </TabsContent>

        <TabsContent value="archived">
          <div className="text-center py-8">Contenu filtré par statut archivé</div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogManagement;