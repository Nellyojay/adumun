import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar"
import { PostCard } from "../components/PostCard";
import { useStartup } from "../contexts/StartupProfileContext";
import Loader from "../constants/loader";
import { BUSINESS_PERSONNEL_ROLE, MENTOR_ROLE, normalizeUserRoles, useUserData, } from "../contexts/userDataContext";
import { Link } from "react-router-dom";
import { getImageUrl } from "../constants/imageHandler";
import { useAuth } from "../contexts/authContext";
import { useMentorshipData } from "../contexts/mentorshipContext";

function PostFeed() {
  const { session } = useAuth();
  const { currentUser } = useUserData();
  const { mentorshipData } = useMentorshipData();
  const { loadingPosts, posts, handleDeletePost, fetchStartupPosts, startupData } = useStartup();

  const [visibleCount, setVisibleCount] = useState(10);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentUserRoles = normalizeUserRoles(currentUser?.user_roles);
  const userStartups = startupData?.filter(s => s.user_id === currentUser?.id);
  const userMentorshipPages = mentorshipData?.filter(m => m.users?.id === currentUser?.id)

  if (loadingPosts || !posts || !mentorshipData) {
    return <Loader />
  }

  useEffect(() => {
    fetchStartupPosts();
  }, [])

  const displayedPosts = posts?.slice(0, visibleCount);

  useEffect(() => {
    if (loadingPosts || displayedPosts.length >= posts?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 10, posts?.length));
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [posts?.length, displayedPosts.length, loadingPosts]);

  return (
    <div className="bg-gray-200 min-h-screen pt-12">
      <Navbar showSearch={true} />

      <div className="max-w-6xl mx-auto pt-3 sm:pt-1 pb-20 grid grid-cols-12 gap-2">

        <div className="sticky top-12 h-fit hidden sm:block col-span-12 sm:col-span-3 space-y-2">

          <div className="bg-white rounded-md shadow-sm p-4">
            {session ? (
              <Link
                to={`/profile/${currentUser?.id}`}
                className="flex flex-col items-center justify-center"
              >
                <img
                  src={getImageUrl(currentUser?.profile_image) || 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
                  alt="Profile-image"
                  className="max-w-32 max-h-32 rounded-lg object-cover"
                />
                <p className="font-semibold text-lg">{currentUser?.full_name}</p>
              </Link>
            ) : (
              <Link
                to={'/login'}
                className="flex flex-col items-center justify-center"
              >
                <img
                  src={'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?semt=ais_incoming&w=740&q=80'}
                  alt="Profile-image"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <p className="font-semibold text-gray-500 text-center">Sign in to view profile</p>
              </Link>
            )}
          </div>

          {session && (currentUserRoles.includes(BUSINESS_PERSONNEL_ROLE) || currentUserRoles.includes(MENTOR_ROLE)) && (
            <div className="bg-white rounded-md shadow-sm p-4 space-y-2">
              <p className="font-semibold">My Businesses ({userStartups?.length})</p>

              {(userStartups?.length ?? 0) > 0 ? (
                <>
                  {userStartups?.map(s => (
                    <Link
                      to={`/startup/${s.id}`}
                      className="line-clamp-1 text-xs text-gray-500 hover:underline"
                    >
                      {s.name}
                    </Link>
                  ))}
                </>
              ) : null}

              <p className="font-semibold">My Mentorships ({userMentorshipPages?.length})</p>

              {(userMentorshipPages?.length ?? 0) > 0 ? (
                <>
                  {userMentorshipPages?.map(m => (
                    <Link
                      to={`/mentorship-page/${m.id}`}
                      className="line-clamp-1 text-xs text-gray-500 hover:underline"
                    >
                      {m.topic}
                    </Link>
                  ))}
                </>
              ) : null}

            </div>
          )}

        </div>

        <div className="col-span-12 sm:col-span-5">
          {!loadingPosts && displayedPosts.length > 0 ? (
            <div className="gallery-grid grid grid-cols-1 gap-1">
              {displayedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  deletePost={() => handleDeletePost(post.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-sm p-4 text-center">
              <p className="text-gray-500">Visit your Business page and start sharing updates using posts.</p>
            </div>
          )}

          <div ref={loadMoreRef} className="h-4" />
          {displayedPosts.length < posts?.length && (
            <div className="text-center text-gray-500 mt-3 mb-4">Loading more posts...</div>
          )}
        </div>

        <div className="sticky top-12 h-fit hidden sm:block col-span-12 sm:col-span-4 space-y-2">

          <div className="bg-white rounded-md shadow-sm p-4">
            <p className="font-semibold">Trending Businesses</p>
            <p className="text-gray-500">Coming soon!</p>
          </div>

          <div className="bg-white rounded-md shadow-sm p-4">
            <p className="font-semibold">Suggested Connection</p>
            <p className="text-gray-500">Coming soon!</p>
          </div>

          <div className="bg-white rounded-md shadow-sm p-4">
            <p className="font-semibold">Events</p>
            <p className="text-gray-500">Coming soon!</p>
          </div>

        </div>

      </div>

    </div>
  )
}

export default PostFeed;