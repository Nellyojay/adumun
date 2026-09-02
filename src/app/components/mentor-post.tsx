import { Clock, MessageCircle, ThumbsUp, Play } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MentorPostProps {
  title: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  mediaType?: "image" | "video";
  mediaUrl?: string;
}

export function MentorPost({
  title,
  content,
  date,
  likes,
  comments,
  mediaType,
  mediaUrl,
}: MentorPostProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Media Section */}
      {mediaUrl && mediaType === "image" && (
        <div className="w-full aspect-video bg-gray-100">
          <ImageWithFallback
            src={mediaUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {mediaUrl && mediaType === "video" && (
        <div className="w-full aspect-video bg-gray-900 relative group">
          <video
            className="w-full h-full object-cover"
            controls
            preload="metadata"
          >
            <source src={mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <Play className="w-16 h-16 text-white" />
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-4 md:p-6">
        <h3 className="text-lg md:text-xl mb-2">{title}</h3>
        <p className="text-gray-700 text-sm md:text-base mb-4">{content}</p>

        <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{date}</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 primary-color-hover transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 primary-color-hover transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}