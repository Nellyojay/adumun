import { Link } from 'react-router';
import type { StartupData } from '../contexts/StartupProfileContext';
import { useUserData } from '../contexts/userDataContext';
import { getImageUrl } from '../constants/imageHandler';

export interface Startup {
  id: number;
  name: string;
  founder: string;
  description: string;
  image: string;
  category: string;
  likes: number;
  comments: number;
  verified: boolean;
}

interface StartupCardProps {
  startup: StartupData;
  userId: string;
}

export function StartupCard({ startup, userId }: StartupCardProps) {
  const { setSelectedProfile } = useUserData();
  return (
    <div className="gallery-card bg-white rounded-lg shadow-sm overflow-hidden md:hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
      {/* Startup Image */}
      <Link
        to={`/startup/${startup.id}`}
      >
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(startup.cover_image) || 'https://user-images.githubusercontent.com/237508/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png'}
            alt={startup.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link
              to={`/startup/${startup.id}`}
              onClick={() => setSelectedProfile(userId)}
            >
              <h3
                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
              >
                {startup.name}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-1">
              <Link
                to={`/profile/${userId}`}
                className="text-sm text-gray-600 md:hover:text-blue-600"
                onClick={() => setSelectedProfile(userId)}
              >
                by {startup.founder_name}
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-3">
          {startup.intro_description}
        </p>

        {/* Interaction Buttons */}
        <div className="pt-2 border-t border-gray-100">
          <Link
            to={`/startup/${startup.id}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}