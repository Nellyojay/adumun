import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import ScrollToTop from '../../constants/scrollToTop';
import { useStartup } from '../../contexts/StartupProfileContext';
import supabase from '../../supabaseClient';
import SuccessMessage from '../../components/SuccessMessage';

export function CreateCollection() {
  const navigate = useNavigate();
  const { selectedStartup, startupData } = useStartup();
  const activeStartup = startupData?.find((startup) => startup.id === selectedStartup) ?? null;
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    collection_name: '',
    description: '',
    startup_id: selectedStartup || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      startup_id: selectedStartup || '',
    }));
  }, [selectedStartup]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.collection_name.trim()) {
      setErrorMessage('Please fill in the collection name.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { error } = await supabase
      .from('collections')
      .insert([
        {
          collection_name: formData.collection_name,
          description: formData.description,
          startup_id: selectedStartup || null,
        },
      ]);

    setLoading(false);

    if (error) {
      setErrorMessage('Error creating collection. Please try again.');
      return;
    }

    setSubmitted(true);
    setFormData({
      collection_name: '',
      description: '',
      startup_id: selectedStartup || '',
    });

    setTimeout(() => {
      navigate(selectedStartup ? `/startup/${selectedStartup}/catalog` : '/');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />

      <main className="mx-auto max-w-3xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-600">Catalog</p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create collection</h1>
              {activeStartup && (
                <p className="mt-2 text-sm text-slate-600">
                  Creating for <span className="font-semibold text-slate-800">{activeStartup.name}</span>
                </p>
              )}
            </div>

            <Link
              to={selectedStartup ? `/startup/${selectedStartup}/catalog` : '/'}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Back to catalog
            </Link>
          </div>

          {!selectedStartup && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              No startup is selected yet. Open a startup profile and choose “View Catalogue” to attach this collection to a business.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="collection_name" className="mb-2 block text-sm font-medium text-slate-700">
                Collection name
              </label>
              <input
                id="collection_name"
                name="collection_name"
                type="text"
                required
                value={formData.collection_name}
                onChange={handleChange}
                placeholder="e.g. Summer Essentials"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the collection..."
                className="w-full resize-none rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {errorMessage && (
              <p className="font-medium text-red-700">{errorMessage}</p>
            )}

            {submitted ? (
              <SuccessMessage
                header="Collection created successfully!"
                message="You will be redirected to the catalog shortly."
                error={false}
              />
            ) : (
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate(selectedStartup ? `/startup/${selectedStartup}/catalog` : '/')}
                  className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Create collection'}
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
