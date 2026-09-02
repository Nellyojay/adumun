import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ChevronLeft, AlertTriangle, UserX, PauseCircle } from 'lucide-react';
import ScrollToTop from '../constants/scrollToTop';
import supabase from '../supabaseClient';
import { useUserData } from '../contexts/userDataContext';
import { usePopup } from '../contexts/EdgePopupContext';
import { useAuth } from '../contexts/authContext';

export function ManageAccount() {
  const navigate = useNavigate();

  const { currentUser } = useUserData();
  const { user } = useAuth();
  const { showPopup } = usePopup();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/')
    }
  }, [])

  async function deletAccount() {
    const { error } = await supabase.rpc("soft_delete_user", {
      p_user_id: currentUser?.id
    });

    if (error) {
      console.error(error)
      showPopup('Error deleting account', 'error');
      return;
    };

    showPopup('Account deleted', 'success')

    await supabase.auth.signOut();
  }

  const handleDeleteAccount = () => {
    // In a real app, this would call the API to delete the account
    deletAccount();
    setShowDeleteDialog(false);
    navigate('/login', { replace: true });
  };

  const handleDeactivateAccount = async () => {
    // In a real app, this would call the API to deactivate the account
    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', currentUser?.id)
      .eq('auth_id', user?.id)

    if (error) {
      showPopup('Error deactivateing account, please try again.', 'error')
      return;
    }

    showPopup("Account deactivated", "success")

    setShowDeactivateDialog(false);
    await supabase.auth.signOut();
    navigate('/login', { replace: true })
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            title='back'
            onClick={() => {
              navigate(-1)
            }}
            className="p-2 md:hover:bg-gray-200 active:bg-gray-200 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Manage Account</h1>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium mb-1">
              Important Account Actions
            </p>
            <p className="text-sm text-amber-700">
              These actions are permanent or require special steps to reverse. Please review carefully before proceeding.
            </p>
          </div>
        </div>

        {/* Deactivate Account */}
        <div className="bg-white rounded-2xl shadow-md mb-4">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <PauseCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deactivate Account
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Temporarily disable your account. Your profile, businesses and mentorship pages will be hidden until you reactivate. You can reactivate anytime by logging back in.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Your profile will be hidden from other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Your business or mentorship pages will not appear in the feed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>You can reactivate by logging back in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Your data will be preserved</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowDeactivateDialog(true)}
                  className="w-full py-2 bg-orange-500 text-white rounded-full hover:bg-orange-700 transition-colors font-medium"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Account */}
        <div className="bg-white rounded-2xl shadow-md">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Account Permanently
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>All your business or mentorship pages will be permanently deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>Your profile information will be removed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>All likes, comments, and interactions will be deleted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">•</span>
                    <span>This action cannot be reversed</span>
                  </li>
                </ul>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-full py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="my-10 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need help with something else?
          </p>
          <Link to="/feedback" className="text-sm primary-color primary-color-hover font-medium">
            Contact Support
          </Link>
        </div>
      </main>

      {/* Deactivate Confirmation Dialog */}
      {showDeactivateDialog && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mx-auto mb-4">
              <PauseCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Deactivate Account?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your account will be hidden until you log back in. You can reactivate it anytime.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeactivateAccount}
                className="w-full px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors font-medium"
              >
                Yes, Deactivate
              </button>
              <button
                onClick={() => setShowDeactivateDialog(false)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <UserX className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
              Delete Account Permanently?
            </h3>
            <p className="text-gray-600 text-center mb-6">
              This will permanently delete your account and all data. This action cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDeleteAccount}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-medium"
              >
                Yes, Delete Forever
              </button>
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
