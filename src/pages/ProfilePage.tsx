import { useState, useRef } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { useProfile, useUpdateProfile, useUploadAvatar } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Camera, User, Mail, Shield, Lock, Save } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user, loading: authLoading, isAdmin, isEditor } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  
  // Password reset states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when profile loads
  useState(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setBio(profile.bio || '');
    }
  });

  if (authLoading || profileLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया एक इमेज फ़ाइल चुनें');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error('फ़ाइल का साइज़ 2MB से कम होना चाहिए');
      return;
    }
    
    try {
      setAvatarUploading(true);
      const avatarUrl = await uploadAvatar.mutateAsync(file);
      await updateProfile.mutateAsync({ avatar_url: avatarUrl });
      toast.success('प्रोफ़ाइल फ़ोटो अपडेट हो गई');
    } catch (error: any) {
      toast.error(error.message || 'फ़ोटो अपलोड में त्रुटि');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({
        display_name: displayName.trim() || null,
        bio: bio.trim() || null,
      });
      toast.success('प्रोफ़ाइल अपडेट हो गई');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'प्रोफ़ाइल अपडेट में त्रुटि');
    }
  };

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('पासवर्ड मेल नहीं खाते');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('पासवर्ड कम से कम 6 अक्षर का होना चाहिए');
      return;
    }
    
    try {
      setIsResettingPassword(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      toast.success('पासवर्ड सफलतापूर्वक बदल गया');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error(error.message || 'पासवर्ड बदलने में त्रुटि');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) return <Badge className="bg-primary">Admin</Badge>;
    if (isEditor) return <Badge variant="secondary">Editor</Badge>;
    return <Badge variant="outline">User</Badge>;
  };

  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    return user.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">प्रोफ़ाइल सेटिंग्स</h1>
          {getRoleBadge()}
        </div>

        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              प्रोफ़ाइल जानकारी
            </CardTitle>
            <CardDescription>
              अपनी प्रोफ़ाइल जानकारी अपडेट करें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile?.avatar_url || ''} alt={profile?.display_name || ''} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {avatarUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{profile?.display_name || 'नाम सेट करें'}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  2MB तक की JPG, PNG या GIF
                </p>
              </div>
            </div>

            <Separator />

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                ईमेल
              </Label>
              <Input value={user.email || ''} disabled />
              <p className="text-xs text-muted-foreground">
                ईमेल बदलने के लिए सपोर्ट से संपर्क करें
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">प्रदर्शित नाम</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="आपका नाम"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">परिचय</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  setIsEditing(true);
                }}
                placeholder="अपने बारे में कुछ लिखें..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                यह परिचय आपके लेखों के नीचे दिखाया जाएगा
              </p>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveProfile}
              disabled={!isEditing || updateProfile.isPending}
              className="w-full"
            >
              {updateProfile.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              प्रोफ़ाइल सेव करें
            </Button>
          </CardContent>
        </Card>

        {/* Password Reset Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              पासवर्ड बदलें
            </CardTitle>
            <CardDescription>
              अपना पासवर्ड अपडेट करें
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">नया पासवर्ड</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="नया पासवर्ड दर्ज करें"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">पासवर्ड की पुष्टि करें</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="पासवर्ड दोबारा दर्ज करें"
              />
            </div>
            <Button
              onClick={handlePasswordReset}
              disabled={!newPassword || !confirmPassword || isResettingPassword}
              variant="outline"
              className="w-full"
            >
              {isResettingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              पासवर्ड बदलें
            </Button>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>खाता जानकारी</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>यूज़र ID:</strong> {user.id}
            </p>
            <p>
              <strong>खाता बना:</strong>{' '}
              {new Date(user.created_at).toLocaleDateString('hi-IN')}
            </p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
