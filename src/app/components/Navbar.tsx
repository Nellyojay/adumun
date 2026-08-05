import { Link, useNavigate, useLocation } from 'react-router';
import { Search, Home, Compass, MessageCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useWebData } from '../contexts/webData';
import { useAuth } from '../contexts/authContext';
import { BUSINESS_PERSONNEL_ROLE, MENTOR_ROLE, useUserData } from '../contexts/userDataContext';
import Loader from '../constants/loader';
import { getImageUrl } from '../constants/imageHandler';
import { ActionsPopup } from './Popup';

interface NavbarProps {
  showSearch?: boolean;
  showAuth?: boolean;
  onSearch?: (query: string) => void;
}

export function Navbar({ showSearch = false, onSearch }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { webName } = useWebData();
  const { session } = useAuth();
  const { setSelectedProfile, currentUser, agreeToTC } = useUserData();
  const [openPopup, setOpenPopup] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [hideLogoName, setHideLogoName] = useState(false);
  const [searchBarNavigateToFeed, setSearchBarNavigateToFeed] = useState(false);

  const actionsRef = useRef<HTMLDivElement | null>(null);

  if (!currentUser) {
    <Loader />
  }

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setOpenPopup(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const check = () => {
    if (currentUser?.TC_agreed === false && !currentUser.user_roles) {
      navigate("/TC_agree")
    };

    if (session && currentUser?.is_active === false) {
      navigate('/recover-account')
    };
  };

  useEffect(() => {
    check();
  }, [agreeToTC, currentUser?.id]);

  useEffect(() => {
    if (searchBarNavigateToFeed && location.pathname !== '/feed') {
      navigate('/feed');
    }
  }, [searchBarNavigateToFeed, location.pathname, navigate])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    };
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to={session ? "/" : "/about"} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">{webName.charAt(0).toLocaleUpperCase()}</span>
            </div>
            {!hideLogoName && (
              <span className="text-xl font-semibold text-gray-900">{webName ? webName : 'Loading...'}</span>
            )}
          </Link>

          {/* Search Bar - shown on feed page */}
          {showSearch && (
            <div className="flex-1 max-w-xl mx-8 block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  onFocus={() => {
                    setHideLogoName(true);
                    setSearchBarNavigateToFeed(true);
                  }}
                  onBlur={() => {
                    setHideLogoName(false);
                  }}
                  autoFocus={location.pathname === '/feed'}
                  value={searchValue}
                  onChange={handleSearchChange}
                  placeholder="Search for businesses..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div ref={actionsRef} className="hidden md:flex items-center space-x-6 transition-all">
            {!session ? (
              <>
                <Link to="/" className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname === '/' ? 'text-gray-800 border-b border-gray-800' : ''}`}>
                  Posts
                </Link>
                <Link to="/feed" className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname === '/feed' ? 'text-gray-800 border-b border-gray-800' : ''}`}>
                  Explore
                </Link>
                <Link to="/login" className="text-gray-500 hover:text-gray-800 transition-colors">
                  Sign In
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname === '/' ? 'text-gray-800 border-b border-gray-800' : ''}`}>
                  Posts
                </Link>
                <Link to="/feed" className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname === '/feed' ? 'text-gray-800 border-b border-gray-800' : ''}`}>
                  Explore
                </Link>
                <Link to="/feedback" className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname === '/feedback' ? 'text-gray-800 border-b border-gray-800' : ''} hidden sm:block`}>
                  Feedback
                </Link>
                {(currentUser?.user_roles.includes(BUSINESS_PERSONNEL_ROLE) || currentUser?.user_roles.includes(MENTOR_ROLE)) && (
                  <button
                    onClick={() => { setOpenPopup(!openPopup) }}
                    className={`text-gray-500 hover:text-gray-800 transition-colors relative ${location.pathname === '/create' ? 'text-gray-800 border-b border-gray-800' : ''}`}
                  >
                    Create Page
                    {openPopup && (
                      <ActionsPopup
                        {...currentUser}
                      />
                    )}
                  </button>
                )}
                <Link to={`/profile/${currentUser?.id}`} className={`text-gray-500 hover:text-gray-800 transition-colors ${location.pathname.startsWith('/profile') ? 'text-gray-800' : ''}`} onClick={() => setSelectedProfile(currentUser?.id)}>
                  <img
                    src={getImageUrl(currentUser?.profile_image) || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
                    alt={currentUser?.full_name}
                    className='w-8 h-8 rounded-full'
                  />
                </Link>
              </>
            )}
          </div>
          <div className='md:hidden'></div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white border-t border-gray-200">
        <div className="flex justify-between items-center h-12 px-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 ${location.pathname === '/' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs">Posts</span>
          </Link>
          <Link
            to="/feed"
            className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 ${location.pathname === '/feed' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-xs">Explore</span>
          </Link>
          {session && (
            <Link
              to="/feedback"
              className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 ${location.pathname === '/feedback' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Feedback</span>
            </Link>
          )}
          {session ? (
            <Link
              to={`/profile/${currentUser?.id}`}
              onClick={() => setSelectedProfile(currentUser?.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 ${location.pathname.startsWith('/profile') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <img
                src={getImageUrl(currentUser?.profile_image) || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
                alt={currentUser?.full_name}
                className='w-6 h-6 rounded-full'
              />
              <span className="text-xs">Profile</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 ${location.pathname === '/login' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <img
                src={getImageUrl(currentUser?.profile_image) || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
                alt={currentUser?.full_name}
                className='w-6 h-6 rounded-full'
              />
              <span className="text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}