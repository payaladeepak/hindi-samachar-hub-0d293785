import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, FileText, Link2, CheckCircle, AlertCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export default function SEOSettings() {
  const { isAdmin } = useAuth();
  
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ताज़ा खबर',
    siteDescription: 'भारत की सबसे विश्वसनीय हिंदी समाचार वेबसाइट',
    defaultKeywords: 'हिंदी समाचार, ताज़ा खबर, भारत समाचार, राजनीति, खेल, मनोरंजन',
    googleVerification: '',
    bingVerification: '',
    googleAnalyticsId: '',
  });

  const handleSave = () => {
    // In a real app, this would save to database
    toast.success('SEO सेटिंग्स सहेजी गईं');
  };

  // Only admins can access global SEO settings
  if (!isAdmin) {
    return (
      <AdminLayout>
        <Card className="max-w-lg mx-auto mt-12">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <ShieldAlert className="w-16 h-16 mx-auto text-destructive" />
              <h2 className="text-2xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground">
                केवल Admin ही वैश्विक SEO सेटिंग्स प्रबंधित कर सकते हैं।
              </p>
              <p className="text-sm text-muted-foreground">
                आप अपनी खबरों का SEO "खबर संपादित करें" पेज से प्रबंधित कर सकते हैं।
              </p>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">SEO सेटिंग्स</h1>
          <p className="text-muted-foreground">Google और अन्य सर्च इंजन के लिए वेबसाइट ऑप्टिमाइज़ करें</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="general">सामान्य</TabsTrigger>
            <TabsTrigger value="verification">वेरिफिकेशन</TabsTrigger>
            <TabsTrigger value="sitemap">साइटमैप</TabsTrigger>
            <TabsTrigger value="tips">SEO टिप्स</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  वेबसाइट मेटाडाटा
                </CardTitle>
                <CardDescription>
                  ये सेटिंग्स Google सर्च रिजल्ट्स में दिखाई देंगी
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">साइट का नाम</Label>
                  <Input
                    id="siteName"
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    placeholder="वेबसाइट का नाम"
                  />
                  <p className="text-sm text-muted-foreground">60 अक्षरों से कम रखें</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">साइट विवरण (Meta Description)</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteSettings.siteDescription}
                    onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                    placeholder="वेबसाइट का संक्षिप्त विवरण"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    {siteSettings.siteDescription.length}/160 अक्षर
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultKeywords">डिफ़ॉल्ट कीवर्ड्स</Label>
                  <Textarea
                    id="defaultKeywords"
                    value={siteSettings.defaultKeywords}
                    onChange={(e) => setSiteSettings({ ...siteSettings, defaultKeywords: e.target.value })}
                    placeholder="कॉमा से अलग कीवर्ड्स"
                    rows={2}
                  />
                  <p className="text-sm text-muted-foreground">
                    5-10 मुख्य कीवर्ड्स जोड़ें, कॉमा से अलग करें
                  </p>
                </div>

                <Button onClick={handleSave}>सहेजें</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  सर्च इंजन वेरिफिकेशन
                </CardTitle>
                <CardDescription>
                  Google Search Console और Bing Webmaster Tools से वेरिफिकेशन कोड
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="googleVerification">Google Site Verification</Label>
                  <Input
                    id="googleVerification"
                    value={siteSettings.googleVerification}
                    onChange={(e) => setSiteSettings({ ...siteSettings, googleVerification: e.target.value })}
                    placeholder="google-site-verification=xxxxx"
                  />
                  <a 
                    href="https://search.google.com/search-console" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Google Search Console खोलें <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bingVerification">Bing Verification</Label>
                  <Input
                    id="bingVerification"
                    value={siteSettings.bingVerification}
                    onChange={(e) => setSiteSettings({ ...siteSettings, bingVerification: e.target.value })}
                    placeholder="msvalidate.01=xxxxx"
                  />
                  <a 
                    href="https://www.bing.com/webmasters" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Bing Webmaster Tools खोलें <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={siteSettings.googleAnalyticsId}
                    onChange={(e) => setSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>

                <Button onClick={handleSave}>सहेजें</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  साइटमैप और Robots.txt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Sitemap.xml</h3>
                      <Badge variant="outline" className="text-green-600">सक्रिय</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      स्वचालित रूप से सभी खबरों का साइटमैप बनता है
                    </p>
                    <a 
                      href="/sitemap.xml" 
                      target="_blank" 
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      साइटमैप देखें <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Robots.txt</h3>
                      <Badge variant="outline" className="text-green-600">सक्रिय</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      सर्च इंजन क्रॉलर्स के लिए निर्देश
                    </p>
                    <a 
                      href="/robots.txt" 
                      target="_blank" 
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Robots.txt देखें <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Google Search Console में साइटमैप सबमिट करें:</h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Google Search Console में लॉगिन करें</li>
                    <li>अपनी प्रॉपर्टी चुनें</li>
                    <li>Sitemaps सेक्शन में जाएं</li>
                    <li>साइटमैप URL डालें: /sitemap.xml</li>
                    <li>Submit पर क्लिक करें</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  SEO टिप्स - बेहतर रैंकिंग के लिए
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h4 className="font-medium">1. खबर का शीर्षक</h4>
                    <p className="text-sm text-muted-foreground">
                      60 अक्षरों से कम रखें, मुख्य कीवर्ड शुरू में रखें
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h4 className="font-medium">2. Meta Description</h4>
                    <p className="text-sm text-muted-foreground">
                      150-160 अक्षरों में खबर का सार लिखें, कीवर्ड शामिल करें
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h4 className="font-medium">3. कीवर्ड्स</h4>
                    <p className="text-sm text-muted-foreground">
                      5-8 संबंधित कीवर्ड्स चुनें, लंबी-पूंछ कीवर्ड्स उपयोग करें
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h4 className="font-medium">4. इमेज ऑप्टिमाइजेशन</h4>
                    <p className="text-sm text-muted-foreground">
                      इमेज में alt text जोड़ें, फाइल साइज 200KB से कम रखें
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg">
                    <h4 className="font-medium">5. Internal Linking</h4>
                    <p className="text-sm text-muted-foreground">
                      संबंधित खबरों के लिंक जोड़ें, anchor text में कीवर्ड्स रखें
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded-r-lg">
                    <h4 className="font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      आपकी साइट पहले से ऑप्टिमाइज़ है:
                    </h4>
                    <ul className="text-sm text-muted-foreground list-disc list-inside mt-2 space-y-1">
                      <li>Mobile-friendly डिज़ाइन</li>
                      <li>Fast page loading</li>
                      <li>Semantic HTML structure</li>
                      <li>Clean URL structure</li>
                      <li>Automatic sitemap generation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
