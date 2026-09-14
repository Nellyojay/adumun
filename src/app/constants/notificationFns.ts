// Helper to generate user-facing notification text and a DB-ready payload
// DB columns expected: receipient_profile_id, action_profile_id, action_type, post_id?, comment_id?

import supabase from "../supabaseClient";

export type NotificationAction =
  | 'post_liked'
  | 'request_accepted'
  | 'post_saved'
  | 'comment_liked'
  | 'post_replied'
  | 'comment_replied'
  | 'followed'
  | 'mentioned_you_in_a_post'
  | 'mentioned_you_in_a_comment'
  | 'friend_request'
  | 'accepted_your_follow_request'
  | 'commented_on_your_post'
  | 'commented_on_a_post_you_saved'
  | 'replied_to_your_comment'
  | 'reposted_your_post';

export type NotificationInput = {
  recipient_id?: string | null;
  actor_id?: string | null;
  action_profile_name?: string | null;
  action_type: NotificationAction;
  post_id?: number | null;
  opinion_id?: string | null;
  business_id?: string | null;
  mentorship_id?: string | null;
  extra?: Record<string, any> | null;
};

export type FormattedNotification = {
  title: string; // short title for the UI
  body: string; // full message
  dbRow: {
    recipient_id?: string | null;
    actor_id?: string | null;
    action_type: NotificationAction;
    post_id?: number | null;
    business_id?: string | null;
    mentorship_id?: string | null;
    meta?: Record<string, any> | null;
  };
};

const getName = (name?: string | null) => name || 'Someone';

export function formatNotification(action: NotificationAction, data: NotificationInput): FormattedNotification {
  const actor = getName(data.action_profile_name);

  const mapping: Record<NotificationAction, (d: NotificationInput) => { title: string; body: string }> = {
    'post_liked': () => ({ title: 'Post liked', body: `${actor} liked your post.` }),
    'request_accepted': () => ({ title: 'Request accepted', body: `${actor} accepted your friend request.` }),
    'post_saved': () => ({ title: 'Post saved', body: `${actor} saved your post.` }),
    'comment_liked': () => ({ title: 'Comment liked', body: `${actor} liked your comment.` }),
    'post_replied': () => ({ title: 'New reply', body: `${actor} replied to your post.` }),
    'comment_replied': () => ({ title: 'Reply', body: `${actor} replied to a comment.` }),
    'followed': () => ({ title: 'New follower', body: `${actor} followed ${data.extra?.businessName || 'this business'}.` }),
    'mentioned_you_in_a_post': () => ({ title: 'Mentioned', body: `${actor} mentioned you in a post.` }),
    'mentioned_you_in_a_comment': () => ({ title: 'Mentioned', body: `${actor} mentioned you in a comment.` }),
    'friend_request': () => ({ title: 'Friend request', body: `${actor} wants to be your friend.` }),
    'accepted_your_follow_request': () => ({ title: 'Request accepted', body: `${actor} accepted your follow request.` }),
    'commented_on_your_post': () => ({ title: 'Comment', body: `${actor} commented on your post.` }),
    'commented_on_a_post_you_saved': () => ({ title: 'Comment', body: `${actor} commented on a post you saved.` }),
    'replied_to_your_comment': () => ({ title: 'Reply', body: `${actor} replied to your comment.` }),
    'reposted_your_post': () => ({ title: 'Post reposted', body: `${actor} reposted your post.` }),
  };

  const formatter = mapping[action] || (() => ({ title: 'Notification', body: `${actor} performed an action.` }));

  const { title, body } = formatter(data);

  const dbRow = {
    recipient_id: data.recipient_id ?? null,
    actor_id: data.actor_id ?? null,
    action_type: action,
    post_id: data.post_id ?? null,
    business_id: data.business_id ?? null,
    mentorship_id: data.mentorship_id ?? null,
    meta: data.extra ?? null,
  };

  return { title, body, dbRow };
}

export default formatNotification;

// Create a DB notification row using Supabase. Skips creating a notification when recipient equals actor.
export async function createNotification(action: NotificationAction, data: NotificationInput) {
  const { dbRow } = formatNotification(action, data);

  // don't notify self
  if (dbRow.recipient_id && dbRow.actor_id && dbRow.recipient_id === dbRow.actor_id) {
    return { data: null, error: null };
  }

  try {
    const res = await supabase.from('notifications').insert(dbRow).select().single();

    return res;
  } catch (err: any) {
    return { data: null, error: err } as any;
  }
}