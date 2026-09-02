import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/authContext';
import supabase from '../supabaseClient';
import { Upload } from 'lucide-react';
import { FOLDER, imageHandlerService } from '../constants/imageHandler';
import SuccessMessage from '../components/SuccessMessage';
import { useUserData } from '../contexts/userDataContext';

export function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedProfile, setSelectedProfile, currentUser } = useUserData();

  const profileId = selectedProfile || currentUser?.id || user?.id || null;

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [userName, setUserName] = useState(currentUser?.user_name || '');
  const disbaleUsernameChange = Boolean(
    currentUser?.user_name_updated_at &&
    new Date(currentUser.user_name_updated_at).getTime() + 90 * 24 * 60 * 60 * 1000 > Date.now()
  );
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [roles, setRoles] = useState<string[]>(currentUser?.user_roles || []);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.full_name || '');
      setUserName(currentUser.user_name || '');
      setBio(currentUser.bio || '');
    }
  }, [currentUser]);

  const dismissSelectedProfileImage = () => setProfileImage(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) {
      setError('Unable to locate profile to edit.');
      return;
    }

    setLoading(true);
    setError(null);

    const existingUserName = currentUser?.user_name?.trim() || '';
    const newUserName = userName?.trim() || '';

    const usernameChanged = Boolean(
      newUserName &&
      newUserName !== existingUserName
    );

    const isOlderThan90Days = (timestamp?: string | null) => {
      if (!timestamp) return false;
      const changedAt = new Date(timestamp).getTime();
      return Date.now() - changedAt >= 90 * 24 * 60 * 60 * 1000;
    };

    // Username uniqueness check
    if (newUserName && usernameChanged) {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('user_name', newUserName)
        .maybeSingle();

      if (checkError) {
        setLoading(false);
        setError(checkError.message || 'Could not verify username uniqueness.');
        return;
      }

      if (existingUser && existingUser.id !== profileId) {
        setLoading(false);
        setError('Username is already taken. Please choose another one.');
        return;
      }
    }

    const updatePayload: Record<string, unknown> = {
      full_name: fullName,
      bio,
      user_roles: roles,
    };

    if (usernameChanged) {

      if (isOlderThan90Days(currentUser?.user_name_updated_at) && currentUser?.user_name) {
        const { error: archiveError } = await supabase
          .from('old_user_names')
          .insert({
            user_id: currentUser.id,
            old_user_name: currentUser.user_name,
          });

        if (archiveError) {
          setLoading(false);
          setError(archiveError.message || 'Could not archive the old username.');
          return;
        }
      }

      updatePayload.user_name = userName;
      updatePayload.user_name_updated_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updatePayload)
      .eq('id', profileId);

    if (updateError) {
      setError(updateError.message || 'Could not update profile.');
      setLoading(false);
      return;
    }

    if (profileImage) {
      const insertProfileImage = await imageHandlerService.cloudinaryImageUploader(
        profileImage,
        FOLDER.USER_PROFILE,
        profileId
      );

      if (!insertProfileImage) {
        setError('Profile updated but failed to upload image. Please try again.');
        setLoading(false);
        return;
      }
    }

    setSelectedProfile(profileId);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (profileId) {
        navigate(`/profile/${profileId}`);
      } else {
        navigate('/');
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-3xl mx-auto p-4 pt-24 pb-20">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {profileImage ? (
              <div className="w-28 md:w-48 h-28 md:h-48 mx-auto">
                <button
                  type="button"
                  onClick={dismissSelectedProfileImage}
                  className="absolute left-32 right-0 md:left-48 text-red-500 font-bold text-3xl rounded-full hover:text-red-300"
                >
                  ×
                </button>

                <img
                  src={URL.createObjectURL(profileImage)}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center primary-border-hover transition-colors">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => setProfileImage(e.target.files?.[0] as File | undefined || null)}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload images</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </label>
              </div>
            )}

            <div>
              <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="full-name"
                value={fullName}
                placeholder='e.g. John Doe'
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm primary-focus primary-focus"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                value={userName}
                placeholder='e.g. johnDoe123'
                onChange={(e) => setUserName(e.target.value)}
                disabled={disbaleUsernameChange}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm primary-focus primary-focus"
              />
              <p className="text-xs text-gray-500">
                {disbaleUsernameChange && 'Username can only be changed once every 90 days.'}
              </p>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full p-2 rounded-lg border-gray-300 shadow-sm primary-focus primary-focus"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="selected-roles" className="block text-sm font-medium text-gray-700 mb-2">
                Designated roles
              </label>
              <div className="flex items-center justify-center gap-2">
                <input
                  title="designated-roles"
                  type="text"
                  placeholder="Selected roles are shown here"
                  value={roles.join(', ')}
                  disabled
                  onChange={(e) => setRoles(e.target.value.split(', '))}
                  className="w-full not-md:text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                />
                <button
                  onClick={() => {
                    if (roles.length > 0) {
                      setRoles([]);
                    }
                  }}
                  className="text-white text-sm w-10 h-10 font-semibold border border-gray-300 bg-gray-400 shadow-sm rounded-lg"
                >
                  X
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Select roles *
              </label>
              <select
                id="category"
                value={roles.join(', ')}
                onChange={(e) => {
                  roles.push(e.target.value);
                  setRoles([...roles]);
                }}
                className="w-full not-md:text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
              >
                <option value="">--Select--</option>
                <option value="business personnel">Business personnel</option>
                <option value="customer">Customer</option>
                <option value="investor">Investor</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {submitted ? (
              <SuccessMessage
                header='Profile Updated Successfully'
                message={null}
                error={!submitted}
              />
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 primary-bg text-white rounded-lg primary-bg-hover primary-bg-disabled"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-5 py-2 border rounded-lg border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
