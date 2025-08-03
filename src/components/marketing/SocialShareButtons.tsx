import React from 'react';
import { Facebook, Twitter, Linkedin, Share2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  className = ''
}) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0D%0A%0D%0A${encodedUrl}`
  };

  const handleShare = async (platform?: string) => {
    if (navigator.share && !platform) {
      try {
        await navigator.share({
          title,
          text: description,
          url: url,
        });
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Error sharing:', err);
        }
      }
    } else if (platform && shareLinks[platform as keyof typeof shareLinks]) {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Partager:</span>
      
      {/* Native Share Button (mobile) */}
      {navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare()}
          className="flex items-center gap-1"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Partager</span>
        </Button>
      )}
      
      {/* Individual Share Buttons */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="text-blue-600 hover:bg-blue-50"
      >
        <Facebook className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="text-blue-400 hover:bg-blue-50"
      >
        <Twitter className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="text-blue-700 hover:bg-blue-50"
      >
        <Linkedin className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare('email')}
        className="text-gray-600 hover:bg-gray-50"
      >
        <Mail className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SocialShareButtons;