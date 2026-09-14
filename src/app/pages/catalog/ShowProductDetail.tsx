
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { CircleDot, Edit, MapPin } from 'lucide-react';
import { useCatalog } from '../../contexts/catalogContext';
import { useStartup } from '../../contexts/StartupProfileContext';
import { useUserData } from '../../contexts/userDataContext';
import '../../css/productDetail.css';
import ScrollToTop from '../../constants/scrollToTop';
import supabase from '../../supabaseClient';

const ShowProductDetail = () => {
  const { collectionItems } = useCatalog();
  const { startupData } = useStartup();
  const { currentUser } = useUserData();
  const { startupId, collection, productId } = useParams<{ startupId?: string; collection?: string; productId?: string }>();
  const [resolvedItem, setResolvedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    price: '',
    status: 'Available',
    description: '',
    location: '',
    units: '',
  });

  useEffect(() => {
    if (!productId) {
      setResolvedItem(null);
      return;
    }

    const foundItem = collectionItems.find((item) => String(item.id) === String(productId));

    if (foundItem) {
      setResolvedItem(foundItem);
      return;
    }

    let isMounted = true;

    const fetchItem = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('collection_items')
        .select('*')
        .eq('id', productId)
        .maybeSingle();

      if (!isMounted) {
        return;
      }

      if (!error && data) {
        setResolvedItem(data);
      } else {
        setResolvedItem(null);
      }

      setLoading(false);
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [collectionItems, productId]);

  const selectedItem = resolvedItem ?? collectionItems.find((item) => String(item.id) === String(productId)) ?? null;
  const itemStartup = startupData?.find((startup) => String(startup.id) === String(startupId));
  const canEdit = Boolean(itemStartup?.user_id && currentUser?.id === itemStartup.user_id);

  useEffect(() => {
    if (!selectedItem || !canEdit) {
      return;
    }

    setFormData({
      price: selectedItem.price?.toString() || '',
      status: selectedItem.status || 'Available',
      description: selectedItem.description || '',
      location: selectedItem.location || '',
      units: selectedItem.units?.toString() || '',
    });
  }, [selectedItem]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setSaveMessage(null);
  };

  const handleCancel = () => {
    if (selectedItem) {
      setFormData({
        price: selectedItem.price?.toString() || '',
        status: selectedItem.status || 'Available',
        description: selectedItem.description || '',
        location: selectedItem.location || '',
        units: selectedItem.units?.toString() || '',
      });
    }

    setSaveMessage(null);
    setIsEditing(false);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedItem && !canEdit) {
      return;
    }

    setSaving(true);
    setSaveMessage(null);

    const { data, error } = await supabase
      .from('collection_items')
      .update({
        price: formData.price,
        status: formData.status,
        description: formData.description,
        location: formData.location,
        units: formData.units,
      })
      .eq('id', selectedItem.id)
      .select('*')
      .single();

    if (error) {
      console.log('Error saving changes:', error);
      setSaveMessage('Unable to save changes. Please try again.');
    } else {
      setResolvedItem(data);
      setSaveMessage('Changes saved.');
      setIsEditing(false);
    }

    setSaving(false);
  };

  if (loading && !selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="text-xl font-semibold text-gray-900">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <p className="text-xl font-semibold text-gray-900">Product not found</p>
          <p className="mt-3 text-gray-600">The selected item does not exist.</p>
          <Link
            to={startupId && collection ? `/startup/${startupId}/catalog/${encodeURIComponent(collection)}` : '/'}
            className="mt-6 inline-flex rounded-full primary-bg px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition primary-bg-hover"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  const itemStatusStyle =
    selectedItem.status === 'Available'
      ? 'bg-emerald-500/90 text-slate-950'
      : selectedItem.status === 'Booked'
        ? 'bg-amber-500/90 text-slate-950'
        : 'bg-rose-500/90 text-white';

  return (
    <div className="bg-gray-200">
      <Navbar />
      <ScrollToTop />
      <div className="py-16">
        <div className="detail-container mx-auto max-w-6xl px-3 sm:px-8">
          <div className="relative">
            <div className="flex max-h-screen items-center justify-center overflow-hidden rounded-lg shadow-lg">
              <img
                src={selectedItem.image}
                alt="Product"
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-2rem)] rounded-lg object-contain"
              />
            </div>

            <div className="absolute top-0 hidden w-full px-2 py-1 not-sm:block">
              <div className="flex items-center justify-between rounded-md bg-linear-to-r from-gray-300/80 to-transparent px-2 text-xs">
                <div>
                  <p className="font-semibold text-gray-700">UGX {selectedItem.price}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold uppercase ${itemStatusStyle}`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-6 rounded-lg bg-white p-4 lg:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-semibold text-gray-700">
                  Price
                  <input
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price not specified"
                    className="w-full rounded-xl border-2 border-cyan-400 bg-cyan-50/40 px-4 py-3 text-gray-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  />
                </label>
                <label className="space-y-2 text-sm font-semibold text-gray-700">
                  Status
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-cyan-400 bg-cyan-50/40 px-4 py-3 text-gray-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </label>
              </div>

              <label className="block space-y-2 text-sm font-semibold text-gray-700">
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="No description available"
                  rows={4}
                  className="w-full resize-y rounded-xl border-2 border-cyan-400 bg-cyan-50/40 px-4 py-3 leading-7 text-gray-900 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="rounded-3xl border-2 border-cyan-400 bg-cyan-50/40 p-5 text-sm font-semibold text-gray-700 shadow-sm">
                  Location
                  <span className="mt-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4 primary-color" />
                    <input
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Location not specified"
                      className="min-w-0 flex-1 bg-transparent text-gray-900 outline-none"
                    />
                  </span>
                </label>
                <label className="rounded-3xl border-2 border-cyan-400 bg-cyan-50/40 p-5 text-sm font-semibold text-gray-700 shadow-sm">
                  Stock
                  <input
                    name="units"
                    type="text"
                    value={formData.units}
                    onChange={handleChange}
                    placeholder="Stock value not specified"
                    className="mt-3 w-full bg-transparent text-lg text-gray-900 outline-none"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <p className="text-sm text-gray-600" aria-live="polite">{saveMessage}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="rounded-xl border-2 border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl border-2 border-cyan-500 bg-cyan-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <>
              {canEdit && (
                <button
                  type="button"
                  aria-label="Edit product details"
                  title="Edit item details"
                  onClick={() => {
                    setIsEditing(true);
                    setSaveMessage(null);
                  }}
                  className="flex items-center justify-center gap-2 rounded-t-lg primary-bg pb-8 pt-1 text-white primary-bg-hover hover:-translate-y-1.5 hover:font-semibold hover:transition hover:duration-300 hover:ease-in-out"
                >
                  Edit Item
                  <Edit className="h-5 w-5" />
                </button>
              )}
              <div className="relative space-y-6 rounded-lg bg-white p-4 lg:p-8">

                <div className="hidden w-full rounded-lg px-4 py-2 shadow-sm sm:block">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-md font-semibold text-gray-700">
                        UGX {selectedItem.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Price not specified'}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${itemStatusStyle}`}>
                        <CircleDot className="h-2.5 w-2.5" />
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="min-h-28 max-h-52">
                  <p className="leading-8 text-gray-600">{selectedItem.description || '-- No description available --'}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Location</p>
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <MapPin className="h-4 w-4 primary-color" />
                      {selectedItem.location || 'Location not specified'}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Stock</p>
                    <p className="mt-3 text-lg font-semibold text-gray-900">{selectedItem.units || 'Stock value not specified'}</p>
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedItem.status === 'Available' ? 'Ready for purchase' : selectedItem.status === 'Booked' ? 'Booked' : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowProductDetail;
