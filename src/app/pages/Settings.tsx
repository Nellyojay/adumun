import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import {
  User,
  Bell,
  Lock,
  Globe,
  Eye,
  Heart,
  HelpCircle,
  LogOut,
  ChevronRight,
  Key
} from 'lucide-react';
import { useWebData } from '../contexts/webData';
import { useUserData } from '../contexts/userDataContext';
import { useAuth } from '../contexts/authContext';
import { Modal } from '../components/Modal';
import ScrollToTop from '../constants/scrollToTop';
import { getImageUrl } from '../constants/imageHandler';

export function Settings() {
  const navigate = useNavigate();

  const { webName } = useWebData();
  const { currentUser } = useUserData();
  const { user, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [openLogOutModal, setOpenLogOutModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      <ScrollToTop />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full primary-gradient flex items-center justify-center shadow-lg">
                {currentUser?.profile_image ? (
                  <img
                    src={getImageUrl(currentUser?.profile_image) || undefined}
                    alt="Profile Picture"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-white">{currentUser?.full_name[0]}</span>
                )}

              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{currentUser?.full_name}</h2>
              {currentUser?.is_active && (
                <p className="text-sm text-gray-600">{user?.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-md mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Account</h3>
          </div>

          <Link title='edit-profile' to={`/profile/${currentUser?.id}/edit`} className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Edit Profile</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link to="/change-password" title="change-password" className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Change Password</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link to={'/manage-account'} title='' className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Manage Account</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-2xl shadow-md mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Privacy</h3>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Private Account</span>
            </div>
            <button
              title='private-account'
              onClick={() => setPrivateAccount(!privateAccount)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${privateAccount ? 'primary-bg' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${privateAccount ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <Link to={''} title='' className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Blocked Accounts</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-md mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Push Notifications</span>
            </div>
            <button
              title='push-notifications'
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notificationsEnabled ? 'primary-bg' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
            </button>
          </div>

          <Link to={''} title='' className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Likes & Comments</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Support */}
        <div className="bg-white rounded-2xl shadow-md mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900">Support</h3>
          </div>

          <Link to="/help-center" title="help-center" className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Help Center</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            to="/feedback"
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">Send Feedback</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Logout */}
        <div className="bg-white rounded-2xl shadow-md">
          <button
            onClick={() => {
              setOpenLogOutModal(true);
            }}
            title='log-out'
            className="w-full flex items-center justify-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Log Out</span>
          </button>
        </div>

        {/* App Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>{webName} v1.0.0</p>
          <p className="mt-1">© 2026 {webName}. All rights reserved.</p>
        </div>
      </main>

      <Modal
        isOpen={openLogOutModal}
        title="Log Out"
        message="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        onConfirm={() => {
          logout();
          navigate('/login', { replace: true });
        }}
        onCancel={() => setOpenLogOutModal(false)}
        confirmClassName="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        cancelClassName="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
      />
    </div>
  );
}
