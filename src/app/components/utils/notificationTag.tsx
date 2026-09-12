import { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import { useUserData } from '../../contexts/userDataContext';

export function NotificationTag() {
  const { currentUser } = useUserData();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const userId = currentUser?.id;

    if (!userId) {
      setUnreadCount(0);
      return;
    }

    let active = true;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (active && !error) {
        setUnreadCount(count ?? 0);
      }
    };

    void fetchUnreadCount();

    const channel = supabase
      .channel(`notification-count-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${userId}` },
        () => {
          void fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [currentUser?.id]);

  if (unreadCount === 0) return null;

  return (
    <span
      aria-label={`${unreadCount} unread notifications`}
      className="absolute right-3 md:-right-4 top-1 md:-top-1.5 flex min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white shadow-sm"
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}
