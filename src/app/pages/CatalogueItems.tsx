import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CircleDot } from 'lucide-react';
import { useCatalog } from '../contexts/catalogContext';
import ScrollToTop from '../constants/scrollToTop';

export function CatalogueItems() {
  const { items } = useCatalog();
  const navigate = useNavigate();
  const { startupId, collection: collectionParam } = useParams<{ startupId?: string; collection?: string }>();
  const collection = decodeURIComponent(collectionParam || '');
  const filteredItems = collection
    ? items.filter((item) => item.collection.toLowerCase() === collection.toLowerCase())
    : items;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />
      <div className="pt-16 pb-20">

        <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 mb-4 ml-4 md:ml-16 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
          <p className="text-sm font-semibold">Back</p>
        </button>

        <div className="mx-auto max-w-6xl md:px-8">
          <div className="mb-6 px-4 sm:px-0">
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-500">Catalogue</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {collection ? `${collection} collection` : 'All catalogue items'}
            </h1>
            {startupId && (
              <p className="mt-2 text-sm text-slate-500">Startup: {startupId}</p>
            )}
            {collection && (
              <p className="mt-2 text-sm text-slate-500">Showing products from the {collection.toLowerCase()} collection.</p>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-700">
              No items found for “{collection}”.
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4">
              {filteredItems.map((item) => (
                <Link
                  key={item.id}
                  to={startupId ? `/startup/${startupId}/catalog/${encodeURIComponent(collection)}/${item.id}` : '#'}
                  onClick={(event) => {
                    if (!startupId) {
                      event.preventDefault();
                    }
                  }}
                  className="group relative overflow-hidden border border-white/10 bg-slate-900/90 p-0 text-left shadow-[0_20px_80px_rgba(15,23,42,0.45)] transition-all duration-300"
                >
                  <img
                    src={item.cover}
                    alt={item.name}
                    className="h-56 sm:h-64 md:h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-2 top-0 py-2 flex not-sm:flex-col not-sm:h-full items-center justify-between">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${item.status === 'Available'
                      ? 'bg-emerald-500/90 text-slate-950'
                      : 'bg-rose-500/90 text-white'
                      }`}>
                      <CircleDot className="h-2.5 w-2.5" />
                      {item.status}
                    </span>
                    <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.45)]">
                      ${item.price}
                    </span>
                  </div>

                  <div className="absolute hidden text-gray-400 sm:block inset-x-2 bottom-2 rounded-2xl bg-gray-900/60 backdrop-blur-sm p-2 shadow-md">
                    <h2 className="ml-3 text-sm not-sm:text-xs font-semibold">{item.name}</h2>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
