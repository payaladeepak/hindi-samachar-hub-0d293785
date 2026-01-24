import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useUsers, useUpdateUserRole, useDeleteUserRole } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Trash2, Shield, User, Edit3 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'एडमिन',
  editor: 'संपादक',
  user: 'यूजर',
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-destructive text-destructive-foreground',
  editor: 'bg-primary text-primary-foreground',
  user: 'bg-muted text-muted-foreground',
};

export default function UsersManagement() {
  const { data: users, isLoading } = useUsers();
  const { user: currentUser, isAdmin } = useAuth();
  const updateRole = useUpdateUserRole();
  const deleteRole = useDeleteUserRole();

  const handleRoleChange = async (userId: string, role: AppRole, existingRoleId: string | null) => {
    try {
      await updateRole.mutateAsync({ userId, role, existingRoleId });
      toast.success('भूमिका अपडेट हो गई');
    } catch (error: any) {
      toast.error(error.message || 'भूमिका अपडेट नहीं हो सकी');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole.mutateAsync(roleId);
      toast.success('भूमिका हटा दी गई');
    } catch (error: any) {
      toast.error(error.message || 'भूमिका नहीं हटाई जा सकी');
    }
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">आपके पास इस पेज तक पहुंच नहीं है</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">यूजर प्रबंधन</h1>
          <p className="text-muted-foreground">सभी यूजर्स और उनकी भूमिकाएं प्रबंधित करें</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              यूजर्स सूची
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : users && users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>यूजर</TableHead>
                    <TableHead>भूमिका</TableHead>
                    <TableHead>जुड़ने की तारीख</TableHead>
                    <TableHead className="text-right">कार्रवाई</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium truncate max-w-[200px]">
                            {user.email || user.id.slice(0, 8)}
                          </span>
                          {user.id === currentUser?.id && (
                            <Badge variant="outline" className="text-xs">आप</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge className={ROLE_COLORS[user.role]}>
                            {ROLE_LABELS[user.role]}
                          </Badge>
                        ) : (
                          <Badge variant="outline">कोई भूमिका नहीं</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), 'dd MMM yyyy', { locale: hi })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.id !== currentUser?.id && (
                            <>
                              <Select
                                value={user.role || ''}
                                onValueChange={(value: AppRole) => handleRoleChange(user.id, value, user.role_id)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="भूमिका चुनें" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">एडमिन</SelectItem>
                                  <SelectItem value="editor">संपादक</SelectItem>
                                  <SelectItem value="user">यूजर</SelectItem>
                                </SelectContent>
                              </Select>

                              {user.role_id && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>भूमिका हटाएं?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        क्या आप इस यूजर की भूमिका हटाना चाहते हैं? यूजर की सभी विशेष अनुमतियां समाप्त हो जाएंगी।
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteRole(user.role_id!)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        हटाएं
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                कोई यूजर नहीं मिला
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
