import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ARTICLE_STATUS, type ArticleStatus } from '@/lib/constants';
import { useCreateArticle, useUpdateArticle, type NewsArticle } from '@/hooks/useNews';
import { useActiveCategories } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2, ChevronDown, Save, Send, CheckCircle } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { SEOFields } from './SEOFields';

interface ArticleFormProps {
  article?: NewsArticle & {
    seo_title?: string | null;
    meta_description?: string | null;
    keywords?: string[] | null;
    og_image?: string | null;
    canonical_url?: string | null;
  };
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
  const { user, isAdmin } = useAuth();
  const { data: categories } = useActiveCategories();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const [seoOpen, setSeoOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: article?.title || '',
    excerpt: article?.excerpt || '',
    content: article?.content || '',
    category: article?.category || 'national',
    image_url: article?.image_url || '',
    is_breaking: article?.is_breaking || false,
    is_featured: article?.is_featured || false,
    status: article?.status || 'draft' as ArticleStatus,
    seo_title: article?.seo_title || '',
    meta_description: article?.meta_description || '',
    keywords: article?.keywords || [] as string[],
    og_image: article?.og_image || '',
    canonical_url: article?.canonical_url || '',
  });

  const isLoading = createArticle.isPending || updateArticle.isPending;

  const handleSubmit = async (e: React.FormEvent, targetStatus?: ArticleStatus) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('शीर्षक और सामग्री आवश्यक है');
      return;
    }

    const statusToSave = targetStatus || formData.status;

    try {
      if (article) {
        await updateArticle.mutateAsync({
          id: article.id,
          ...formData,
          status: statusToSave,
        });
        const statusLabel = ARTICLE_STATUS[statusToSave].label;
        toast.success(`खबर ${statusLabel} के रूप में सहेजी गई`);
      } else {
        await createArticle.mutateAsync({
          ...formData,
          status: statusToSave,
          slug: generateSlug(formData.title),
          author_id: user?.id || null,
          published_at: statusToSave === 'published' ? new Date().toISOString() : null,
          view_count: 0,
        });
        const statusLabel = ARTICLE_STATUS[statusToSave].label;
        toast.success(`खबर ${statusLabel} के रूप में सहेजी गई`);
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
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.label}
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

      {/* SEO Section */}
      <Collapsible open={seoOpen} onOpenChange={setSeoOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" type="button" className="w-full justify-between">
            SEO सेटिंग्स (Google रैंकिंग के लिए)
            <ChevronDown className={`w-4 h-4 transition-transform ${seoOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <SEOFields
            seoTitle={formData.seo_title}
            metaDescription={formData.meta_description}
            keywords={formData.keywords}
            ogImage={formData.og_image}
            canonicalUrl={formData.canonical_url}
            onChange={(field, value) => {
              const fieldMap: Record<string, string> = {
                seoTitle: 'seo_title',
                metaDescription: 'meta_description',
                ogImage: 'og_image',
                canonicalUrl: 'canonical_url',
              };
              const key = fieldMap[field] || field;
              setFormData({ ...formData, [key]: value });
            }}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Save as Draft - available to everyone */}
        <Button 
          type="button" 
          variant="outline" 
          disabled={isLoading}
          onClick={(e) => handleSubmit(e, 'draft')}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          ड्राफ्ट सहेजें
        </Button>

        {/* Submit for Review - for editors (non-admins) */}
        {!isAdmin && (
          <Button 
            type="button" 
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, 'pending_review')}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <Send className="w-4 h-4 mr-2" />
            समीक्षा के लिए भेजें
          </Button>
        )}

        {/* Publish - only for admins */}
        {isAdmin && (
          <Button 
            type="button" 
            disabled={isLoading}
            onClick={(e) => handleSubmit(e, 'published')}
            className="bg-success hover:bg-success/90"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            <CheckCircle className="w-4 h-4 mr-2" />
            प्रकाशित करें
          </Button>
        )}

        <Button type="button" variant="ghost" onClick={() => navigate('/admin/articles')}>
          रद्द करें
        </Button>
      </div>
    </form>
  );
}
