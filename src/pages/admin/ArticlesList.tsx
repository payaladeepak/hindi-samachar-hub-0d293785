import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAdminArticles, useDeleteArticle } from '@/hooks/useNews';
import { useAuth } from '@/hooks/useAuth';
import { NEWS_CATEGORIES } from '@/lib/constants';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Loader2, ExternalLink, Shield, User } from 'lucide-react';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ArticlesList() {
  const { user, isAdmin, isEditor } = useAuth();
  const { data: articles, isLoading } = useAdminArticles(user?.id, isAdmin);
  const deleteArticle = useDeleteArticle();

  const handleDelete = async (id: string) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success('खबर हटा दी गई');
    } catch (error: any) {
      toast.error(error.message || 'खबर हटाने में त्रुटि');
    }
  };

  // Check if user can edit/delete this article
  const canModifyArticle = (authorId: string | null) => {
    return isAdmin || (isEditor && authorId === user?.id);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">
                {isAdmin ? 'सभी खबरें' : 'मेरी खबरें'}
              </h1>
              <Badge variant={isAdmin ? 'default' : 'secondary'} className="flex items-center gap-1">
                {isAdmin ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                {isAdmin ? 'Admin' : 'Editor'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {isAdmin 
                ? 'आप सभी खबरों को देख और संपादित कर सकते हैं' 
                : 'आप केवल अपनी खबरों को देख और संपादित कर सकते हैं'}
            </p>
          </div>
          <Link to="/admin/articles/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              नई खबर
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>खबरों की सूची</CardTitle>
            <CardDescription>
              कुल {articles?.length || 0} खबरें
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : articles && articles.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>शीर्षक</TableHead>
                    <TableHead>श्रेणी</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead>तारीख</TableHead>
                    <TableHead className="text-right">कार्रवाई</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium max-w-[300px]">
                        <p className="line-clamp-2">{article.title}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {NEWS_CATEGORIES[article.category].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {article.is_breaking && (
                            <Badge className="bg-breaking text-breaking-foreground">
                              ब्रेकिंग
                            </Badge>
                          )}
                          {article.is_featured && (
                            <Badge variant="outline">फीचर्ड</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(article.published_at), 'dd MMM yyyy', { locale: hi })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/news/${article.slug}`} target="_blank">
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </Link>
                          {canModifyArticle(article.author_id) && (
                            <>
                              <Link to={`/admin/articles/${article.id}/edit`}>
                                <Button variant="ghost" size="icon">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </Link>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>क्या आप सुनिश्चित हैं?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      यह क्रिया पूर्ववत नहीं की जा सकती। यह खबर स्थायी रूप से हटा दी जाएगी।
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(article.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      हटाएं
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">अभी कोई खबर नहीं है</p>
                <Link to="/admin/articles/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    पहली खबर लिखें
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
