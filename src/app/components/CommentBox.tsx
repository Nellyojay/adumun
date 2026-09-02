import { useCallback, useEffect, useState } from 'react';
import { Send, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import { useUserData } from '../contexts/userDataContext';
import { BsX } from 'react-icons/bs';
import supabase from '../supabaseClient';

export interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  startup_id: string | null;
  post_id: number | null;
  parent_id?: number | null;
  user_name?: string;
}

interface CommentNode extends Comment {
  children: CommentNode[];
}

interface CommentBoxProps {
  startupId?: string | null;
  postId?: number | null;
  comments: Comment[];
  loading: boolean;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  showComments: boolean;
  setShowComments: (show: boolean) => void;
}

export function CommentBox({ startupId, postId, comments, loading, setComments, setShowComments }: CommentBoxProps) {
  const { session } = useAuth();
  const { currentUser } = useUserData();
  const [newComment, setNewComment] = useState('');
  const [openRepliesCommentId, setOpenRepliesCommentId] = useState<{ [key: string]: boolean }>({});
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [visibleCountByParent, setVisibleCountByParent] = useState<Record<string, number>>({ root: 3 });
  const REPLY_DEPTH_LIMIT = 3;

  const getVisibleCount = (parentKey: string) => visibleCountByParent[parentKey] ?? 3;

  const showMore = (parentKey: string, total: number) => {
    setVisibleCountByParent((prev) => ({
      ...prev,
      [parentKey]: Math.min(total, (prev[parentKey] ?? 3) + 3),
    }));
  };

  const hideAll = (parentKey: string) => {
    setVisibleCountByParent((prev) => ({
      ...prev,
      [parentKey]: 3,
    }));
  };

  useEffect(() => {
    if (!startupId || !postId) return;

    const commentsChannel = supabase
      .channel(`realtime-comments-${startupId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'opinions', filter: `startup_id=eq.${startupId},post_id=eq.${postId}` },
        (payload: any) => {
          setComments((prev) => {
            const record = payload.new || payload.old;
            if (!record) return prev;

            switch (payload.eventType) {
              case 'INSERT':
                if (prev.some((c) => c.id === record.id)) return prev;
                return [record, ...prev];
              case 'UPDATE':
                return prev.map((c) => (c.id === record.id ? record : c));
              case 'DELETE':
                return prev.filter((c) => c.id !== record.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [startupId, postId, setComments]);

  const isAuthenticated = Boolean(session?.user);

  const buildCommentTree = (): CommentNode[] => {
    const nodes = comments.map((comment) => ({ ...comment, children: [] }));
    const map = new Map<number, CommentNode>(nodes.map((node) => [node.id, node]));
    const roots: CommentNode[] = [];

    nodes.forEach((node) => {
      if (node.parent_id && map.has(node.parent_id)) {
        map.get(node.parent_id)!.children.push(node);
      } else {
        roots.push(node);
      }
    });

    const traverse = (items: CommentNode[]) => {
      items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      items.forEach((item) => traverse(item.children));
    };

    traverse(roots);
    return roots;
  };

  // Toggle replies visibility for a specific comment
  const toggleReplies = useCallback((commentId: number | string) => {
    const key = String(commentId);
    setOpenRepliesCommentId(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const renderComments = (nodes: CommentNode[], level = 0, parentKey = 'root'): React.ReactNode => {
    const shouldBatch = level > 0;
    const visibleCount = shouldBatch ? getVisibleCount(parentKey) : nodes.length;
    const visibleNodes = shouldBatch ? nodes.slice(0, visibleCount) : nodes;
    const hasMore = shouldBatch && nodes.length > visibleCount;

    return (
      <>
        {visibleNodes.map((node) => (
          <div
            key={node.id}
            className={`bg-white p-1 rounded-xl ${level > 0 ? 'ml-4' : 'border border-gray-200'}`}
          >
            <div className="flex gap-1">
              <div>
                <div className="w-8 h-8 rounded-full primary-soft-bg shrink-0 flex items-center justify-center">
                  <span className="text-sm font-medium primary-color">
                    {(node.user_name || 'U')[0].toUpperCase()}
                  </span>
                </div>
                {openRepliesCommentId[String(node.id)] && (
                  <div className={`${level >= 0 && node.children.length > 0 ? 'border-l-2 border-b-2 border-gray-300 rounded-b-lg' : ''} h-full w-4 ml-4`} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs md:text-sm font-medium text-gray-500">{node.user_name || 'Unknown'}</span>
                    <span className="text-xs text-gray-500 ml-2">{new Date(node.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    {level < 2 && (
                      <button
                        type="button"
                        title="Reply to this comment"
                        onClick={() => setReplyToCommentId(node.id)}
                        className="text-xs primary-color hover:underline pr-2"
                      >
                        Reply
                      </button>
                    )}
                    {isAuthenticated && (currentUser?.id || session.user.id) === node.user_id && (
                      <>
                        <button
                          type="button"
                          title="Edit this comment"
                          onClick={() => beginEdit(node)}
                          className="p-1 text-gray-500 primary-color-hover"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete this comment"
                          onClick={() => handleDeleteComment(node.id, node.user_id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingCommentId === node.id ? (
                  <>
                    <textarea
                      className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 primary-focus"
                      rows={2}
                      placeholder="Edit your comment"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingText('');
                        }}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-800">{node.content}</p>
                )}

                {node.children.length > 0 && level < REPLY_DEPTH_LIMIT - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleReplies(node.id);
                    }}
                    className="text-xs primary-color hover:underline mt-1"
                  >
                    {openRepliesCommentId[String(node.id)] ? 'Hide Replies' : `View Replies (${node.children.length})`}
                  </button>
                )}
              </div>
            </div>

            {node.children.length > 0 && (
              <div className={`mt-1 space-y-3 ${!openRepliesCommentId[String(node.id)] ? 'hidden' : ''}`} id={`comment-${node.id}`}>
                {renderComments(node.children, level + 1, String(node.id))}
              </div>
            )}
          </div>
        ))}

        {hasMore && (
          <div key={`${parentKey}-more`} className="flex flex-wrap gap-2 mt-2">
            <button
              type="button"
              onClick={() => showMore(parentKey, nodes.length)}
              className="text-xs primary-color hover:underline"
            >
              View more ({nodes.length - visibleCount})
            </button>
            {visibleCount > 3 && (
              <button
                type="button"
                onClick={() => hideAll(parentKey)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Hide all
              </button>
            )}
          </div>
        )}
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !newComment.trim()) return;

    const content = newComment.trim();
    const { data, error } = await supabase
      .from('opinions')
      .insert([
        {
          content,
          user_id: currentUser?.id || session.user.id,
          startup_id: startupId || null,
          post_id: postId || null,
          parent_id: replyToCommentId,
          user_name: currentUser?.user_name || `User${(currentUser?.id.slice(0, 5) || session.user.id).slice(0, 5)}`,
        }
      ])
      .select('*')
      .single();

    if (error) {
      alert('Failed to post comment. Please try again.');
      return;
    }

    setNewComment('');
    setReplyToCommentId(null);
    if (data) {
      setComments((prev) => [data as Comment, ...prev]);
    }
  };

  const handleDeleteComment = async (commentId: number, commentUserId: string) => {
    if (!isAuthenticated || (currentUser?.id || session.user.id) !== commentUserId) {
      alert('You can only delete your own comments.');
      return;
    }

    const confirmed = confirm('Delete this comment?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('opinions')
      .delete()
      .eq('id', commentId);

    if (error) {
      alert('Failed to delete comment.');
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const beginEdit = (comment: Comment) => {
    if (!isAuthenticated || (currentUser?.id || session.user.id) !== comment.user_id) {
      alert('You can only edit your own comments.');
      return;
    }
    setEditingCommentId(comment.id);
    setEditingText(comment.content);
  };

  const saveEdit = async () => {
    if (!editingCommentId || !editingText.trim()) return;

    const { data, error } = await supabase
      .from('opinions')
      .update({ content: editingText.trim() })
      .eq('id', editingCommentId)
      .select('*')
      .single();

    if (error) {
      alert('Failed to update comment.');
      return;
    }

    setComments((prev) => prev.map((c) => (c.id === editingCommentId ? (data as Comment) : c)));
    setEditingCommentId(null);
    setEditingText('');
  };


  return (
    <div className="flex flex-col gap-4 mt-2 h-full min-h-0">
      <div className='flex gap-2 items-center justify-between'>
        <h2 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h2>
        <button
          title='close'
          onClick={() => setShowComments(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <BsX className="w-6 h-6" />
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading comments...</div>}

      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
        {renderComments(buildCommentTree(), 0, 'root')}
      </div>

      {replyToCommentId && (
        <div className="flex items-center justify-between primary-soft-bg border primary-border rounded-lg px-3 py-2 text-sm primary-soft-color">
          <span>Replying to comment #{replyToCommentId}</span>
          <button
            type="button"
            onClick={() => setReplyToCommentId(null)}
            className="primary-color hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!session}
          autoFocus={replyToCommentId !== null}
          placeholder={session ? 'Add a comment...' : 'Log in to comment'}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
        />
        <button
          title='Submit'
          type='submit'
          className='primary-bg text-white p-2 rounded-full primary-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={!session || !newComment.trim()}
        >
          <Send className='w-5 h-5' />
        </button>
      </form>
    </div>
  );
}

