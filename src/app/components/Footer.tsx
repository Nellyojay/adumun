import { Link } from 'react-router';
import { useWebData } from '../contexts/webData';

export function Footer() {
  const { webName } = useWebData();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">{webName.charAt(0).toLocaleUpperCase()}</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">{webName}</span>
            </div>
            <p className="text-gray-600 max-w-md">
              Empowering entrepreneurs to showcase their startups and businesses and connect with supporters worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/feed" className="text-gray-600 primary-color-hover transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 primary-color-hover transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2026 {webName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}