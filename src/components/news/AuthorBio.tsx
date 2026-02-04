import { useProfileByUserId } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthorBioProps {
  authorId: string | null;
}

export function AuthorBio({ authorId }: AuthorBioProps) {
  const { data: profile, isLoading } = useProfileByUserId(authorId);

  // Don't render if no author or no profile with display name
  if (!authorId || (!isLoading && !profile?.display_name)) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-8 pt-8 border-t">
        <div className="flex gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name.charAt(0).toUpperCase();
    }
    return 'A';
  };

  return (
    <div className="mt-8 pt-8 border-t">
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex gap-4 items-start">
          <Avatar className="w-20 h-20 border-2 border-primary/20">
            <AvatarImage 
              src={profile.avatar_url || ''} 
              alt={profile.display_name || 'लेखक'} 
            />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <p className="text-sm text-primary font-medium mb-1">
              लेखक के बारे में
            </p>
            <h3 className="text-xl font-bold mb-2">
              {profile.display_name}
            </h3>
            {profile.bio ? (
              <p className="text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                इस लेखक ने अभी अपना परिचय नहीं जोड़ा है।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
