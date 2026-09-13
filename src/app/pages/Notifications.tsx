import { useEffect, useMemo, useState } from 'react';
import { Bell, Bookmark, CheckCheck, Heart, MessageCircle, Reply, UserPlus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/authContext';
import { useUserData } from '../contexts/userDataContext';
import { useWebData } from '../contexts/webData';
import ScrollToTop from '../constants/scrollToTop';
import supabase from '../supabaseClient';
import { formatNotification, type NotificationAction } from '../constants/notificationFns';

type NotificationFilter = 'all' | 'unread';
type NotificationType =
  'follow'
  | 'like'
  | 'comment'
  | 'saved'
  | 'replied';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type NotificationRow = {
  id: string;
  recipient_id: string | null;
  actor_id: string | null;
  action_type: NotificationAction;
  post_id?: number | null;
  opinion_id?: string | null;
  business_id?: string | null;
  mentorship_id?: string | null;
  meta?: Record<string, unknown> | null;
  created_at: string;
  is_read?: boolean | null;
  read?: boolean | null;
};

type Actor = {
  id: string;
  full_name?: string | null;
  user_name?: string | null;
};

const notificationIcon = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
  saved: Bookmark,
  replied: Reply,
};

const getNotificationType = (action: NotificationAction): NotificationType => {
  if (action.includes('followed')) return 'follow';
  if (action.includes('commented')) return 'comment';
  if (action.includes('replied')) return 'replied';
  if (action.includes('saved')) return 'saved';
  return 'like';
};

const formatCreatedAt = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

export function Notifications() {
  const { session } = useAuth();
  const { currentUser } = useUserData();
  const { webName } = useWebData();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = currentUser?.id;
    if (!userId) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    let active = true;

    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);

      const { data, error: notificationError } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false });

      if (notificationError) {
        if (active) {
          setError('Unable to load your notifications right now.');
          setLoading(false);
        }
        return;
      }

      const rows = (data || []) as NotificationRow[];
      const actorIds = [...new Set(rows.map((row) => row.actor_id).filter((id): id is string => Boolean(id)))];
      let actors: Actor[] = [];

      if (actorIds.length > 0) {
        const { data: actorData } = await supabase
          .from('users')
          .select('id, full_name, user_name')
          .in('id', actorIds);
        actors = (actorData || []) as Actor[];
      }

      const actorById = new Map(actors.map((actor) => [actor.id, actor]));
      const nextNotifications = rows.map((row): NotificationItem => {
        const actor = row.actor_id ? actorById.get(row.actor_id) : undefined;
        const actorName = actor?.full_name || actor?.user_name || 'Someone';
        const formatted = formatNotification(row.action_type, {
          recipient_id: row.recipient_id,
          actor_id: row.actor_id,
          action_type: row.action_type,
          action_profile_name: actorName,
          post_id: row.post_id,
          opinion_id: row.opinion_id,
          business_id: row.business_id,
          mentorship_id: row.mentorship_id,
          extra: row.meta,
        });

        return {
          id: row.id,
          type: getNotificationType(row.action_type),
          title: formatted.title,
          message: formatted.body,
          createdAt: formatCreatedAt(row.created_at),
          read: Boolean(row.is_read ?? row.read ?? false),
        };
      });

      if (active) {
        setNotifications(nextNotifications);
        setLoading(false);
      }
    };

    void fetchNotifications();

  }, [currentUser?.id]);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = useMemo(
    () => filter === 'unread'
      ? notifications.filter((notification) => !notification.read)
      : notifications,
    [filter, notifications]
  );

  const markAllAsRead = async () => {
    setNotifications((currentNotifications) => currentNotifications.map((notification) => ({
      ...notification,
      read: true,
    })));

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', currentUser?.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking notification as read:', error.message);
      return;
    }

  };

  const markAsRead = async (notificationId: string) => {
    setNotifications((currentNotifications) => currentNotifications.map((notification) => {
      if (notification.id === notificationId) {
        return { ...notification, read: true };
      }
      return notification;
    }));

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) {
      console.error('Error marking notification as read:', error.message);
      return;
    }

  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />

      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="max-w-xl text-sm leading-6 text-gray-500">
              Keep track of activity around your profile, businesses, and mentorship pages.
            </p>
          </div>

          <button
            type="button"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold primary-color transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        </section>

        <section className="overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2" role="tablist" aria-label="Notification filters">
              {(['all', 'unread'] as NotificationFilter[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={filter === option}
                  onClick={() => setFilter(option)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize transition ${filter === option ? 'primary-soft-bg primary-color' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                >
                  {option}
                  {option === 'unread' && unreadCount > 0 && (
                    <span className="ml-1.5">({unreadCount})</span>
                  )}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">{currentUser?.full_name || webName}</span>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : error ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : visibleNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {visibleNotifications.map((notification) => {
                const Icon = notificationIcon[notification.type];
                console.log(notification)

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`flex w-full items-start gap-2 px-4 py-3 text-left transition hover:bg-gray-50 sm:px-6 ${notification.read ? 'bg-white' : 'primary-soft-bg/40'}`}
                  >
                    <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notification.read ? 'bg-gray-100 text-gray-500' : 'primary-bg text-white'}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="flex flex-wrap items-center justify-between">
                        <span className="font-semibold text-sm text-gray-900">{notification.title}</span>
                        <span className="text-xs text-gray-400">{notification.createdAt}</span>
                      </span>
                      <span className="text-sm text-gray-600">{notification.message}</span>
                    </span>
                    {!notification.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full primary-bg" aria-label="Unread" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full primary-soft-bg primary-color">
                <Bell className="h-8 w-8" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-gray-900">
                {filter === 'unread' ? 'You are all caught up' : 'No notifications yet'}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                {session
                  ? 'When people interact with your profile, businesses, or posts, those updates will appear here.'
                  : `Sign in to see your ${webName} activity here.`}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
