import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useUserData } from '../contexts/userDataContext';
import supabase from '../supabaseClient';
import { FOLDER, imageHandlerService } from '../constants/imageHandler';
import SuccessMessage from '../components/SuccessMessage';
import { BiArrowBack } from 'react-icons/bi';
import { usePopup } from '../contexts/EdgePopupContext';

export function AddPost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useUserData();
  const { showPopup } = usePopup();

  const [heading, setHeading] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMentorshipId = location.pathname.includes('/mentorship-page') ? id : null
  const uploadStartupId = location.pathname.includes('/startup') ? id : null

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError('Id not found for current profile.');
      return;
    }
    if (!content.trim()) {
      setError('Please provide text content for the post.');
      return;
    }

    setError(null);
    setSaving(true);

    const { error } = await supabase.rpc("check_rate_limit", {
      p_user_id: currentUser?.id,
      p_action: "post",
      p_limit: 5,
      p_window: "1 hour"
    });

    if (error) {
      showPopup(`${error.message} Try again in a minute.`, 'error')
      return;
    }

    const { data, error: insertError } = await supabase
      .from('posts')
      .insert([
        {
          startup_id: uploadStartupId ?? null,
          mentorship_id: uploadMentorshipId ?? null,
          user_id: currentUser?.id || null,
          content: content.trim(),
          mentorship_post_heading: heading ?? null,
        },
      ])
      .select('id, image_url')
      .single();

    if (insertError) {
      setError(insertError.message || 'Could not save post');
      setSaving(false);
      return;
    }

    if (imageFile) {
      const insertImage = await imageHandlerService.cloudinaryImageUploader(
        imageFile,
        FOLDER.POST,
        currentUser?.id || '',
        id,
        data.id,
        id
      )

      if (!insertImage) {
        setError('Post saved but image upload failed');
        setSaving(false)
        return;
      }
    }

    setSaving(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      navigate(`${uploadStartupId ? `/startup/${id}` : `/mentorship-page/${id}`}`);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      <main className="max-w-3xl mx-auto pt-20 pb-20 px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-lg md:text-xl font-bold">Add Post</h1>
          <button
            onClick={() => navigate(-1)}
            className="primary-color primary-color-hover flex gap-2 items-center"
          >
            <BiArrowBack />
            Back to page
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md">
          {!id ? (
            <p className="text-red-600">No startup selected. Go back to the profile and choose a startup first.</p>
          ) : (
            <form onSubmit={handlePostSubmit} className="space-y-4">

              {uploadMentorshipId && (
                <div>
                  <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Post Sub-header</label>
                  <input
                    id="post-header"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="mt-1 w-full border rounded-lg p-3 border-gray-300 primary-focus primary-focus"
                    placeholder="Write your sub-heading here..."
                  />
                </div>
              )}

              <div>
                <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="post-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full border rounded-lg p-3 border-gray-300 min-h-45 primary-focus primary-focus"
                  placeholder="Write your update here..."
                />
              </div>

              <div>
                <label htmlFor="post-image" className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-1 rounded-lg border-2 border-dashed primary-border p-4 text-center transition-colors primary-border-hover primary-soft-bg">
                  <p className="text-xs primary-color mb-2">Upload a post image (PNG, JPG). Max 10MB.</p>
                  <input
                    id="post-image"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="post-image"
                    className="inline-flex items-center rounded-md border primary-border bg-white px-3 py-2 text-sm font-medium primary-soft-color primary-bg-hover cursor-pointer"
                  >
                    Select Image
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview as string}
                      alt="Preview"
                      className="w-full max-h-64 object-cover"
                    />
                    <p className="p-2 text-xs text-gray-500">Image preview</p>
                  </div>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              {!submitted ? (
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full inline-flex justify-center items-center gap-2 px-4 py-3 primary-bg text-white rounded-lg font-semibold primary-bg-hover primary-bg-disabled"
                >
                  {saving ? 'Saving...' : 'Publish Post'}
                </button>
              ) : (
                <SuccessMessage
                  header="Post Published!"
                  message="Your post has been published successfully."
                  error={false}
                />
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
