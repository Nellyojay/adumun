export type Announcement = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  accent: string;
};

export const localAnnouncements: Announcement[] = [
  {
    id: 'welcome-to-adumun',
    eyebrow: 'Product update',
    title: 'Welcome to the new experience',
    summary: 'A simpler place to discover businesses, share ideas, and find your next opportunity.',
    content: 'Explore the feed, follow interesting businesses, and use mentorship pages to connect with people building the future.',
    date: 'September 12, 2026',
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    id: 'mentorship-pages',
    eyebrow: 'Community',
    title: 'Mentorship pages are now live',
    summary: 'Share your experience or find practical guidance from someone a few steps ahead.',
    content: 'Mentors can create a page with their focus areas, while members can browse opportunities and start meaningful conversations.',
    date: 'September 8, 2026',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    id: 'listings-refresh',
    eyebrow: 'Coming soon',
    title: 'A better way to showcase your products',
    summary: 'Listings are getting a fresh layout designed for browsing and sharing.',
    content: 'We are polishing listings, product details, and discovery so your work gets the attention it deserves.',
    date: 'September 2, 2026',
    accent: 'from-amber-500 to-orange-400',
  },
];
