import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { PostCard } from '../components/PostCard';
import { Modal } from '../components/Modal';
import { CommentBox } from '../components/CommentBox';
import type { Comment, Comment as StartupComment } from '../components/CommentBox';
import supabase from '../supabaseClient';
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Share2,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar,
  Edit,
  Plus,
  Trash2,
  AlertTriangle,
  Star
} from 'lucide-react';
import { FaFacebook, FaWhatsapp } from 'react-icons/fa';
import { BsChevronDown, BsTwitterX } from 'react-icons/bs';
import { useAuth } from '../contexts/authContext';
import { useStartup } from '../contexts/StartupProfileContext';
import { formatDate } from '../constants/dateFormat';
import { useUserData } from '../contexts/userDataContext';
import { formatPhoneEA } from '../constants/phoneNumberormater';
import { getImageUrl } from '../constants/imageHandler';
import ScrollToTop from '../constants/scrollToTop';

export function StartupProfile() {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { currentUser } = useUserData();
  const {
    startupData,
    loadingPosts,
    posts,
    fetchStartupPosts,
    setLoadingPosts,
    setPosts,
    handleDeletePost
  } = useStartup();
  const { id } = useParams();
  const { setSelectedStartup } = useStartup();

  const rawStartup = startupData?.find(s => s.id === id) || null;
  const isOwner = Boolean(rawStartup?.user_id === currentUser?.id && currentUser?.auth_id === user?.id);

  const activeStartup = rawStartup;
  const startup = activeStartup;
  const StartupOwnPosts = posts.filter(p => p.startups?.id === startup?.id)

  const [following, setFollowing] = useState(false);
  const [lineClamp, setLineClamp] = useState(false);
  const [favorites, setFavorites] = useState(false)
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<StartupComment[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setPosts([]);
      setLoadingPosts(false);
      return;
    }

    setLoadingPosts(true);

    fetchStartupPosts();

    const postsChannel = supabase
      .channel(`realtime-posts-${id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts', filter: `startup_id=eq.${id}` },
        (payload: any) => {
          setPosts((prevPosts) => {
            const record = payload.new || payload.old;
            if (!record) return prevPosts;

            switch (payload.eventType) {
              case 'INSERT':
                return [record, ...prevPosts];
              case 'UPDATE':
                return prevPosts.map((p) =>
                  p.id === record.id
                    ? {
                      ...p,
                      ...record,
                      startups: record.startups ?? p.startups,
                      mentorship_page: record.mentorship_page ?? p.mentorship_page,
                    }
                    : p
                );
              case 'DELETE':
                return prevPosts.filter((p) => p.id !== record.id);
              default:
                return prevPosts;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
    };
  }, [startup?.id]);

  useEffect(() => {
    setLoading(true);
    const fetchComments = async () => {
      if (!activeStartup?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('opinions')
        .select('id, content, created_at, user_id, startup_id, parent_id, user_name')
        .eq('startup_id', id)
        .order('created_at', { ascending: false });

      setLoading(false);
      if (error) {
        return;
      }

      setComments((data || []) as Comment[]);
    };

    fetchComments();
  }, [startup?.id]);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: startup?.name,
        text: `Check out ${startup?.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  const handleDeleteStartup = async () => {
    if (!startup || !user || !isOwner) {
      setOpenDeleteModal(false);
      return;
    }

    setOpenDeleteModal(false);

    const { error } = await supabase
      .from('startups')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Failed to delete startup. Please try again.");
    } else {
      alert("Startup deleted successfully.");
      navigate(-1)
    }
  };

  const handleFollow = async () => {
    if (!session) {
      alert("Please log in to follow startups.");
      return;
    }

    if (startup?.user_id === currentUser?.id) return;

    setFollowing(!following);

    const { error } = !following
      ? await supabase.from('follows').insert([{ startup_id: id, user_id: currentUser?.id }]).select('id').single()
      : await supabase.from('follows').delete().match({ startup_id: id, user_id: currentUser?.id }).select('id').single();

    if (error) {
      alert("Failed to update follow status. Please try again.");
      setFollowing(following);
    }

  }

  const handleFavorites = async () => {
    if (!user) return;

    setFavorites(!favorites);

    const { error } = !favorites
      ? await supabase.from('favorites').insert({ user_id: currentUser?.id, startup_id: id })
      : await supabase.from('favorites').delete().match({ user_id: currentUser?.id, startup_id: id })

    if (error) {
      alert("Failed to add to favorites. please try again.")
      setFavorites(favorites)
    }

  }

  useEffect(() => {
    if (!session || !currentUser || !startup) {
      setFollowing(false);
      setFavorites(false);
      return;
    }

    const reserveFollowingState = async () => {
      if (!session) {
        setFollowing(false);
        return;
      }

      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('startup_id', id)
        .eq('user_id', currentUser?.id)

      if (error) {
        console.error('Failed to fetch follow status', error);
        setFollowing(false);
      }

      setFollowing(Boolean(data && data.length > 0));
    }

    const reserveFavoriteState = async () => {
      if (!session) {
        setFavorites(false);
        return;
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('startup_id', id)
        .eq('user_id', currentUser?.id)

      if (error) {
        console.error('Failed to fetch favorite status', error);
        setFavorites(false);
      }

      setFavorites(Boolean(data && data.length > 0));
    }

    reserveFavoriteState();
    reserveFollowingState();
  }, [session, currentUser, startup]);

  if (!startupData || !activeStartup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar showAuth={false} />
        <div className="pt-24 text-center">
          <h1 className="text-2xl text-gray-900">Startup not found</h1>
          <Link to="/feed" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Feed
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar showAuth={false} />
      <ScrollToTop />

      <main className="max-w-6xl mx-auto pt-12 pb-20">
        {/* Banner Image */}
        <div className="relative w-full h-48 md:h-64 bg-linear-to-br from-gray-500 via-gray-700 to-gray-900">
          <img
            src={getImageUrl(startup?.cover_image) || 'https://user-images.githubusercontent.com/237508/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png'}
            alt={`${startup?.name} banner`}
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        {/* Profile Header Section */}
        <div className="flex flex-col items-center">
          <div className="bg-white -mt-8 w-md sm:min-w-lg mx-4 rounded-3xl shadow-lg p-6 relative z-10">
            {/* Logo overlapping banner */}
            <div className="flex flex-col items-center md:flex-row md:items-start gap-4">
              <div className="w-28 h-28 rounded-full shadow-xl -mt-14 bg-gray-200 flex items-center justify-center border border-gray-300">
                {startup?.display_image ? (
                  <img
                    src={getImageUrl(startup?.display_image) || 'https://user-images.githubusercontent.com/237508/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png'}
                    alt=""
                    className="object-cover w-28 h-28 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center shadow-xl border-4 border-white"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-700">{startup?.name[0]}</span>
                )}
              </div>

              <div className="flex-1 text-center md:text-left mt-2">

                {/* Startup Name */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {startup?.name}
                </h1>

                {/* Founder Name */}
                <Link to={`/profile/${startup?.user_id ?? ''}`} className="text-lg text-gray-600 mb-2 md:hover:text-blue-600">
                  Founded by {startup?.founder_name}
                </Link>

                {/* Category and Location */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                  <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {startup?.products_and_services ? startup.products_and_services.join(', ') : 'General'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    {startup?.phone ? (
                      <a href={`tel:${startup?.phone}`} className='text-blue-600'>
                        +{formatPhoneEA(startup?.phone)}
                      </a>
                    ) : (
                      <span className="text-gray-500">Phone not provided</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    {startup?.website ? (
                      <a
                        href={`https://${startup.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {startup.website}
                      </a>
                    ) : (
                      <span className="text-gray-500">www.example.com</span>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {startup?.intro_description}
                </p>

                <div className='flex gap-6'>
                  <p className='text-gray-600'>Followers <strong>{startup?.followers}</strong></p>
                  <Link
                    to='#opinions'
                    onClick={() => setShowComments(!showComments)}
                    className='text-gray-600 md:hover:text-blue-600 transition-colors flex items-center gap-1'
                  >
                    Opinions
                    <span><strong>{comments.filter(c => c.parent_id === null).length}</strong></span>
                    <BsChevronDown className='w-3 h-3' />
                  </Link>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-xs md:text-sm">
              {isOwner ? (
                <>
                  <Link
                    to={`/startup/${id}/edit`}
                    className='flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit startup</span>
                  </Link>

                  <button
                    onClick={() => setOpenDeleteModal(true)}
                    className="flex items-center justify-center gap-1 px-4 py-3 rounded-xl font-medium transition-all bg-red-600 text-white hover:bg-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete startup</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleFollow()}
                  disabled={!session}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${following
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    }`}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{following ? 'Following' : 'Follow'}</span>
                </button>
              )}

              <a
                href={`tel:${startup?.phone}`}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Phone className="w-5 h-5" />
                <span>Contact</span>
              </a>

              {!isOwner && (
                <button
                  onClick={handleFavorites}
                  disabled={!session}
                  className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${favorites
                    ? 'bg-red-50 text-red-500 border-2 border-red-200'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <Star className={`w-5 h-5 ${favorites ? 'fill-red-500' : ''}`} />
                  <span>Favorite</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>

            {showComments ? (
              <div id='opinions'>
                <CommentBox
                  startupId={startup?.id ?? ''}
                  loading={loading}
                  comments={comments}
                  setComments={setComments}
                  showComments={showComments}
                  setShowComments={setShowComments}
                />
              </div>

            ) : (
              <>
                {/* View More Button */}
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="w-full mt-4 flex items-center justify-center space-x-2 py-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                >
                  <span>{showMore ? 'Close' : `View More About ${startup?.name}`}</span>
                  {showMore ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {/* Expandable Details Section */}
                {showMore && (
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Full Description</h3>
                      <p className="text-gray-700 leading-relaxed">
                        <a
                          href='#'
                          onClick={(e) => {
                            e.preventDefault();
                            setLineClamp(!lineClamp);
                          }}
                          className={`${lineClamp ? 'line-clamp-0' : 'line-clamp-5'}`}
                        >{startup?.description}</a>
                        {startup?.description ? (
                          <span className='text-gray-400 font-semibold'>
                            <button
                              onClick={() => setLineClamp(!lineClamp)}
                              className='hover:underline'
                            >
                              {lineClamp ? 'collapse' : 'more'}
                            </button>
                          </span>) : (
                          <span className="text-gray-500">-- No description provided --</span>
                        )}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Contact Information</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-600" />
                            {startup?.email
                              ? <span>{startup.email}</span>
                              : <span className="text-gray-500">Email not provided</span>
                            }
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            {startup?.phone
                              ? <a href={`tel:${startup.phone}`}>+{formatPhoneEA(startup.phone)}</a>
                              : <span className="text-gray-500">Phone not provided</span>
                            }
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-blue-600" />
                            {startup?.website ? (
                              <a href={`https://${startup.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {startup.website}
                              </a>
                            ) : (
                              <span className="text-gray-500">www.example.com</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-4 sm:pt-0 pl-0 sm:pl-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Business Details</h3>
                        <div className="space-y-2 text-sm text-gray-700">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{startup?.address}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Founded in {formatDate(startup?.founded_in, true)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                            <span>Founder: {startup?.founder_name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Social Media</h3>
                      <div className="flex space-x-3">
                        <a
                          title='twitter'
                          href={`https://x.com/${startup?.x_username}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className="w-10 h-10 bg-gray-100 text-black rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                        >
                          <BsTwitterX className="w-5 h-5" />
                        </a>
                        <a
                          title='facebook'
                          target='_blank'
                          rel='noopener noreferrer'
                          className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                        >
                          <FaFacebook className="w-6 h-6" />
                        </a>
                        <a
                          title='whatsApp'
                          href={`https://wa.me/${formatPhoneEA(startup?.phone)}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className="w-10 h-10 bg-green-100 text-green-500 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                        >
                          <FaWhatsapp className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          <Link
            to={startup?.id ? `/startup/${startup.id}/catalog` : '/'}
            onClick={() => {
              if (startup?.id) {
                setSelectedStartup(startup.id);
              }
            }}
            className="inline-flex pt-8 -mt-6 items-center justify-center w-md sm:w-lg rounded-b-2xl bg-linear-to-r from-blue-400 via-blue-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 sm:hover:translate-y-1 hover:bg-linear-to-r hover:from-blue-600 hover:via-blue-700 hover:to-blue-800"
          >
            View Catalogue
          </Link>
        </div>


        {/* Posts Feed Section */}
        <div className="mt-4 px-1">
          <div className="mb-2 px-2">
            <div className='flex justify-between mb-2 pb-2 border-b border-gray-400'>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Posts</h2>
              {isOwner && (
                <Link to={`/startup/${startup?.id}/add-post`} className='flex items-center px-2 gap-2 text-blue-600 md:text-gray-500 md:hover:text-blue-600 border-2 border-blue-600 md:border-gray-400 rounded-lg md:hover:border-blue-600 md:hover:shadow-' >
                  Add Post
                  <Plus />
                </Link>
              )}
            </div>
            <p className="text-gray-600">Latest updates from {startup?.name}</p>
          </div>

          {loadingPosts && (
            <div className="text-center py-8">Loading posts...</div>
          )}

          {!loadingPosts && posts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl shadow-md">
              <p className="text-gray-500">No posts yet.</p>
            </div>
          )}

          {!loadingPosts && posts.length > 0 && (
            <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
              {StartupOwnPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  deletePost={() => handleDeletePost(post.id)}
                />
              ))}
            </div>
          )}
        </div>

        <Modal
          isOpen={openDeleteModal}
          title="Delete startup permanently"
          subTitle="This operation is irreversible. Please proceed with caution."
          message="All startup data, posts, and associated content will be permanently deleted."
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          confirmText="Yes, delete forever"
          cancelText="Keep startup"
          onConfirm={handleDeleteStartup}
          onCancel={() => setOpenDeleteModal(false)}
          confirmClassName="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          cancelClassName="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
        />
      </main>
    </div>
  );
}
