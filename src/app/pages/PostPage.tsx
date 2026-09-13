import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { CommentBox, type Comment } from '../components/CommentBox';
import { PostCard } from '../components/PostCard';
import Loader from '../constants/loader';
import { useStartup, type Post } from '../contexts/StartupProfileContext';
import supabase from '../supabaseClient';

export default function PostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleDeletePost } = useStartup();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showComments, setShowComments] = useState(true);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, startups(id, display_image, name, cartegory), mentorship_page(id, topic, image_url, category)')
        .eq('id', id)
        .maybeSingle();

      if (active) {
        setPost(!error && data ? data as Post : null);
        setLoading(false);
      }
    };

    void fetchPost();

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const fetchComments = async () => {
      setLoadingComments(true);
      const { data, error } = await supabase
        .from('opinions')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (active) {
        setComments(!error && data ? data as Comment[] : []);
        setLoadingComments(false);
      }
    };

    void fetchComments();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <Loader />;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-200 pt-12">
        <Navbar showSearch={true} />
        <main className="max-w-3xl mx-auto px-3 py-10">
          <div className="bg-white rounded-md shadow-sm p-8 text-center">
            <h1 className="text-xl font-semibold text-gray-900">Post not found</h1>
            <p className="mt-2 text-gray-500">This post may have been deleted or is no longer available.</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-5 inline-flex items-center gap-2 primary-bg text-white px-4 py-2 rounded-md primary-bg-hover"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar showSearch={true} />

      <main className="max-w-6xl mx-auto sm:px-3 py-3 sm:py-5">

        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-3 items-start pt-10">
          <section className="min-w-0 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain scrollbar-hide">
            <PostCard
              post={post}
              fitViewport
              deletePost={() => {
                void handleDeletePost(post.id);
                navigate('/');
              }}
            />
          </section>

          <section className="bg-white border border-gray-300 rounded-sm shadow-sm p-4 min-w-0 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:overscroll-contain scrollbar-hide">
            <CommentBox
              startupId={post.startups?.id}
              mentorshipId={post.mentorship_page?.id}
              postId={post.id}
              comments={comments}
              loading={loadingComments}
              setComments={setComments}
              showComments={showComments}
              setShowComments={setShowComments}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
