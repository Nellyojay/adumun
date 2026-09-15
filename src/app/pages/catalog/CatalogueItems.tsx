import { Link, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { CircleDot, MapPin, X } from 'lucide-react';
import { useCatalog } from '../../contexts/catalogContext';
import ScrollToTop from '../../constants/scrollToTop';
import { useStartup } from '../../contexts/StartupProfileContext';
import { usePageDataOwner } from '../../constants/ownerTag';
import { BackButton } from '../../components/utils/reusableButtons';
import { ListModal } from '../../components/Modal';

export function CatalogueItems() {
  const { collectionItems, collections, setSelectedCollection, selectedCollection } = useCatalog();
  const { startupData } = useStartup();
  const { startupId, collection: collectionParam } = useParams<{ startupId?: string; collection?: string }>();
  const [selectedItem, setSelectedItem] = useState<typeof collectionItems[number] | null>(null);
  const collection = decodeURIComponent(collectionParam || '');
  const normalizedCollection = collection.toLowerCase();
  const activeStartup = startupData?.find((startup) => startup.id === startupId);
  const startupName = activeStartup?.name ?? 'Unknown';
  const isOwner = usePageDataOwner(activeStartup);

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
      <div className="pt-12 pb-20 sm:px-6">
        <BackButton className="static not-sm:mx-6" />

        <div className="mx-auto max-w-6xl">
          <div className="mb-6 px-4 sm:px-0">
            <h1 className="mt-2 text-2xl font-semibold text-slate-900">
              {displayCollectionName ? `${displayCollectionName}` : 'All Items'}
              <span className="text-slate-500"> - {startupName}</span>
            </h1>
          </div>

          {isOwner && startupId && (
            <div className="mb-6 flex justify-end">
              <Link
                to={`/startup/${startupId}/catalog/${encodeURIComponent(collection || '')}/add-item`}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Add item to listing
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
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItem(item)}
                    className="group relative overflow-hidden border border-white/10 bg-slate-900/90 p-0 text-left shadow-[0_20px_80px_rgba(15,23,42,0.45)] transition-all duration-300"
                  >
                    <img
                      src={item.image}
                      alt="Product"
                      className="h-56 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-64 md:h-80"
                    />
                    <div className="absolute inset-x-2 top-0 flex items-center justify-between py-2 not-sm:h-full not-sm:flex-col">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[8px] sm:text-xs font-semibold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${itemStatusStyle}`}
                      >
                        <CircleDot className="h-2.5 w-2.5" />
                        {item.status}
                      </span>
                      <span className="rounded-full bg-slate-950/70 px-3 py-1 text-xs text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.45)]">
                        ${item.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || "Price not specified"}
                      </span>
                    </div>

                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ListModal
        isOpen={selectedItem !== null}
        selectedItem={selectedItem}
        contentArray={filteredItems}
        onClose={() => setSelectedItem(null)}
        onSelect={setSelectedItem}
        ariaLabelledBy="catalog-item-title"
        itemLabel="catalog item"
        className="max-w-lg md:max-w-4xl"
      >
        {selectedItem && (() => {
          const itemStatusStyle =
            selectedItem.status === 'Available'
              ? 'bg-emerald-500/90 text-slate-950'
              : selectedItem.status === 'Booked'
                ? 'bg-amber-500/90 text-slate-950'
                : 'bg-rose-500/90 text-white';

          return (
            <div className="relative max-h-[calc(100vh-8rem)] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex md:items-stretch">
              <div className="md:flex md:w-1/2 md:items-center md:justify-center md:bg-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  aria-label="Close item details"
                  className="absolute not-md:right-2 md:left-2 top-2 z-10 rounded-full bg-slate-950/20 p-2 text-white transition hover:bg-slate-500"
                >
                  <X className="h-5 w-5" />
                </button>

                <img
                  src={selectedItem.image}
                  alt={selectedItem.category || 'Product'}
                  className="max-h-[74vh] w-full rounded-lg object-contain md:max-h-[calc(100vh-12rem)]"
                />
              </div>

              <div className="relative px-2 space-y-4 rounded-lg bg-white pt-4 md:w-1/2 md:overflow-y-auto">
                <div className="flex items-center justify-between gap-2 rounded-lg px-4 py-2 mx-2 shadow-sm">
                  <p id="catalog-item-title" className="text-md font-semibold text-gray-700">
                    UGX {selectedItem.price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 'Price not specified'}
                  </p>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${itemStatusStyle}`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {selectedItem.status}
                  </span>
                </div>

                <div className="min-h-28">
                  <p className="leading-8 text-gray-600">{selectedItem.description || '-- No description available --'}</p>
                </div>

                <div className="grid mb-2 gap-4 mx-1 sm:grid-cols-2">
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
            </div>
          );
        })()}
      </ListModal>
    </div>
  );
}
