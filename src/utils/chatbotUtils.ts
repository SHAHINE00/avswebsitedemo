/**
 * Utility functions for chatbot functionality
 */

/**
 * Generate a unique conversation title based on first message
 */
export const generateConversationTitle = (firstMessage: string): string => {
  const maxLength = 50;
  const cleaned = firstMessage.trim().replace(/\s+/g, ' ');
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength) + '...';
};

/**
 * Format message timestamp for display
 */
export const formatMessageTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const diffMinutes = Math.floor(diff / 60000);
  const diffHours = Math.floor(diff / 3600000);
  const diffDays = Math.floor(diff / 86400000);

  if (diffMinutes < 1) return 'À l\'instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;
  
  return timestamp.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Detect if message contains code blocks
 */
export const hasCodeBlock = (content: string): boolean => {
  return content.includes('```');
};

/**
 * Extract code language from code block
 */
export const extractCodeLanguage = (codeBlock: string): string => {
  const match = codeBlock.match(/^```(\w+)/);
  return match ? match[1] : 'plaintext';
};

/**
 * Sanitize user input before sending to AI
 */
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .slice(0, 2000); // Max 2000 characters
};

/**
 * Check if file type is supported
 */
export const isSupportedFileType = (file: File): boolean => {
  const supportedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ];
  return supportedTypes.includes(file.type);
};

/**
 * Get file type icon
 */
export const getFileTypeIcon = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const iconMap: Record<string, string> = {
    pdf: '📄',
    jpg: '🖼️',
    jpeg: '🖼️',
    png: '🖼️',
    gif: '🖼️',
    webp: '🖼️',
    doc: '📝',
    docx: '📝',
    txt: '📃',
    default: '📎'
  };
  
  return iconMap[ext || ''] || iconMap.default;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

/**
 * Check if conversation is recent (within 24 hours)
 */
export const isRecentConversation = (timestamp: string): boolean => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return diff < 24 * 60 * 60 * 1000; // 24 hours
};

/**
 * Group conversations by date
 */
export const groupConversationsByDate = (conversations: any[]) => {
  const groups: Record<string, any[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    thisMonth: [],
    older: []
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const thisWeek = new Date(today.getTime() - 7 * 86400000);
  const thisMonth = new Date(today.getTime() - 30 * 86400000);

  conversations.forEach(conv => {
    const date = new Date(conv.updated_at);
    
    if (date >= today) {
      groups.today.push(conv);
    } else if (date >= yesterday) {
      groups.yesterday.push(conv);
    } else if (date >= thisWeek) {
      groups.thisWeek.push(conv);
    } else if (date >= thisMonth) {
      groups.thisMonth.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return groups;
};

/**
 * Play notification sound
 */
export const playNotificationSound = () => {
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (e) {
    console.log('Audio not supported:', e);
  }
};

/**
 * Detect user's preferred language from browser
 */
export const detectBrowserLanguage = (): 'fr' | 'ar' | 'en' => {
  const browserLang = navigator.language.split('-')[0];
  
  if (browserLang === 'fr') return 'fr';
  if (browserLang === 'ar') return 'ar';
  if (browserLang === 'en') return 'en';
  
  return 'fr'; // Default to French
};
