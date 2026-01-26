import { AdminLayout } from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useUsers, useUpdateUserRole, useDeleteUserRole, useAssignRole } from '@/hooks/useUsers';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Trash2, Shield, User, UserPlus, Users, Crown, Edit3, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { hi } from 'date-fns/locale';
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';

type AppRole = Database['public']['Enums']['app_role'];

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'एडमिन',
  editor: 'संपादक',
  user: 'यूजर',
};

const ROLE_ICONS: Record<AppRole, React.ReactNode> = {
  admin: <Crown className="w-3 h-3" />,
  editor: <Edit3 className="w-3 h-3" />,
  user: <User className="w-3 h-3" />,
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-destructive text-destructive-foreground',
  editor: 'bg-primary text-primary-foreground',
  user: 'bg-muted text-muted-foreground',
};

export default function UsersManagement() {
  const { data: users, isLoading, refetch } = useUsers();
  const { user: currentUser, isAdmin } = useAuth();
  const updateRole = useUpdateUserRole();
  const deleteRole = useDeleteUserRole();
  const assignRole = useAssignRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const handleRoleChange = async (userId: string, role: AppRole, existingRoleId: string | null) => {
    try {
      await updateRole.mutateAsync({ userId, role, existingRoleId });
      toast.success('भूमिका सफलतापूर्वक अपडेट हो गई');
    } catch (error: any) {
      toast.error(error.message || 'भूमिका अपडेट नहीं हो सकी');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await deleteRole.mutateAsync(roleId);
      toast.success('भूमिका सफलतापूर्वक हटा दी गई');
    } catch (error: any) {
      toast.error(error.message || 'भूमिका नहीं हटाई जा सकी');
    }
  };

  const handleAssignNewRole = async (userId: string, role: AppRole) => {
    try {
      await assignRole.mutateAsync({ userId, role });
      toast.success('नई भूमिका सफलतापूर्वक दी गई');
    } catch (error: any) {
      toast.error(error.message || 'भूमिका नहीं दी जा सकी');
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || 
                        (selectedRole === 'no_role' && !user.role) ||
                        user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    editors: users?.filter(u => u.role === 'editor').length || 0,
    regularUsers: users?.filter(u => u.role === 'user').length || 0,
    noRole: users?.filter(u => !u.role).length || 0,
  };

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <XCircle className="w-16 h-16 text-destructive" />
          <h2 className="text-xl font-semibold">पहुंच अस्वीकृत</h2>
          <p className="text-muted-foreground">आपके पास इस पेज तक पहुंच नहीं है। केवल एडमिन ही यूजर्स प्रबंधित कर सकते हैं।</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary" />
              यूजर प्रबंधन
            </h1>
            <p className="text-muted-foreground mt-1">सभी यूजर्स और उनकी भूमिकाएं प्रबंधित करें</p>
          </div>
          <Button onClick={() => refetch()} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            रिफ्रेश
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">कुल यूजर्स</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <Crown className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-xs text-muted-foreground">एडमिन</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Edit3 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.editors}</p>
                <p className="text-xs text-muted-foreground">संपादक</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.regularUsers}</p>
                <p className="text-xs text-muted-foreground">यूजर</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-full bg-secondary">
                <UserPlus className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.noRole}</p>
                <p className="text-xs text-muted-foreground">बिना भूमिका</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="यूजर खोजें (ईमेल या ID)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="भूमिका फ़िल्टर" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">सभी भूमिकाएं</SelectItem>
                  <SelectItem value="admin">एडमिन</SelectItem>
                  <SelectItem value="editor">संपादक</SelectItem>
                  <SelectItem value="user">यूजर</SelectItem>
                  <SelectItem value="no_role">बिना भूमिका</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              यूजर्स सूची ({filteredUsers?.length || 0})
            </CardTitle>
            <CardDescription>
              यूजर्स की भूमिकाएं बदलने के लिए ड्रॉपडाउन का उपयोग करें
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredUsers && filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>यूजर</TableHead>
                      <TableHead>वर्तमान भूमिका</TableHead>
                      <TableHead>जुड़ने की तारीख</TableHead>
                      <TableHead>स्थिति</TableHead>
                      <TableHead className="text-right">कार्रवाई</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className={user.id === currentUser?.id ? 'bg-primary/5' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              {user.role === 'admin' ? (
                                <Crown className="w-5 h-5 text-primary" />
                              ) : user.role === 'editor' ? (
                                <Edit3 className="w-5 h-5 text-primary" />
                              ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium truncate max-w-[200px]">
                                {user.email}
                              </p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="text-xs bg-primary/10">आप</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.role ? (
                            <Badge className={`${ROLE_COLORS[user.role]} gap-1`}>
                              {ROLE_ICONS[user.role]}
                              {ROLE_LABELS[user.role]}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground">
                              कोई भूमिका नहीं
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {format(new Date(user.created_at), 'dd MMM yyyy', { locale: hi })}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary">सक्रिय</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {user.id !== currentUser?.id && (
                              <>
                                <Select
                                  value={user.role || 'no_role'}
                                  onValueChange={(value) => {
                                    if (value === 'no_role') return;
                                    if (user.role_id) {
                                      handleRoleChange(user.id, value as AppRole, user.role_id);
                                    } else {
                                      handleAssignNewRole(user.id, value as AppRole);
                                    }
                                  }}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="भूमिका चुनें" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">
                                      <div className="flex items-center gap-2">
                                        <Crown className="w-3 h-3" />
                                        एडमिन
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="editor">
                                      <div className="flex items-center gap-2">
                                        <Edit3 className="w-3 h-3" />
                                        संपादक
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="user">
                                      <div className="flex items-center gap-2">
                                        <User className="w-3 h-3" />
                                        यूजर
                                      </div>
                                    </SelectItem>
                                    {!user.role && (
                                      <SelectItem value="no_role" disabled>
                                        भूमिका चुनें
                                      </SelectItem>
                                    )}
                                  </SelectContent>
                                </Select>

                                {user.role_id && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle className="flex items-center gap-2">
                                          <Trash2 className="w-5 h-5 text-destructive" />
                                          भूमिका हटाएं?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                          क्या आप <strong>{user.email}</strong> की भूमिका हटाना चाहते हैं? 
                                          यूजर की सभी विशेष अनुमतियां समाप्त हो जाएंगी और वे एडमिन पैनल एक्सेस नहीं कर पाएंगे।
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>रद्द करें</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteRole(user.role_id!)}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        >
                                          हां, हटाएं
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </>
                            )}
                            {user.id === currentUser?.id && (
                              <span className="text-xs text-muted-foreground italic">
                                खुद को बदल नहीं सकते
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">कोई यूजर नहीं मिला</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || selectedRole !== 'all' 
                    ? 'फ़िल्टर बदलकर देखें' 
                    : 'अभी कोई रजिस्टर्ड यूजर नहीं है'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">भूमिकाओं के बारे में</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <Crown className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium">एडमिन</h4>
                  <p className="text-sm text-muted-foreground">पूर्ण एक्सेस - सभी सेटिंग्स, यूजर्स और कंटेंट प्रबंधित कर सकते हैं</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <Edit3 className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">संपादक</h4>
                  <p className="text-sm text-muted-foreground">आर्टिकल और श्रेणियां बना और संपादित कर सकते हैं</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-background">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-medium">यूजर</h4>
                  <p className="text-sm text-muted-foreground">बेसिक एक्सेस - केवल पढ़ सकते हैं</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
