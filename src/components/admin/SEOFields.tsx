import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';

interface SEOFieldsProps {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImage: string;
  canonicalUrl: string;
  onChange: (field: string, value: string | string[]) => void;
}

const SUGGESTED_KEYWORDS = [
  'ताज़ा खबर', 'ब्रेकिंग न्यूज़', 'हिंदी समाचार', 'भारत', 'राजनीति',
  'खेल समाचार', 'क्रिकेट', 'बॉलीवुड', 'मनोरंजन', 'व्यापार', 'टेक्नोलॉजी'
];

export function SEOFields({
  seoTitle,
  metaDescription,
  keywords,
  ogImage,
  canonicalUrl,
  onChange,
}: SEOFieldsProps) {
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      onChange('keywords', [...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    onChange('keywords', keywords.filter(k => k !== keyword));
  };

  const addSuggestedKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      onChange('keywords', [...keywords, keyword]);
    }
  };

  const titleLength = seoTitle.length;
  const descLength = metaDescription.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO सेटिंग्स
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* SEO Title */}
        <div className="space-y-2">
          <Label htmlFor="seoTitle">SEO शीर्षक</Label>
          <Input
            id="seoTitle"
            value={seoTitle}
            onChange={(e) => onChange('seoTitle', e.target.value)}
            placeholder="Google सर्च में दिखने वाला शीर्षक"
            maxLength={70}
          />
          <div className="flex items-center justify-between text-sm">
            <span className={titleLength > 60 ? 'text-warning' : 'text-muted-foreground'}>
              {titleLength}/60 अक्षर
            </span>
            {titleLength > 0 && titleLength <= 60 && (
              <span className="text-primary flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> अच्छा
              </span>
            )}
            {titleLength > 60 && (
              <span className="text-warning flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> थोड़ा लंबा
              </span>
            )}
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            value={metaDescription}
            onChange={(e) => onChange('metaDescription', e.target.value)}
            placeholder="खबर का संक्षिप्त विवरण (Google सर्च रिजल्ट में दिखेगा)"
            rows={3}
            maxLength={170}
          />
          <div className="flex items-center justify-between text-sm">
            <span className={descLength > 160 ? 'text-warning' : 'text-muted-foreground'}>
              {descLength}/160 अक्षर
            </span>
            {descLength >= 120 && descLength <= 160 && (
              <span className="text-primary flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> परफेक्ट
              </span>
            )}
            {descLength > 0 && descLength < 120 && (
              <span className="text-warning flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> थोड़ा छोटा
              </span>
            )}
          </div>
        </div>

        {/* Keywords */}
        <div className="space-y-2">
          <Label>कीवर्ड्स (रैंकिंग के लिए)</Label>
          <div className="flex gap-2">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="नया कीवर्ड जोड़ें"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
            />
            <Button type="button" variant="outline" onClick={addKeyword}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Selected Keywords */}
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((keyword) => (
                <Badge key={keyword} variant="secondary" className="pr-1">
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Suggested Keywords */}
          <div className="mt-3">
            <p className="text-sm text-muted-foreground mb-2">सुझाए गए कीवर्ड्स:</p>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_KEYWORDS.filter(k => !keywords.includes(k)).slice(0, 6).map((keyword) => (
                <Badge
                  key={keyword}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => addSuggestedKeyword(keyword)}
                >
                  + {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <Label htmlFor="ogImage">सोशल मीडिया इमेज URL (OG Image)</Label>
          <Input
            id="ogImage"
            value={ogImage}
            onChange={(e) => onChange('ogImage', e.target.value)}
            placeholder="https://..."
          />
          <p className="text-sm text-muted-foreground">
            Facebook/Twitter पर शेयर करने पर यह इमेज दिखेगी
          </p>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">Canonical URL (वैकल्पिक)</Label>
          <Input
            id="canonicalUrl"
            value={canonicalUrl}
            onChange={(e) => onChange('canonicalUrl', e.target.value)}
            placeholder="https://example.com/original-article"
          />
          <p className="text-sm text-muted-foreground">
            अगर यह खबर कहीं और भी प्रकाशित है तो मूल URL डालें
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
