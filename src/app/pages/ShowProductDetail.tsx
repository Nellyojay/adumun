
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CircleDot, MapPin } from 'lucide-react';
import { useCatalog } from '../contexts/catalogContext';
import '../css/productDetail.css';
import ScrollToTop from '../constants/scrollToTop';
import supabase from '../supabaseClient';

const ShowProductDetail = () => {
  const navigate = useNavigate();
  const { collectionItems } = useCatalog();
  const { startupId, collection, productId } = useParams<{ startupId?: string; collection?: string; productId?: string }>();
  const [resolvedItem, setResolvedItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

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
          <p className="mt-3 text-gray-600">The selected catalogue item does not exist.</p>
          <Link
            to={startupId && collection ? `/startup/${startupId}/catalog/${encodeURIComponent(collection)}` : '/'}
            className="mt-6 inline-flex rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
          >
            Back to catalogue
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
                alt={selectedItem.name}
                className="max-h-[calc(100vh-8rem)] max-w-[calc(100vw-2rem)] rounded-lg object-contain"
              />
            </div>

            <div className="absolute top-0 hidden w-full rounded-t-lg px-4 py-2 not-sm:block">
              <div className="flex items-center justify-between rounded-sm bg-gray-300/70 px-2">
                <div>
                  <span className="text-sm uppercase tracking-widest text-gray-700">{selectedItem.name}</span>
                  <p className="text-sm font-semibold text-gray-700">UGX {selectedItem.price}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${itemStatusStyle}`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 rounded-lg bg-white p-4 lg:p-8">
            <div className="hidden w-full rounded-lg px-4 py-2 shadow-sm sm:block">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm uppercase tracking-widest text-gray-700">{selectedItem.name}</span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${itemStatusStyle}`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <p className="text-md font-semibold text-gray-700">UGX {selectedItem.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Price not specified"}</p>
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
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {selectedItem.location || "Location not specified"}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Stock</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">{selectedItem.units || "Stock value not specified"}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {selectedItem.status === 'Available' ? 'Ready for purchase' : selectedItem.status === 'Booked' ? 'Booked' : 'Out of stock'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex w-full items-center justify-center rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
            >
              Back to catalogue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProductDetail;
