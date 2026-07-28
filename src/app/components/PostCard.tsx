import { useEffect, useState } from 'react';
import { Bookmark, Heart, Trash2, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import { formatDate } from '../constants/dateFormat';
import supabase from '../supabaseClient';
import { useUserData } from '../contexts/userDataContext';
import { Modal } from './Modal';
import { CommentBox, type Comment } from './CommentBox';
import { getImageUrl } from '../constants/imageHandler';
import type { Post } from '../contexts/StartupProfileContext';
import { Link } from 'react-router-dom';
import { usePopup } from '../contexts/EdgePopupContext';

interface PostCardProps {
  post: Post;
  deletePost: () => void;
}

export function PostCard({ post, deletePost }: PostCardProps) {
  const { session, user } = useAuth();
  const { currentUser } = useUserData();
  const { showPopup } = usePopup();

  const [liked, setLiked] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [savingLike, setSavingLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saves, setSaves] = useState(post.saves || 0);
  const [savingSave, setSavingSave] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const viewportHeight = useState(() => {
    if (typeof window === 'undefined') return 0;

    const storedHeight = window.localStorage.getItem('postcard-viewport-height');
    if (storedHeight) {
      const parsedHeight = Number(storedHeight);
      if (!Number.isNaN(parsedHeight) && parsedHeight > 0) {
        return parsedHeight;
      }
    }

    const initialHeight = window.innerHeight;
    window.localStorage.setItem('postcard-viewport-height', String(initialHeight));
    return initialHeight;
  })[0];
  const maxImageHeight = Math.min(viewportHeight * 0.8, 720);

  const startupId = post.startups?.id;
  const canComment = Boolean(startupId);

  useEffect(() => {
    if (showCommentModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showCommentModal]);

  const postOwner = Boolean(currentUser?.id === post.user_id && user?.id == currentUser?.auth_id)

  useEffect(() => {
    if (!session || !currentUser) return;

    const fetchStatus = async () => {
      const { data: likedRow, error: likeErr } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (!likeErr) {
        setLiked(Boolean(likedRow));
      }

      // Fetch saves row explicitly (separate query to keep state correct)
      const { data: savedRow, error: saveErr } = await supabase
        .from('saves')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', currentUser.id)
        .maybeSingle();

      if (!saveErr) {
        setSaved(Boolean(savedRow));
      }
    };

    void fetchStatus();
  }, [session, currentUser, post.id]);

  const handleLike = async () => {
    if (!session) {
      showPopup('Login to like a post.', 'info');
      return;
    }
    setSavingLike(true);

    const nextLiked = !liked;
    const nextLikeCount = nextLiked ? likes + 1 : likes - 1;

    const { error } = await supabase.rpc("check_rate_limit", {
      p_user_id: currentUser?.id,
      p_action: "like",
      p_limit: 20,
      p_window: "1 minute"
    });

    if (error) {
      showPopup(`${error.message} Try again in a minute.`, 'error')
      return;
    }

    setLiked(nextLiked);
    setLikes(nextLikeCount);


    const { error: likeError } = nextLiked
      ? await supabase.from('likes').insert([{ post_id: post.id, user_id: currentUser?.id }])
      : await supabase
        .from('likes')
        .delete()
        .match({ post_id: post.id, user_id: currentUser?.id });

    if (likeError) {
      setLiked(liked);
      setLikes(likes);
      setSavingLike(false);
      return;
    }

    setSavingLike(false);
  };

  const handleSave = async () => {
    if (!session) {
      showPopup('Login to save a post.', 'info');
      return;
    }
    setSavingSave(true);

    const nextSaved = !saved;
    const nextSaveCount = nextSaved ? saves + 1 : saves - 1;

    const { error } = await supabase.rpc("check_rate_limit", {
      p_user_id: currentUser?.id,
      p_action: "save",
      p_limit: 20,
      p_window: "1 minute"
    });

    if (error) {
      showPopup(`${error.message} Try again in a minute.`, 'error')
      return;
    }

    setSaved(nextSaved);
    setSaves(nextSaveCount);

    const { error: saveError } = nextSaved
      ? await supabase.from('saves').insert([{ post_id: post.id, user_id: currentUser?.id }])
      : await supabase
        .from('saves')
        .delete()
        .match({ post_id: post.id, user_id: currentUser?.id });

    if (saveError) {
      setSaved(saved);
      setSaves(saves);
      setSavingSave(false);
      return;
    }

    setSavingSave(false);
  };

  useEffect(() => {
    if (!showCommentModal || !startupId) return;

    const fetchComments = async () => {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('opinions')
        .select('*')
        .eq('post_id', post.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data as Comment[]);
      } else {
        setComments([]);
      }
      setLoadingComments(false);
    };

    void fetchComments();
  }, [showCommentModal, startupId]);

  return (
    <div className="gallery-card bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden">

      {/* Post Image */}
      {post.image_url && (
        <img
          src={getImageUrl(post.image_url) || '/default-post-image.jpg'}
          alt="Post"
          className="w-full object-contain bg-gray-100"
          style={{ maxHeight: `${maxImageHeight}px` }}
        />
      )}

      {/* Post Content */}
      <div className="p-4">
        {/* Action Buttons */}
        <div className={`flex items-center justify-between ${post.image_url && '-mt-9'}`}>
          <Link
            to={`${post.startups ? `/startup/${post.startups?.id}` : `/mentorship-page/${post.mentorship_page?.id}`}`}
            className={`${!post.image_url && 'flex justify-between items-center gap-2'}`}
          >
            {post.startups?.display_image || post.mentorship_page?.image_url ? (
              <img
                src={getImageUrl(post.startups ? post.startups.display_image : post.mentorship_page?.image_url) || undefined}
                alt=""
                className='w-10 h-10 rounded-full shadow-sm object-cover'
              />
            ) : (
              <div className='bg-blue-600 w-10 h-10 rounded-full flex justify-center items-center'>
                <p className='text-white font-bold text-lg'>{post.startups ? post.startups?.name.charAt(0).toLocaleUpperCase() : post.mentorship_page?.topic.charAt(0).toLocaleUpperCase()}</p>
              </div>
            )}
            <p
              className='text-gray-500 font-medium text-sm my-2'
            >
              {post.startups ? post.startups.name : post.mentorship_page?.topic}
              <br />
              {post.mentorship_page && (
                <span className='text-xs text-gray-400'>--Mentorship--</span>
              )}
            </p>
          </Link>

          {postOwner && (
            <button
              title='Delete Post'
              onClick={() => setIsConfirmOpen(true)}
              className='text-red-400 px-2'
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>

        <Modal
          isOpen={isConfirmOpen}
          title="Confirm Delete"
          message="Are you sure you want to delete this post? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => {
            setIsConfirmOpen(false);
            deletePost();
          }}
          onCancel={() => setIsConfirmOpen(false)}
          confirmClassName='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg'
        />

        {/* Header */}
        {post.mentorship_post_heading && (
          <div>
            <p className='font-medium tex-gray-900'>
              {post.mentorship_post_heading}
            </p>
          </div>
        )}

        {/* Caption */}
        <div>
          <p className="text-gray-800 text-sm leading-relaxed mb-2">
            {post.content}
          </p>
        </div>

        {/* Timestamp */}
        <div className='flex justify-between items-center'>
          <p className="text-xs text-gray-400 uppercase">{formatDate(post.created_at, false)}</p>

          <div className="flex items-center space-x-4">
            {canComment && (
              <button
                title='Comment'
                onClick={() => setShowCommentModal(true)}
                disabled={!canComment}
                className={`flex items-center space-x-1 transition-colors ${canComment ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}
              >
                <MessageCircle className="w-5 h-5" />
                <p className="text-gray-500">{post.comments || 0}</p>
              </button>)}
            <button
              title='Like'
              onClick={handleLike}
              disabled={savingLike}
              className={`flex items-center space-x-1 transition-colors ${liked ? 'text-red-500' : 'text-gray-700 hover:text-red-500'}`}
            >
              <Heart
                className={`w-5 h-5 text-gray-500 ${liked ? 'fill-red-500 text-red-500' : ''}`}
              />
              <p className="text-gray-500">{likes.toLocaleString()}</p>
            </button>
            <button
              title='Save'
              onClick={handleSave}
              disabled={savingSave}
              className={`flex items-center space-x-1 transition-colors ${saved ? 'text-blue-500' : 'text-gray-700 hover:text-blue-500'}`}
            >
              <Bookmark className={`w-5 h-5 ${saved ? 'fill-blue-500 text-blue-500' : 'text-gray-500'}`} />
              <p className="text-gray-500">{saves.toLocaleString()}</p>
            </button>
          </div>
        </div>
      </div>

      {showCommentModal && startupId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center px-2 py-20 border-2">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden">
            <div className="h-full px-2 pb-6 pt-2">
              <CommentBox
                postId={post.id}
                comments={comments}
                loading={loadingComments}
                setComments={setComments}
                showComments={showCommentModal}
                setShowComments={setShowCommentModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
