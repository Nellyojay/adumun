
import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CircleDot, MapPin } from 'lucide-react';
import { useCatalog } from '../contexts/catalogContext';
import '../css/productDetail.css';
import ScrollToTop from '../constants/scrollToTop';

const ShowProductDetail = () => {
  const navigate = useNavigate();
  const { startupId, collection, productId } = useParams<{ startupId?: string; collection?: string; productId?: string }>();
  const { getItemById } = useCatalog();
  const selectedItem = productId ? getItemById(productId) : undefined;

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

  return (
    <div className="bg-gray-200">
      <Navbar />
      <ScrollToTop />
      <div className="py-16">
        <div className="detail-container max-w-6xl mx-auto px-3 sm:px-8 ">

          <div className='relative'>
            <div className="flex justify-center items-center max-h-screen rounded-lg overflow-hidden shadow-lg">
              <img
                src={selectedItem.cover}
                alt={selectedItem.name}
                className="max-h-[calc(100vh-6rem)] max-w-[calc(100vw-2rem)] object-contain rounded-lg"
              />
            </div>

            <div className="absolute top-0 w-full hidden not-sm:block rounded-t-lg py-2 px-4">
              <div className="flex justify-between items-center bg-gray-300/70 rounded-sm px-2">
                <div>
                  <span className="text-sm uppercase tracking-widest text-gray-700">{selectedItem.name}</span>
                  <p className="text-sm text-gray-700 font-semibold">UGX {selectedItem.price}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${selectedItem.status === 'Available'
                    ? 'bg-emerald-500/90 text-slate-950'
                    : 'bg-rose-500/90 text-white'
                    }`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-white rounded-lg p-4 lg:p-8">

            <div className="w-full hidden sm:block rounded-lg py-2 px-4 shadow-sm">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm uppercase tracking-widest text-gray-700">{selectedItem.name}</span>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${selectedItem.status === 'Available'
                    ? 'bg-emerald-500/90 text-slate-950'
                    : 'bg-rose-500/90 text-white'
                    }`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>
                <div>
                  <p className="text-md text-gray-700 font-semibold">UGX {selectedItem.price}</p>
                </div>
              </div>
            </div>

            <div className="min-h-28 max-h-52">
              <p className="text-gray-600 leading-8">{selectedItem.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Location</p>
                <p className="mt-3 text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  {selectedItem.location}
                </p>
              </div>
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Stock</p>
                <p className="mt-3 text-lg font-semibold text-gray-900">{selectedItem.units}</p>
                <p className="mt-2 text-sm text-gray-500">{selectedItem.status === 'Available' ? 'Ready for purchase' : 'Out of stock'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate(startupId && collection ? `/startup/${startupId}/catalog/${encodeURIComponent(collection)}` : -1 as any)}
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
