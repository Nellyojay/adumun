import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import supabase from '../supabaseClient';
import { useAuth } from '../contexts/authContext';
import { useStartup } from '../contexts/StartupProfileContext';
import { useUserData } from '../contexts/userDataContext';
import { Upload, X } from 'lucide-react';
import { FOLDER, imageHandlerService } from '../constants/imageHandler';
import SuccessMessage from '../components/SuccessMessage';

type FormData = {
  name: string;
  founder_name: string;
  cartegory: string;
  display_image: File | null;
  cover_image: File | null;
  intro_description: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  founded_in: string;
  website: string;
  x_username: string;
  products_and_services: string; // comma-separated input for UI
}

export function EditStartup() {
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const { currentUser, selectedProfile } = useUserData();
  const { startupData } = useStartup();
  const { id } = useParams<{ id: string }>();

  const profileId = selectedProfile || currentUser?.id || user?.id;
  const startup = startupData?.find((s) => s.id === id && s.user_id === profileId) || null;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    founder_name: '',
    cartegory: '',
    display_image: null,
    cover_image: null,
    intro_description: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    founded_in: '',
    website: '',
    x_username: '',
    products_and_services: '' // comma-separated input for UI
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dismissSelectedDisplayImage = () => setFormData({ ...formData, display_image: null });
  const dismissSelectedCoverImage = () => setFormData({ ...formData, cover_image: null });

  useEffect(() => {
    if (startup) {
      setFormData({
        name: startup.name || '',
        founder_name: startup.founder_name || '',
        cartegory: startup.cartegory || '',
        display_image: null,
        cover_image: null,
        intro_description: startup.intro_description || '',
        description: startup.description || '',
        phone: startup.phone || '',
        email: startup.email || '',
        address: startup.address || '',
        founded_in: startup.founded_in || '',
        website: startup.website || '',
        x_username: startup.x_username || '',
        products_and_services: Array.isArray(startup.products_and_services)
          ? startup.products_and_services.join(', ')
          : ''
      });
    }
  }, [startup]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!startup || !session) {
      alert('Unable to update business: no bsuiness selected or not authenticated');
      return;
    }

    setLoading(true);

    const productsAndServices = formData.products_and_services
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from('startups')
      .update({
        name: formData.name,
        founder_name: formData.founder_name,
        cartegory: formData.cartegory,
        intro_description: formData.intro_description,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        founded_in: formData.founded_in,
        website: formData.website,
        x_username: formData.x_username,
        products_and_services: productsAndServices
      })
      .eq('id', startup.id);

    if (error) {
      alert('Error updating business. Please try again.');
    }

    if (formData.display_image) {
      const updatedDisplayImage = await imageHandlerService.cloudinaryImageUploader(
        formData.display_image,
        FOLDER.STARTUP_PROFILE,
        currentUser?.id || '',
        startup.id,
        undefined
      );

      if (!updatedDisplayImage) {
        alert('Business data updated but failed to upload display image');
        setLoading(false);
        return;
      }

    }

    if (formData.cover_image) {
      const updatedCoverImage = await imageHandlerService.cloudinaryImageUploader(
        formData.cover_image,
        FOLDER.STARTUP_BANNER,
        currentUser?.id || '',
        startup.id,
        undefined
      );

      if (!updatedCoverImage) {
        alert('Business data updated but failed to upload cover image');
        setLoading(false);
        return;
      }

    }

    setLoading(false);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      navigate(`/startup/${startup.id}`);
    }, 4000);

  };

  if (!startup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 text-center">
          <h1 className="text-2xl text-gray-900">No Business selected</h1>
          <p className="text-gray-600">Please select a business first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto pt-24 pb-12">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Edit Business profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Business Name</span>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Founder Name</span>
                <input
                  value={formData.founder_name}
                  onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Category</span>
              <input
                value={formData.cartegory}
                placeholder='e.g. Technology, Finance, agriculture'
                onChange={(e) => setFormData({ ...formData, cartegory: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>

            <div className='block md:flex gap-12 justify-center'>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Banner

                {formData.cover_image ? (
                  <div className="w-full flex items-start gap-1">
                    <img
                      src={formData.cover_image as File ? URL.createObjectURL(formData.cover_image as File) : '/default-startup-banner.jpg'}
                      alt="Cover"
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <button
                      onClick={dismissSelectedCoverImage}
                      className='justify-end primary-soft-bg rounded-full border-none cursor-pointer'
                    >
                      <X className=" text-red-500 font-bold text-3xl hover:text-red-300" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center primary-border-hover transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </label>
                  </div>

                )}
              </label>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Display image
                {formData.display_image ? (
                  <div className="w-full flex items-start gap-1">
                    <img
                      src={formData.display_image ? URL.createObjectURL(formData.display_image) : '/default-startup-display.jpg'}
                      alt="Cover"
                      className="w-full h-full rounded-lg object-cover"
                    />
                    <button
                      className='justify-end primary-soft-bg rounded-full border-none cursor-pointer'
                      onClick={dismissSelectedDisplayImage}
                    >
                      <X className=" text-red-500 font-bold text-3xl hover:text-red-300" />
                    </button>
                  </div>
                ) : (

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center primary-border-hover transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, display_image: e.target.files?.[0] || null })}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload images</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                )}
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Intro Description</span>
              <textarea
                value={formData.intro_description}
                onChange={(e) => setFormData({ ...formData, intro_description: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Description</span>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows={4}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Products & Services (comma-separated)</span>
              <textarea
                value={formData.products_and_services}
                onChange={(e) => setFormData({ ...formData, products_and_services: e.target.value })}
                placeholder="e.g. Product 1, Product 2, Service 1"
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                rows={2}
              />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Business Phone Line</span>
                <input
                  value={formData.phone}
                  placeholder="e.g. 07123456789"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Business Email</span>
                <input
                  type="email"
                  value={formData.email}
                  placeholder="e.g. business@example.com"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Founded In</span>
              <input
                value={formData.founded_in}
                onChange={(e) => setFormData({ ...formData, founded_in: e.target.value })}
                placeholder='e.g. 2020'
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Address</span>
              <input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder='e.g. 123 Main St, City, State'
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Website</span>
                <input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder='e.g. www.example.com'
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">X Username</span>
                <input
                  value={formData.x_username}
                  onChange={(e) => setFormData({ ...formData, x_username: e.target.value })}
                  placeholder='e.g. x_example'
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>

            {submitted ? (
              <SuccessMessage
                header='Submitted successfully'
                message={null}
                error={false}
              />
            ) : (
              <div className="flex items-center gap-3 not-md:text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!session || !formData.name || !formData.founder_name || loading}
                  className="flex-1 px-4 py-3 primary-bg text-white rounded-xl primary-bg-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Update Profile'}
                </button>
              </div>
            )}

          </form>
        </div>
      </main >
    </div >
  );
}
