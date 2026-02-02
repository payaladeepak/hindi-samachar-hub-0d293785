import { useState } from 'react';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Plus, Pencil, Trash2, Loader2, GripVertical, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  type Category,
} from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';

const COLOR_OPTIONS = [
  { value: 'bg-blue-600', label: 'नीला' },
  { value: 'bg-green-600', label: 'हरा' },
  { value: 'bg-red-600', label: 'लाल' },
  { value: 'bg-orange-500', label: 'नारंगी' },
  { value: 'bg-pink-500', label: 'गुलाबी' },
  { value: 'bg-purple-600', label: 'बैंगनी' },
  { value: 'bg-emerald-600', label: 'पन्ना' },
  { value: 'bg-teal-500', label: 'टील' },
  { value: 'bg-yellow-500', label: 'पीला' },
  { value: 'bg-indigo-600', label: 'इंडिगो' },
];

interface CategoryFormData {
  name: string;
  label: string;
  color: string;
  sort_order: number;
  is_active: boolean;
}

const initialFormData: CategoryFormData = {
  name: '',
  label: '',
  color: 'bg-blue-600',
  sort_order: 0,
  is_active: true,
};

export default function CategoriesList() {
  const { isAdmin } = useAuth();
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);

  // Only admins can access this page
  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <XCircle className="w-16 h-16 text-destructive" />
          <h2 className="text-xl font-semibold">पहुंच अस्वीकृत</h2>
          <p className="text-muted-foreground text-center">
            आपके पास श्रेणियां प्रबंधित करने की अनुमति नहीं है।<br />
            केवल एडमिन ही श्रेणियां बना, संपादित और हटा सकते हैं।
          </p>
        </div>
      </AdminLayout>
    );
  }

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      ...initialFormData,
      sort_order: (categories?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      label: category.label,
      color: category.color,
      sort_order: category.sort_order,
      is_active: category.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.label.trim()) {
      toast.error('नाम और लेबल आवश्यक हैं');
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          ...formData,
        });
        toast.success('श्रेणी अपडेट हो गई');
      } else {
        await createCategory.mutateAsync(formData);
        toast.success('नई श्रेणी बनाई गई');
      }
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'कुछ गलत हो गया');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      toast.success('श्रेणी हटा दी गई');
    } catch (error: any) {
      toast.error(error.message || 'श्रेणी हटाने में समस्या हुई');
    }
  };

  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">श्रेणियां</h1>
            <p className="text-muted-foreground">खबरों की श्रेणियां प्रबंधित करें</p>
          </div>
          <Button onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-2" />
            नई श्रेणी
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>सभी श्रेणियां</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : categories && categories.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>नाम (ID)</TableHead>
                    <TableHead>लेबल</TableHead>
                    <TableHead>रंग</TableHead>
                    <TableHead>स्थिति</TableHead>
                    <TableHead className="text-right">क्रियाएं</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="text-muted-foreground">
                        <GripVertical className="w-4 h-4" />
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {category.name}
                      </TableCell>
                      <TableCell className="font-medium">{category.label}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block w-6 h-6 rounded ${category.color}`}
                          title={category.color}
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            category.is_active
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                          }`}
                        >
                          {category.is_active ? 'सक्रिय' : 'निष्क्रिय'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(category)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>क्या आप निश्चित हैं?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  यह श्रेणी "{category.label}" को स्थायी रूप से हटा देगा।
                                  इस श्रेणी की खबरें प्रभावित हो सकती हैं।
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(category.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  हटाएं
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                कोई श्रेणी नहीं मिली
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'श्रेणी संपादित करें' : 'नई श्रेणी बनाएं'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">नाम (ID) *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                  })
                }
                placeholder="national, sports, etc."
                disabled={!!editingCategory}
              />
              <p className="text-xs text-muted-foreground">
                यह URL में उपयोग होगा (केवल अंग्रेजी, lowercase)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="label">लेबल (हिंदी) *</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="राष्ट्रीय, खेल, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>रंग</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                      formData.color === color.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    }`}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">क्रम</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
                min={0}
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <Label htmlFor="is_active">सक्रिय</Label>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                रद्द करें
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingCategory ? 'अपडेट करें' : 'बनाएं'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
