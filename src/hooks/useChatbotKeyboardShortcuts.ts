import { useEffect } from 'react';

interface UseChatbotKeyboardShortcutsProps {
  onToggleChat: () => void;
  onNewConversation: () => void;
  onFocusInput: () => void;
  enabled: boolean;
}

export const useChatbotKeyboardShortcuts = ({
  onToggleChat,
  onNewConversation,
  onFocusInput,
  enabled
}: UseChatbotKeyboardShortcutsProps) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K: Toggle chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onToggleChat();
      }

      // Ctrl/Cmd + N: New conversation
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onNewConversation();
      }

      // Ctrl/Cmd + /: Focus input
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        onFocusInput();
      }

      // Escape: Close chat (if open)
      if (e.key === 'Escape') {
        onToggleChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onToggleChat, onNewConversation, onFocusInput]);
};
