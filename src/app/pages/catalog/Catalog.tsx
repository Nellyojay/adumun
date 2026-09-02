
import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { useCatalog } from '../../contexts/catalogContext';
import ScrollToTop from '../../constants/scrollToTop';
import { useStartup } from '../../contexts/StartupProfileContext';
import { useEffect } from 'react';
import { usePageDataOwner } from '../../constants/ownerTag';
import { ChevronRight } from 'lucide-react';

export function Catalog() {
  const { collections } = useCatalog();
  const { setSelectedStartup, startupData } = useStartup();
  const startupId = useParams<{ startupId?: string }>().startupId;
  const navigate = useNavigate();
  const activeStartup = startupData?.find((startup) => startup.id === startupId);
  const isOwner = usePageDataOwner(activeStartup);

  useEffect(() => {
    if (startupId) {
      setSelectedStartup(startupId);
    }
  }, [startupId, setSelectedStartup]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />

      <div className="pt-16 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 mb-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <p className="text-sm font-semibold">Back</p>
          </button>

          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-600">Collections</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Shop by collection</h1>
            </div>

            {isOwner && startupId && (
              <Link
                to={`/startup/${startupId}/catalog/create`}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Create collection
              </Link>
            )}
          </div>

          {collections.length > 0
            ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {collections.map((collection) => {
                  return (
                    <Link
                      key={collection.id}
                      to={startupId ? `/startup/${startupId}/catalog/${encodeURIComponent(collection.id)}` : '#'}
                      onClick={(event) => {
                        if (!startupId) {
                          event.preventDefault();
                        }
                      }}
                      className="flex items-center rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition sm:hover:shadow-lg"
                    >
                      <div className="w-full">
                        <div className="text-sm font-bold uppercase tracking-[0.24em] text-cyan-600">{collection.collection_name}</div>
                        <h2 className="font-semibold text-slate-900">{collection.item_count || 0} item{collection.item_count === 1 ? '' : 's'}</h2>
                      </div>

                      <ChevronRight className="" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-700">
                No collections available.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}