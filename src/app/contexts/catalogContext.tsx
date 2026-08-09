import React, { createContext, useContext } from 'react';

export type CatalogueItem = {
  id: string;
  name: string;
  tagline: string;
  location: string;
  price: string;
  status: 'Available' | 'Sold';
  units: string;
  soldCount: number;
  category: string;
  description: string;
  cover: string;
};

export type CatalogContextType = {
  items: CatalogueItem[];
  getItemById: (id: string) => CatalogueItem | undefined;
};

const catalogueItems: CatalogueItem[] = [
  {
    id: 'nebula-one',
    name: 'Nebula One',
    tagline: 'Bio-synthetic habitat for orbital teams',
    location: 'Lunar Gateway, Moon Orbit',
    price: '98,000',
    status: 'Available',
    units: '12 left',
    soldCount: 28,
    category: 'Habitat',
    description:
      'A compact orbital suite designed for rapid deployment and immersive command control, wrapped in a metallic aurora shell.',
    cover:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'quantum-vault',
    name: 'Quantum Vault',
    tagline: 'Secure asset vault with adaptive neon shielding',
    location: 'Berlin, Germany',
    price: '42,500',
    status: 'Sold',
    units: '0 left',
    soldCount: 54,
    category: 'Security',
    description:
      'A futurist vault system that uses quantum-resistant locks, gesture controls, and atmospheric pulse trailing.',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aurora-grid',
    name: 'Aurora Grid',
    tagline: 'Urban energy network for smart districts',
    location: 'Seoul, South Korea',
    price: '67,400',
    status: 'Available',
    units: '9 left',
    soldCount: 46,
    category: 'Infrastructure',
    description:
      'A modular energy mesh engineered for cityscapes, delivering adaptive lighting, storage, and AI-driven demand balancing.',
    cover:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'vector-edge',
    name: 'Vector Edge',
    tagline: 'Wearable projection interface for field agents',
    location: 'San Francisco, USA',
    price: '12,900',
    status: 'Available',
    units: '34 left',
    soldCount: 32,
    category: 'Wearable',
    description:
      'A fusion of ultra-thin optics and haptic feedback that keeps critical dashboards visible in any environment.',
    cover:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'pulse-arc',
    name: 'Pulse Arc',
    tagline: 'Mobile drone charging hub with plasma cores',
    location: 'Dubai, UAE',
    price: '28,200',
    status: 'Sold',
    units: '0 left',
    soldCount: 82,
    category: 'Mobility',
    description:
      'A compact charging node built for drones and light vehicles, with smart routing and corrosive-resistant framing.',
    cover:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cypher-lens',
    name: 'Cypher Lens',
    tagline: 'Augmented reality scanning eyewear',
    location: 'Tokyo, Japan',
    price: '5,600',
    status: 'Available',
    units: '20 left',
    soldCount: 21,
    category: 'Hardware',
    description:
      'Precision AR lenses that overlay data streams directly onto user sightlines with minimal glare and high durability.',
    cover:
      'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?auto=format&fit=crop&w=1200&q=80',
  },
];

const CatalogContext = createContext<CatalogContextType | null>(null);

export const CatalogProvider = ({ children }: { children: React.ReactNode }) => {
  const getItemById = (id: string) => catalogueItems.find((item) => item.id === id);

  return (
    <CatalogContext.Provider value={{ items: catalogueItems, getItemById }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
