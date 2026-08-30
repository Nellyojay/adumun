import { Link, useNavigate, useParams } from 'react-router';
import { useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { CircleDot } from 'lucide-react';
import { useCatalog } from '../../contexts/catalogContext';
import ScrollToTop from '../../constants/scrollToTop';
import { useStartup } from '../../contexts/StartupProfileContext';

export function CatalogueItems() {
  const { collectionItems, collections, setSelectedCollection, selectedCollection } = useCatalog();
  const { startupData } = useStartup();
  const navigate = useNavigate();
  const { startupId, collection: collectionParam } = useParams<{ startupId?: string; collection?: string }>();
  const collection = decodeURIComponent(collectionParam || '');
  const normalizedCollection = collection.toLowerCase();
  const startupName = startupData?.find((startup) => startup.id === startupId)?.name ?? 'Unknown';

  const matchedCollection = collections.find((entry) => {
    const collectionId = String(entry.id || '').toLowerCase();
    const collectionName = String(entry.collection_name || '').toLowerCase();
    return collectionId === normalizedCollection || collectionName === normalizedCollection;
  });

  const displayCollectionName = matchedCollection?.collection_name || collection;
  const activeCollectionId = matchedCollection?.id || selectedCollection || collection || '';

  useEffect(() => {
    const nextCollection = matchedCollection?.id || collection || null;
    setSelectedCollection(nextCollection);
  }, [matchedCollection?.id, collection, setSelectedCollection]);

  const filteredItems = !activeCollectionId
    ? collectionItems
    : collectionItems.filter((item) => {
      const itemCollectionId =
        typeof item.collection_id === 'string'
          ? item.collection_id
          : item.collection_id && typeof item.collection_id === 'object'
            ? String(item.collection_id.id || '')
            : '';

      return itemCollectionId.toLowerCase() === activeCollectionId.toLowerCase();
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />
      <div className="pt-16 pb-20">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 ml-8 flex items-center rounded-full bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300 md:ml-16"
        >
          <p className="text-sm font-semibold">Back</p>
        </button>

        <div className="mx-auto max-w-6xl sm:px-8">
          <div className="mb-6 px-4 sm:px-0">
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">
              {displayCollectionName ? `${displayCollectionName} collection` : 'All catalogue items'}
              <span className="text-slate-500"> - {startupName}</span>
            </h1>
          </div>

          {startupId && (
            <div className="mb-6 flex justify-end">
              <Link
                to={`/startup/${startupId}/catalog/${encodeURIComponent(collection || '')}/add-item`}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Add item to collection
              </Link>
            </div>
          )}

          {filteredItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-700">
              No items found for “{displayCollectionName}”.
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4">
              {filteredItems.map((item) => {
                const itemStatusStyle =
                  item.status === 'Available'
                    ? 'bg-emerald-500/90 text-slate-950'
                    : item.status === 'Booked'
                      ? 'bg-amber-500/90 text-slate-950'
                      : 'bg-rose-500/90 text-white';

                return (
                  <Link
                    key={item.id}
                    to={startupId ? `/startup/${startupId}/catalog/${encodeURIComponent(collection || item.collection_id?.id || item.category)}/${item.id}` : '#'}
                    onClick={(event) => {
                      if (!startupId) {
                        event.preventDefault();
                      }
                    }}
                    className="group relative overflow-hidden border border-white/10 bg-slate-900/90 p-0 text-left shadow-[0_20px_80px_rgba(15,23,42,0.45)] transition-all duration-300"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-64 md:h-80"
                    />
                    <div className="absolute inset-x-2 top-0 flex items-center justify-between py-2 not-sm:h-full not-sm:flex-col">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${itemStatusStyle}`}
                      >
                        <CircleDot className="h-2.5 w-2.5" />
                        {item.status}
                      </span>
                      <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.45)]">
                        ${item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Price not specified"}
                      </span>
                    </div>

                    <div className="absolute w-full bottom-2 hidden rounded-2xl bg-gray-900/60 px-3 py-1 text-gray-400 shadow-md backdrop-blur-sm sm:block">
                      <h2 className="text-sm not-sm:text-xs line-clamp-1">{item.name}</h2>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
