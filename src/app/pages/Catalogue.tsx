import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../components/Navbar';
import { CircleDot, MapPin } from 'lucide-react';
import { useCatalog } from '../contexts/catalogContext';
import ScrollToTop from '../constants/scrollToTop';

export function Catalogue() {
  const { items } = useCatalog();
  const id = useParams<{ id: string }>()?.id; // Get the startup ID from the URL if needed
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />
      <div className="pt-20 pb-20">

        <button onClick={() => navigate(`/src/app/pages/StartupProfile/${id}`)} className="flex items-center gap-2 px-4 py-2 mb-4 ml-4 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors">
          <p className=''>Back</p>
        </button>

        <div className="">

          <div className="grid grid-cols-3 md:grid-cols-4 md:mx-16">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/catalogue/${item.id}`}
                className="group relative overflow-hidden border border-white/10 bg-slate-900/90 p-0 text-left shadow-[0_20px_80px_rgba(15,23,42,0.45)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent" />
                <img
                  src={item.cover}
                  alt={item.name}
                  className="h-56 sm:h-64 md:h-80 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-4 top-0 py-2 flex not-sm:flex-col not-sm:h-full items-center justify-between">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${item.status === 'Available'
                    ? 'bg-emerald-500/90 text-slate-950'
                    : 'bg-rose-500/90 text-white'
                    }`}>
                    <CircleDot className="h-2.5 w-2.5" />
                    {item.status}
                  </span>
                  <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.45)]">
                    ${item.price}
                  </span>
                </div>

                <div className="absolute hidden text-gray-400 sm:block inset-x-2 bottom-2 rounded-2xl backdrop-blur-xs p-2 shadow-sm">
                  <h2 className="ml-3 text-sm not-sm:text-xs font-semibold">{item.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-gray-400">
                    <span className="inline-flex items-center rounded-full px-3 text-xs">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs">
                      {item.units}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
