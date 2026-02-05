 import { Facebook, Twitter, Share2, Instagram, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
 import { toast } from 'sonner';

interface SocialShareButtonsProps {
  title: string;
  url: string;
}

export function SocialShareButtons({ title, url }: SocialShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    whatsapp: `https://web.whatsapp.com/send?phone=919389535427&text=${encodedTitle}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(`${title} ${url}`);
    toast.success('लिंक कॉपी हो गया! अब Instagram पर शेयर करें');
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">शेयर करें:</span>
      
      {/* WhatsApp */}
      <Button
        variant="outline"
        size="icon"
        className="bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/30 text-[#25D366]"
        onClick={() => handleShare('whatsapp')}
        title="WhatsApp पर शेयर करें"
      >
        <Share2 className="h-4 w-4" />
      </Button>

      {/* Facebook */}
      <Button
        variant="outline"
        size="icon"
        className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border-[#1877F2]/30 text-[#1877F2]"
        onClick={() => handleShare('facebook')}
        title="Facebook पर शेयर करें"
      >
        <Facebook className="h-4 w-4" />
      </Button>

      {/* Twitter */}
      <Button
        variant="outline"
        size="icon"
        className="bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-[#1DA1F2]/30 text-[#1DA1F2]"
        onClick={() => handleShare('twitter')}
        title="Twitter पर शेयर करें"
      >
        <Twitter className="h-4 w-4" />
      </Button>

      {/* Instagram */}
      <Button
        variant="outline"
        size="icon"
        className="bg-[#E4405F]/10 hover:bg-[#E4405F]/20 border-[#E4405F]/30 text-[#E4405F]"
        onClick={handleInstagramShare}
        title="Instagram के लिए लिंक कॉपी करें"
      >
        <Instagram className="h-4 w-4" />
      </Button>
    </div>
  );
}
