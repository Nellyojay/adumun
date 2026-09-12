import { useMemo, useState } from 'react';
import { Bell, CheckCheck, Heart, MessageCircle, UserPlus } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/authContext';
import { useUserData } from '../contexts/userDataContext';
import { useWebData } from '../contexts/webData';
import ScrollToTop from '../constants/scrollToTop';

type NotificationFilter = 'all' | 'unread';
type NotificationType = 'follow' | 'like' | 'comment';

type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const notificationIcon = {
  follow: UserPlus,
  like: Heart,
  comment: MessageCircle,
};

const exampleNotifications: NotificationItem[] = [
  {
    id: 'notification-1',
    type: 'follow',
    title: 'New follower',
    message: 'Amina Okafor started following your business profile.',
    createdAt: '10 minutes ago',
    read: false,
  },
  {
    id: 'notification-2',
    type: 'like',
    title: 'Your post was liked',
    message: 'Daniel Mensah liked your latest update about your product launch.',
    createdAt: '1 hour ago',
    read: false,
  },
  {
    id: 'notification-3',
    type: 'comment',
    title: 'New comment on your post',
    message: 'Sarah Williams commented: "This is a thoughtful approach. I would love to learn more."',
    createdAt: 'Yesterday',
    read: true,
  },
  {
    id: 'notification-4',
    type: 'follow',
    title: 'New follower',
    message: 'Michael Adeyemi started following your mentorship page.',
    createdAt: '2 days ago',
    read: true,
  },
];

export function Notifications() {
  const { session } = useAuth();
  const { currentUser } = useUserData();
  const { webName } = useWebData();
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(exampleNotifications);

  const unreadCount = notifications.filter((notification) => !notification.read).length;
  const visibleNotifications = useMemo(
    () => filter === 'unread'
      ? notifications.filter((notification) => !notification.read)
      : notifications,
    [filter, notifications]
  );

  const markAllAsRead = () => {
    setNotifications((currentNotifications) => currentNotifications.map((notification) => ({
      ...notification,
      read: true,
    })));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((currentNotifications) => currentNotifications.map((notification) => (
      notification.id === notificationId ? { ...notification, read: true } : notification
    )));
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

          {visibleNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {visibleNotifications.map((notification) => {
                const Icon = notificationIcon[notification.type];

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    className={`flex w-full items-start gap-2 px-4 py-5 text-left transition hover:bg-gray-50 sm:px-6 ${notification.read ? 'bg-white' : 'primary-soft-bg/40'}`}
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
