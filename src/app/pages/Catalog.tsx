
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useCatalog } from '../contexts/catalogContext';
import ScrollToTop from '../constants/scrollToTop';
import { useStartup } from '../contexts/StartupProfileContext';

export function Catalog() {
  const { items } = useCatalog();
  const { selectedStartup } = useStartup();
  const navigate = useNavigate();
  const collections = Array.from(new Set(items.map((item) => item.collection)));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />

      <div className="pt-16 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          <button onClick={() => navigate(-1)} className="flex items-center px-4 py-2 mb-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
            <p className="text-sm font-semibold">Back</p>
          </button>

          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-cyan-600">Collections</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Shop by collection</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-500">
                Browse curated collections like shoes, clothes, sweaters, trousers and more. Select a collection to view matching catalogue items.
              </p>
            </div>

            {selectedStartup ? (
              <Link
                to={`/startup/${selectedStartup}/catalog/create`}
                className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700"
              >
                Create collection
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center rounded-full bg-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm"
              >
                Create collection
              </button>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {collections.map((collection) => {
              const count = items.filter((item) => item.collection === collection).length;
              return (
                <Link
                  key={collection}
                  to={selectedStartup ? `/startup/${selectedStartup}/catalog/${encodeURIComponent(collection)}` : '#'}
                  onClick={(event) => {
                    if (!selectedStartup) {
                      event.preventDefault();
                    }
                  }}
                  className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition sm:hover:shadow-lg"
                >
                  <div className="text-sm uppercase tracking-[0.24em] text-cyan-600">{collection}</div>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-900">{count} item{count === 1 ? '' : 's'}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-500">View only {collection.toLowerCase()} products in the catalogue.</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-600 transition group-hover:text-cyan-700">
                    <span>Explore</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}