import { MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/authContext';

interface CommentButtonProps {
  count: number;
  onClick?: () => void;
}

export function CommentButton({ count, onClick }: CommentButtonProps) {
  const { session } = useAuth();
  return (
    <button
      onClick={onClick}
      disabled={!session}
      className="flex items-center space-x-2 text-gray-700 primary-color-hover transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      <span>{count}</span>
    </button>
  );
}
