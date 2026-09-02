import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useWebData } from '../contexts/webData';
import supabase from '../supabaseClient';
import { useUserData } from '../contexts/userDataContext';
import { useAuth } from '../contexts/authContext';
import SuccessMessage from '../components/SuccessMessage';
import ScrollToTop from '../constants/scrollToTop';

export function CreateStartup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentUser, setSelectedProfile } = useUserData();
  const { webName } = useWebData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    founder: currentUser?.full_name,
    introDescription: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    category: 'Fashion',
    productOrSevices: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit to a backend
    if (!user) return;

    setLoading(true);

    const productsAndServices = formData.productOrSevices
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from('startups')
      .insert({
        user_id: currentUser?.id,
        name: formData.name,
        founder_name: formData.founder,
        cartegory: formData.category,
        intro_description: formData.introDescription ?? "Introduction",
        description: formData.description ?? "The full description of the startup",
        phone: formData.phone ?? "",
        email: formData.email ?? "",
        address: formData.address ?? "",
        products_and_services: productsAndServices
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      setError(true)
      return;
    } else {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        navigate(`/startup/${data.id}`)
        setSelectedProfile(currentUser?.id)
      }, 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      <ScrollToTop />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">Create Your Business Page</h1>
          <p className="text-gray-600 mb-8">Share your business with the {webName} community</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Startup Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                placeholder="Enter your business name"
              />
            </div>

            {/* Founder Name */}
            <div>
              <label htmlFor="founder" className="block text-sm font-medium text-gray-700 mb-2">
                Founder Name *
              </label>
              <input
                type="text"
                id="founder"
                required
                value={formData.founder}
                onChange={(e) => setFormData({ ...formData, founder: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                placeholder="Name of business owner"
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
              >
                <option value="Fashion">Fashion</option>
                <option value="Tech">Tech</option>
                <option value="Food">Food</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Beauty">Beauty</option>
                <option value="Art">Art</option>
                <option value="Services">Services</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Business intro description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={formData.introDescription}
                onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent resize-none"
                placeholder="Tell us a little about your business..."
              />
            </div>

            <div>
              <label htmlFor="founder" className="block text-sm font-medium text-gray-700 mb-2">
                Products or Services *
              </label>
              <input
                type="text"
                id="founder"
                required
                value={formData.productOrSevices}
                onChange={(e) => setFormData({ ...formData, productOrSevices: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                placeholder="List your products or services, separated by commas"
              />
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                    placeholder="0712345678"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Business email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                    placeholder="yourbusiness@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                    placeholder="e.g. Aqua Complex level 4 Room 75"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}

            {submitted ? (
              <SuccessMessage
                header={error ? 'Something went wrong, please try again.' : 'Business Published Successfully.'}
                message={null}
                error={error}
              />
            ) : (
              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate(`/profile/${currentUser?.id}`)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 text-xs md:text-sm rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 primary-bg disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs md:text-sm rounded-xl  transition-all font-medium shadow-md hover:shadow-lg"
                >
                  {loading ? 'Publishing Business...' : 'Publish Business'}
                </button>
              </div>
            )}

          </form>
        </div>
      </main>
    </div>
  );
}