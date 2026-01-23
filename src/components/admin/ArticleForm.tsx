import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NEWS_CATEGORIES, type NewsCategory } from '@/lib/constants';
import { useCreateArticle, useUpdateArticle, type NewsArticle } from '@/hooks/useNews';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from './ImageUpload';

interface ArticleFormProps {
  article?: NewsArticle;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 100) + '-' + Date.now();
}

export function ArticleForm({ article }: ArticleFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'national' as NewsCategory,
    image_url: article?.image_url || '',
    is_breaking: article?.is_breaking || false,
    is_featured: article?.is_featured || false,
  });

  const isLoading = createArticle.isPending || updateArticle.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('शीर्षक और सामग्री आवश्यक है');
      return;
    }

    try {
      if (article) {
        await updateArticle.mutateAsync({
          id: article.id,
          ...formData,
        });
        toast.success('खबर अपडेट हो गई');
      } else {
        await createArticle.mutateAsync({
          ...formData,
          slug: generateSlug(formData.title),
          author_id: user?.id || null,
          published_at: new Date().toISOString(),
        });
        toast.success('खबर प्रकाशित हो गई');
      }
      navigate('/admin/articles');
    } catch (error: any) {
      toast.error(error.message || 'कुछ गलत हो गया');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{article ? 'खबर संपादित करें' : 'नई खबर लिखें'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">शीर्षक *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="खबर का शीर्षक लिखें"
              required
            />
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">संक्षिप्त विवरण</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="खबर का संक्षिप्त विवरण"
              rows={2}
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">पूरी खबर *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="खबर की पूरी सामग्री लिखें"
              rows={10}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>श्रेणी</Label>
            <Select
              value={formData.category}
              onValueChange={(value: NewsCategory) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(NEWS_CATEGORIES).map(([key, { label }]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload */}
          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label="खबर की छवि"
          />

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex items-center gap-2">
              <Switch
                id="is_breaking"
                checked={formData.is_breaking}
                onCheckedChange={(checked) => setFormData({ ...formData, is_breaking: checked })}
              />
              <Label htmlFor="is_breaking">ब्रेकिंग न्यूज़</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">फीचर्ड खबर</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="min-w-32">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {article ? 'अपडेट करें' : 'प्रकाशित करें'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/articles')}>
          रद्द करें
        </Button>
      </div>
    </form>
  );
}
