import { MapPin, Award, Star } from "lucide-react";
import { getImageUrl } from "../constants/imageHandler";
import { Link } from "react-router-dom";
import { RateMentorship } from "./Popup";
import type { SetStateAction } from "react";
import { useAuth } from "../contexts/authContext";

interface MentorProfileProps {
  name: string | undefined;
  userId: string | undefined;
  title: string | undefined;
  location: string | undefined;
  imageUrl: string | undefined;
  bio: string | undefined;
  experience: string | undefined;
  rating: number | undefined;
  openRatings: boolean;
  setOpenRatings: React.Dispatch<SetStateAction<boolean>>;
  setRated: React.Dispatch<SetStateAction<number>>;
  handleRating: () => void;
  rateErr: boolean;
  submitted: boolean;
}

export function MentorProfile({
  name,
  userId,
  title,
  location,
  imageUrl,
  bio,
  experience,
  rating,
  openRatings,
  setOpenRatings,
  setRated,
  handleRating,
  rateErr,
  submitted
}: MentorProfileProps) {
  const { session } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Profile Image */}
        <div className="shrink-0 flex items-start justify-between">
          <Link
            to={`/profile/${userId}`}
          >
            <img
              src={getImageUrl(imageUrl) || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80"}
              alt={name}
              className="max-w-32 max-h-32 rounded-lg object-cover"
            />
          </Link>

          {/* Stats for mobile */}
          <div className="md:hidden relative flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 primary-color" />
              <div>
                <p className="text-xs text-gray-500">Experience</p>
                <p className="text-sm">{experience}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setOpenRatings(!openRatings)
                setRated(0)
              }}
              disabled={!session}
              className="flex items-center gap-2 cursor-pointer active:bg-gray-200 p-2 rounded-lg transition-colors"
            >
              <Star className="w-5 h-5 primary-color" />
              <div>
                <p className="text-xs text-gray-500">Rating</p>
                <p className="text-sm">{rating || 0}/5.0</p>
              </div>

            </button>
            {openRatings && (
              <RateMentorship
                setRated={setRated}
                onClick={handleRating}
                rateErr={rateErr}
                submitted={submitted}
              />
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="mb-3">
            <div className="flex justify-between">
              <Link
                to={`/profile/${userId}`}
                className="text-xl md:text-2xl mb-1"
              >{name}</Link>

              {/* Stats for desktop */}
              <div className="relative flex gap-8 not-md:hidden">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 primary-color" />
                  <div>
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="text-sm">{experience}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setOpenRatings(!openRatings)
                    setRated(0)
                  }}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
                >
                  <Star className="w-5 h-5 primary-color" />
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-sm">{rating || 0}/5.0</p>
                  </div>

                </button>
                {openRatings && (
                  <RateMentorship
                    setRated={setRated}
                    onClick={handleRating}
                    rateErr={rateErr}
                    submitted={submitted}
                  />
                )}
              </div>
            </div>
            <p className="primary-color text-sm md:text-base mb-2">{title}</p>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>

          <p className="text-gray-700 mb-4 text-sm md:text-base">{bio}</p>

        </div>
      </div>
    </div>
  );
}
