import { useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { X, CircleDot, MapPin, ArrowRight } from 'lucide-react';

type CatalogueItem = {
  id: string;
  title: string;
  tagline: string;
  location: string;
  price: string;
  status: 'Available' | 'Sold';
  units: string;
  category: string;
  description: string;
  cover: string;
};

const catalogueItems: CatalogueItem[] = [
  {
    id: 'nebula-one',
    title: 'Nebula One',
    tagline: 'Bio-synthetic habitat for orbital teams',
    location: 'Lunar Gateway, Moon Orbit',
    price: '98,000',
    status: 'Available',
    units: '12 left',
    category: 'Habitat',
    description:
      'A compact orbital suite designed for rapid deployment and immersive command control, wrapped in a metallic aurora shell.',
    cover:
      'https://images.unsplash.com/photo-1517971071642-34a2d1b81cc0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'quantum-vault',
    title: 'Quantum Vault',
    tagline: 'Secure asset vault with adaptive neon shielding',
    location: 'Berlin, Germany',
    price: '42,500',
    status: 'Sold',
    units: '0 left',
    category: 'Security',
    description:
      'A futurist vault system that uses quantum-resistant locks, gesture controls, and atmospheric pulse trailing.',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aurora-grid',
    title: 'Aurora Grid',
    tagline: 'Urban energy network for smart districts',
    location: 'Seoul, South Korea',
    price: '67,400',
    status: 'Available',
    units: '9 left',
    category: 'Infrastructure',
    description:
      'A modular energy mesh engineered for cityscapes, delivering adaptive lighting, storage, and AI-driven demand balancing.',
    cover:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'vector-edge',
    title: 'Vector Edge',
    tagline: 'Wearable projection interface for field agents',
    location: 'San Francisco, USA',
    price: '12,900',
    status: 'Available',
    units: '34 left',
    category: 'Wearable',
    description:
      'A fusion of ultra-thin optics and haptic feedback that keeps critical dashboards visible in any environment.',
    cover:
      'https://images.unsplash.com/photo-1510882382565-cc56c1bb9c7f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pulse-arc',
    title: 'Pulse Arc',
    tagline: 'Mobile drone charging hub with plasma cores',
    location: 'Dubai, UAE',
    price: '28,200',
    status: 'Sold',
    units: '0 left',
    category: 'Mobility',
    description:
      'A compact charging node built for drones and light vehicles, with smart routing and corrosive-resistant framing.',
    cover:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cypher-lens',
    title: 'Cypher Lens',
    tagline: 'Augmented reality scanning eyewear',
    location: 'Tokyo, Japan',
    price: '5,600',
    status: 'Available',
    units: '20 left',
    category: 'Hardware',
    description:
      'Precision AR lenses that overlay data streams directly onto user sightlines with minimal glare and high durability.',
    cover:
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80',
  },
];

export function Catalogue() {
  const [activeItem, setActiveItem] = useState<CatalogueItem | null>(null);

  const selectedItem = useMemo(() => activeItem, [activeItem]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-4xl border border-gray-200 bg-white p-8 shadow-md mb-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm tracking-[0.18em] text-cyan-300 uppercase shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                  futuristic catalogue
                </div>
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    Explore the latest curated modules.
                  </h1>
                  <p className="mt-4 max-w-2xl text-gray-600 sm:text-lg">
                    High-tech assets with immersive previews, location details, availability tags, and an interactive modal that reveals the full module.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-200">
                  <p className="text-xs uppercase text-gray-500">Total modules</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">6</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-200">
                  <p className="text-xs uppercase text-gray-500">Available</p>
                  <p className="mt-2 text-3xl font-semibold text-emerald-600">4</p>
                </div>
                <div className="rounded-3xl bg-white p-4 shadow-sm border border-gray-200">
                  <p className="text-xs uppercase text-gray-500">Featured</p>
                  <p className="mt-2 text-3xl font-semibold text-indigo-600">2</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 md:mx-16">
            {catalogueItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item)}
                className="group relative overflow-hidden border border-white/10 bg-slate-900/90 p-0 text-left shadow-[0_20px_80px_rgba(15,23,42,0.45)] transition-all duration-300 "
              >
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-transparent to-transparent" />
                <img
                  src={item.cover}
                  alt={item.title}
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
                  <h2 className="ml-3 text-sm not-sm:text-xs font-semibold">{item.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-2 text-gray-400">
                    <span className="inline-flex items-center rounded-full px-3 text-xs">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full  px-3 py-1 text-xs">
                      {item.units}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-4xl border border-gray-200 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900/90 text-slate-100 transition hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-0">
              <div className="relative min-h-105 overflow-hidden lg:min-h-140">
                <img
                  src={selectedItem.cover}
                  alt={selectedItem.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm">
                  Live preview module
                </div>
                <div className="absolute bottom-6 left-6 right-6 rounded-4xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs uppercase tracking-[0.3em] text-slate-400">{selectedItem.category}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${selectedItem.status === 'Available'
                        ? 'bg-emerald-500/90 text-slate-950'
                        : 'bg-rose-500/90 text-white'
                        }`}>
                        <CircleDot className="h-2.5 w-2.5" />
                        {selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">{selectedItem.tagline}</p>
                      <p className="mt-2 text-3xl font-semibold text-white">${selectedItem.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 bg-white p-8 lg:p-12">
                <div className="space-y-4">
                  <p className="text-sm uppercase tracking-[0.35em] text-blue-600">Module details</p>
                  <h2 className="text-4xl font-semibold text-gray-900">{selectedItem.title}</h2>
                  <p className="text-gray-600 leading-8">{selectedItem.description}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Location</p>
                    <p className="mt-3 text-lg font-semibold text-gray-900 flex items-center gap-2">
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
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Ready for dispatch</p>
                      <p className="mt-2 text-xl font-semibold text-gray-900">Immediate</p>
                    </div>
                    <ArrowRight className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveItem(null)}
                  className="w-full rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-blue-700"
                >
                  Back to catalogue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
