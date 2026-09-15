import { useEffect, useState } from 'react';
import { ArrowRight, BellRing, CalendarDays, X } from 'lucide-react';
import { Navbar } from './Navbar';
import { ListModal } from './Modal';
import ScrollToTop from '../constants/scrollToTop';
import type { Announcement } from '../data/announcements';
import { useWebData } from '../contexts/webData';
import supabase from '../supabaseClient';

type AnnouncementModalProps = {
  isOpen: boolean;
  announcement: Announcement | null;
  announcements?: Announcement[];
  onClose: () => void;
  onSelect?: (announcement: Announcement) => void;
};

export function AnnouncementModal({
  isOpen,
  announcement,
  announcements = [],
  onClose,
  onSelect,
}: AnnouncementModalProps) {
  return (
    <ListModal
      isOpen={isOpen}
      selectedItem={announcement}
      contentArray={announcements}
      onClose={onClose}
      onSelect={onSelect}
      ariaLabelledBy="announcement-title"
      itemLabel="announcement"
    >
      {announcement && (
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close announcement"
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <BellRing className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{announcement.eyebrow}</p>
          <h2 id="announcement-title" className="mt-2 pr-8 text-2xl font-bold leading-tight text-slate-950">{announcement.title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">{announcement.content}</p>
          {Object.entries(announcement.meta).length > 0 && (
            <div className="mt-5 flex flex-col gap-2">
              {Object.entries(announcement.meta).map(([key, value]) => (
                <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {(Number(key) + 1)}. {value}
                </span>
              ))}
            </div>
          )}
          <div className="my-6 flex items-center gap-2 text-xs font-medium text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {announcement.date}
          </div>
        </div>
      )}
    </ListModal>
  );
}

export function AnnouncementsPage() {
  const { webName } = useWebData();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')

      if (error) {
        if (isMounted) {
          setAnnouncements([]);
          setLoading(false);
        }
        return;
      }

      if (isMounted) {
        setAnnouncements(data.map((item) => ({
          id: String(item.id),
          eyebrow: item.eyebrow || 'Update',
          title: item.title || 'Announcement',
          summary: item.summary || item.content || '',
          content: item.content || item.summary || '',
          date: item.date || (item.created_at ? new Date(item.created_at).toLocaleDateString() : ''),
          meta: item.meta && typeof item.meta === 'object' ? item.meta as Record<string, string> : {},
        })));
        setLoading(false);
      }
    }

    fetchAnnouncements();

    return () => {
      isMounted = false;
    };
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <ScrollToTop />
      <main className="mx-auto max-w-4xl px-4 pb-16 pt-16 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-600">From the team</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Announcements</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">The latest news, community updates, and product notes from {webName || 'our team'}.</p>
        </header>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm" role="status">
            <p className="text-base font-medium text-slate-700">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center" role="status">
            <p className="text-base font-medium text-slate-700">No announcements available.</p>
            <p className="mt-2 text-sm text-slate-500">Check back later for the latest updates.</p>
          </div>
        ) : (
          <section className="grid gap-4 sm:grid-cols-2" aria-label="Announcements">
            {announcements.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedAnnouncement(item)}
                className={`group text-left ${index === 0 ? 'sm:col-span-2' : ''}`}
              >
                <article className="h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{item.eyebrow}</span>
                      <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                    <h2 className="mt-4 text-xl font-bold text-slate-950">{item.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{item.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700">Read announcement <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
                  </div>
                </article>
              </button>
            ))}
          </section>
        )}
      </main>
      <AnnouncementModal
        isOpen={selectedAnnouncement !== null}
        announcement={selectedAnnouncement}
        announcements={announcements}
        onClose={() => setSelectedAnnouncement(null)}
        onSelect={setSelectedAnnouncement}
      />
    </div>
  );
}
