import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/authContext';
import { useUserData } from '../contexts/userDataContext';
import supabase from '../supabaseClient';
import Loader from '../constants/loader';
import { useStartup } from '../contexts/StartupProfileContext';
import { getImageUrl } from '../constants/imageHandler';
import { Search } from 'lucide-react';

export function FollowingStartups() {
  const { user } = useAuth();
  const { userData, currentUser } = useUserData();
  const { startupData } = useStartup();
  const [searchTerm, setSearchTerm] = useState('');
  const [followingStartupIds, setFollowingStartupIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const followedStartups = startupData?.filter((s) => followingStartupIds.includes(s.id)) || [];
  const filteredStartups = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return followedStartups;
    return followedStartups.filter((startup) =>
      startup.name.toLowerCase().includes(query) ||
      startup.founder_name.toLowerCase().includes(query),
    );
  }, [followedStartups, searchTerm]);

  const userId = userData?.id || user?.id;
  useEffect(() => {
    const fetchFollowing = async () => {
      if (!userId) {
        setFollowingStartupIds([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from('follows')
        .select('startup_id')
        .eq('user_id', userId);

      if (error) {
        setError(error.message || 'Failed to load followed startups.');
        setLoading(false);
        return;
      }

      const startupIds = (data || []).map((item: { startup_id: string }) => item.startup_id);

      if (startupIds.length === 0) {
        setFollowingStartupIds([]);
        setLoading(false);
        return;
      }

      setFollowingStartupIds(startupIds);
      setLoading(false);
    };

    void fetchFollowing();
  }, [userId]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-20">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-2">
          <h1 className="text-lg md:text-2xl font-bold">Following Businesses</h1>
          <p className="text-gray-500 not-md:text-xs">
            This page shows all businesses you are currently following.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-6">{error}</div>
        )}

        <div className="mb-2 gap-2 w-full flex not-md:text-sm rounded-xl border border-gray-300 shadow-sm px-4 py-2">
          <Search className="inline-block w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search followed businesses"
            className='w-full focus:outline-none focus:ring-0 focus:border-transparent'
          />
        </div>

        {followedStartups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-500">No Businesses followed yet.</p>
            {currentUser?.id === userId && (
              <Link to="/feed" className="mt-3 inline-block primary-color hover:underline">
                Explore businesses to follow
              </Link>
            )}
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-500">No businesses match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStartups.map((startup) => (
              <Link
                key={startup.id}
                to={`/startup/${startup.id}`}
                className="flex items-center gap-4 p-2 border-l-4 border-gray-400 rounded-xl bg-white shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <img
                  src={getImageUrl(startup.display_image) || 'https://user-images.githubusercontent.com/237508/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png'}
                  alt={startup.name}
                  className="w-12 h-12 object-cover rounded-full"
                />
                <div>
                  <h2 className="text-base font-semibold text-gray-900 truncate">{startup.name}</h2>
                  <h2 className="text-sm text-gray-500">Founder: {startup.founder_name}</h2>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
