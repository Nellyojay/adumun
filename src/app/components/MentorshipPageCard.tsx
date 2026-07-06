import { BookOpen, Star } from "lucide-react";
import type { MentorshipData } from "../contexts/mentorshipContext";
import { getImageUrl } from "../constants/imageHandler";

export default function MentorshipPageCard(mentorship: MentorshipData) {

  return (
    <div className="gallery-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">

      {/* Mentor Image */}
      <div className="aspect-video bg-linear-to-br from-blue-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {mentorship.image_url ? (
            <img
              src={getImageUrl(mentorship.image_url) || undefined}
              alt="mentorship banner"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <BookOpen className="w-16 h-16 text-white opacity-50" />
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2">
        <div>
          <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-600 text-xs rounded-full mb-2">
            {mentorship.category}
          </span>
          <h3 className="text-lg group-hover:text-blue-600 transition-colors">
            {mentorship.topic}
          </h3>
        </div>

        <p className="text-gray-600 text-sm mb-2 line-clamp-3">
          {mentorship.description}
        </p>

        {/* Mentor Info */}
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
          <img
            src={getImageUrl(mentorship.users.profile_image) || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
            alt={mentorship.users.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm">{mentorship.users.full_name}</p>
            <p className="text-xs text-gray-500">Mentor</p>
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{mentorship.avg_rating || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
