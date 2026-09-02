import { BookOpen } from "lucide-react";
import { getImageUrl } from "../constants/imageHandler";

interface MentorHeaderProps {
  topic: string | undefined;
  imageUrl: string | null | undefined;
  description: string | undefined;
}

export function MentorHeader({ topic, imageUrl, description }: MentorHeaderProps) {
  return (
    <div className="relative bg-gray-900 text-white py-8 px-4 md:py-12">
      <img
        src={getImageUrl(imageUrl) || ' https://user-images.githubusercontent.com/237508/90246627-ecbda400-de2c-11ea-8bfb-b4307bfb975d.png'}
        alt="mentorship-header"
        className="w-full h-full object-cover absolute top-0 left-0 opacity-20"
      />
      <div className="relative max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 md:w-10 md:h-10" />
          <h1 className="text-2xl md:text-4xl">{topic}</h1>
        </div>
        <p className="primary-light-color text-sm md:text-base max-w-3xl">
          {description}
        </p>
      </div>
    </div>
  );
}
