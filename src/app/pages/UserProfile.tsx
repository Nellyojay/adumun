import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { StartupCard } from '../components/StartupCard';
import { formatDate } from '../constants/dateFormat';
import { useAuth } from '../contexts/authContext';
import { useStartup } from '../contexts/StartupProfileContext';
import { ADMIN_ROLE, BUSINESS_PERSONNEL_ROLE, CUSTOMER_ROLE, INVESTOR_ROLE, MENTOR_ROLE, useUserData } from '../contexts/userDataContext';
import { Calendar, Briefcase, Bookmark, Star, ChevronUp, ChevronDown } from 'lucide-react';
import { getImageUrl } from '../constants/imageHandler';
import ScrollToTop from '../constants/scrollToTop';
import Loader from '../constants/loader';
import supabase from '../supabaseClient';
import { PostCard } from '../components/PostCard';
import { ActionsPopup } from '../components/Popup';
import MentorshipPageCard from '../components/MentorshipPageCard';
import { useMentorshipData } from '../contexts/mentorshipContext';

type Favorites = {
  startup_id: string
}

type SavedPosts = {
  post_id: string | number;
}

const noteMessage = [
  {
    role: INVESTOR_ROLE,
    message: 'As an Investor, you can follow businesses and engage with their posts, but you cannot create your own business page.'
  },
  {
    role: CUSTOMER_ROLE,
    message: 'As a Customer, you can follow business pages and mentorship pages and engage with their posts.'
  },
  {
    role: BUSINESS_PERSONNEL_ROLE,
    message: 'As a Business Personnel, you can create and manage your own business page and all the benefits of being customer.'
  },
  {
    role: MENTOR_ROLE,
    message: 'As a Mentor, you can create and manage your own mentorship page and all the benefits of the being a customer.'
  },
  {
    role: ADMIN_ROLE,
    message: 'As an Admin, you have full access to all features, including creating and managing business pages.'
  }
]

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { startupData, posts, fetchStartupPosts, handleDeletePost } = useStartup();
  const { userData, setSelectedProfile, selectedProfile } = useUserData();
  const { user } = useAuth();
  const { mentorshipData } = useMentorshipData();

  const [tab, setTab] = useState<number | null>(null);
  const [favoritesId, setFavoritesId] = useState<Favorites[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPosts[]>([])
  const [moreOpen, setMoreOpen] = useState(false);
  const [openActionsPopup, setOpenActiionsPopup] = useState(false);

  const actionsRef = useRef<HTMLDivElement | null>(null);

  const profileId = id || selectedProfile || userData?.id || user?.id || null;
  const isOwner = Boolean(
    profileId &&
    userData?.id === profileId &&
    userData?.auth_id === user?.id
  );

  useEffect(() => {
    setTab(userData?.user_roles.includes(BUSINESS_PERSONNEL_ROLE) ? 0 : 1)
  }, [userData])

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setOpenActiionsPopup(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const fetchFavoriteBusinesses = async () => {
    if (!userData?.id) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('startup_id')
      .eq('user_id', userData?.id);

    if (error) {
      return;
    } else {
      setFavoritesId(data || [])
    }
  };

  const fetchSavedPosts = async () => {
    if (!userData?.id) return;

    const { data, error } = await supabase
      .from('saves')
      .select('post_id')
      .eq('user_id', userData?.id);

    if (error) {
      return;
    } else {
      setSavedPosts(data || [])
    }
  };

  useEffect(() => {
    if (profileId) {
      fetchStartupPosts();
      fetchSavedPosts();
      fetchFavoriteBusinesses();
      setSelectedProfile(profileId);
    }
  }, [profileId, setSelectedProfile]);

  const favIds = favoritesId.map(f => f.startup_id);
  const favStartups = startupData?.filter(s => favIds.includes(s.id));

  const savedPostIds = savedPosts.map(s => s.post_id);
  const savPosts = posts?.filter(p => savedPostIds.includes(p.id));

  const userStartups = startupData?.filter(s => s.user_id === profileId) || [];

  if (!userData || !profileId || !startupData) {
    return <Loader />;
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Navbar />
      <ScrollToTop />

      <main className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 pt-20 pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-md pb-4 mb-8">
          {(!userData.is_active && !userData.deleted_at) && (
            <p className='text-red-600 text-center font-semibold border-2 border-red-600 bg-red-50 p-2 rounded-lg'>This User nolonger exists</p>
          )}

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            {/* Profile Picture */}
            {userData?.profile_image ? (
              <img
                src={getImageUrl(userData.profile_image) || undefined}
                alt="Profile Picture"
                className="max-w-50 max-h-50 rounded-lg object-contain bg-gray-200 shadow-xl"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center shadow-lg">
                <span className="text-5xl font-bold text-white">{userData?.full_name.charAt(0) || 'U'}</span>
              </div>
            )}

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{userData?.full_name}</h1>
              <p className="text-sm text-gray-400 mb-4">@{userData?.user_name || 'Username'}</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {userData.user_roles && userData.user_roles.length > 0 ? (
                  userData.user_roles.map((role, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {role}
                    </span>
                  ))
                ) : null}
              </div>

              <p className="text-gray-700">
                {userData?.bio || 'This user has not added a bio yet.'}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-gray-500 text-xs mt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined MyLaunch {formatDate(userData?.created_at, false)}</span>
                </div>
                {userData.user_roles.includes(BUSINESS_PERSONNEL_ROLE) && (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{userStartups?.length} Business{userStartups?.length === 1 ? '' : 'es'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center md:block text-gray-500 mt-2">
                <Link to={'/following'} className="text-blue-600 hover:text-blue-400">
                  Businesses Following <span className='font-semibold text-gray-600'>{userData.following}</span>
                </Link>
              </div>
            </div>

            {isOwner ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/settings"
                  className="flex justify-center items-center px-6 py-2 bg-linear-to-r from-gray-500 to-gray-700 text-white rounded-full hover:from-gray-600 hover:to-gray-800 transition-all font-medium shadow-md hover:shadow-lg">
                  Settings
                </Link>
              </div>
            ) : null}
          </div>

          {isOwner && (
            <div className='flex justify-center items-center gap-1'>
              <button
                title={moreOpen ? 'Hide role information' : 'View more about user roles'}
                onClick={() => setMoreOpen(!moreOpen)}
                className='text-xs md:text-sm text-blue-600 md:hover:text-blue-400 transition-colors flex items-center'
              >
                View more about your roles
              </button>
              {moreOpen ? (
                <ChevronUp className='w-4 h-4 text-blue-600' />
              ) : (
                <ChevronDown className='w-4 h-4 text-blue-600' />
              )}
            </div>
          )}

          {moreOpen && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mx-6 mt-2 rounded-lg text-xs md:text-sm">
              {noteMessage.map(n => {
                if (userData.user_roles.includes(n.role)) {
                  return (
                    <>
                      <p key={n.role}>- {n.message}</p>
                    </>
                  )
                }
              })}
              <p className="font-bold mt-1">To change your role, edit your profile to the role of your choice.</p>
            </div>
          )}
        </div>

        {/* Startups Section */}
        <div>
          <div className="sticky top-18 h-fit z-50 flex items-center justify-between mb-6">
            <div className='flex text-gray-500 space-x-4 bg-gray-50 rounded-lg py-1 px-4 mr-1 justify-around not-md:w-full shadow-gray-200 shadow-sm'>
              {userData.user_roles.includes(BUSINESS_PERSONNEL_ROLE) && (
                <button
                  onClick={() => setTab(0)}
                  className={`font-bold cursor-pointer md:hover:text-gray-800 transition-all duration-200 ${tab === 0 && 'text-gray-800 border-b-2'}`}
                >Businesses</button>
              )}

              {userData.user_roles.includes(MENTOR_ROLE) && (
                <button
                  onClick={() => setTab(1)}
                  className={`font-bold cursor-pointer md:hover:text-gray-800 transition-all duration-200 ${tab === 1 && 'text-gray-800 border-b-2'}`}
                >Pages</button>
              )}

              <div className='flex items-center justify-center gap-1 md:hover:text-gray-800'>
                <button
                  title='favorite businesses'
                  onClick={() => setTab(2)}
                  className={`font-semibold cursor-pointer transition-all duration-200 ${tab === 2 && 'text-gray-800 border-b-2'}`}
                >
                  <Star className={`fill-gray-500 md:hover:fill-gray-700 ${tab === 2 && 'fill-gray-800'}`} size={18} color='' />
                </button>
              </div>

              <div className='flex items-center gap-1 md:hover:text-gray-800'>
                <button
                  title='saved posts'
                  onClick={() => setTab(3)}
                  className={`font-semibold cursor-pointer transition-all duration-200 ${tab === 3 && 'text-gray-800 border-b-2'}`}
                >
                  <Bookmark className={`fill-gray-500 md:hover:fill-gray-700 ${tab === 3 && 'fill-gray-800'}`} size={18} color='' />
                </button>
              </div>
            </div>

            <div ref={actionsRef} className='relative'>
              {isOwner && (
                <button
                  onClick={() => setOpenActiionsPopup(prev => !prev)}
                  className="flex justify-center items-center text-blue-600 hover:text-blue-400 border-2 border-blue-600 hover:border-blue-400 bg-blue-50 rounded-lg py-1 px-4 font-medium"
                >
                  +
                  <span className='hidden md:block'>Create page</span>
                </button>
              )}

              {openActionsPopup && <ActionsPopup {...userData} />}
            </div>
          </div>

          {tab === 0 && userData.user_roles.includes(BUSINESS_PERSONNEL_ROLE) && (
            (userStartups ?? []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userStartups?.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} userId={startup.user_id} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">No Business page created yet.</p>
                {isOwner && (
                  <Link
                    to="/create"
                    className="inline-block not-md:text-sm bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Your First Business Page
                  </Link>
                )}
              </div>
            )
          )}
          {tab === 1 && userData.user_roles.includes(MENTOR_ROLE) && (
            (mentorshipData ?? []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {mentorshipData?.map((page) => (
                  <Link key={page.id} to={`/mentorship-page/${page.id}`}>
                    <MentorshipPageCard {...page} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">No Business page created yet.</p>
                {isOwner && (
                  <Link
                    to="/mentorship/create"
                    className="inline-block not-md:text-sm bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Your First Mentorship Page
                  </Link>
                )}
              </div>
            )
          )}
          {tab === 2 && (
            (favStartups ?? []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favStartups?.map((startup) => (
                  <StartupCard key={startup.id} startup={startup} userId={startup.user_id} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">{userData?.full_name?.split(' ')[1] || 'User'} has no favorite businesses.</p>
              </div>
            )
          )}
          {tab === 3 && (
            (savPosts ?? []).length > 0 ? (
              <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    deletePost={() => handleDeletePost(post.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500 mb-4">{userData?.full_name?.split(' ')[1] || 'User'} has not saved any posts.</p>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}