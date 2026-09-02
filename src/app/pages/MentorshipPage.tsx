import { useNavigate, useParams } from "react-router-dom";
import { MentorHeader } from "../components/mentor-header";
import { MentorProfile } from "../components/mentor-profile";
import { ArrowLeft, Edit, Plus } from "lucide-react";
import ScrollToTop from "../constants/scrollToTop";
import { useMentorshipData } from "../contexts/mentorshipContext";
import { PostCard } from "../components/PostCard";
import { useStartup } from "../contexts/StartupProfileContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/authContext";
import { useUserData } from "../contexts/userDataContext";
import Loader from "../constants/loader";
import supabase from "../supabaseClient";

export default function MentorshipPage() {

  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { currentUser } = useUserData();
  const { mentorshipData } = useMentorshipData();
  const { posts, handleDeletePost, fetchStartupPosts } = useStartup();

  const [openRatings, setOpenRatings] = useState(false);
  const [rated, setRated] = useState<number>(0);
  const [submittedRating, setSubmittedRating] = useState(false);
  const [rateErr, setRateErr] = useState(false);

  const pageData = mentorshipData?.find(m => m.id === id)
  const mentorshipPosts = posts.filter(p => p.mentorship_id === id)
  const isOwner = Boolean(currentUser?.auth_id === user?.id && pageData?.users?.id === currentUser?.id)

  useEffect(() => {
    fetchStartupPosts();
  }, [id, posts]);

  const handleRating = async () => {
    if (rated === 0) {
      const { error: deleteErr } = await supabase
        .from('mentorship_rating')
        .delete()
        .eq('user_id', currentUser?.id)
        .eq('mentorship_id', pageData?.id)

      if (deleteErr) {
        setRateErr(true)
        return;
      }

      setSubmittedRating(true);
      setTimeout(() => {
        setOpenRatings(false);
        setSubmittedRating(false)
      }, 3000);
      return;
    };

    const { data: userRated } = await supabase
      .from('mentorship_rating')
      .select('id')
      .eq('user_id', currentUser?.id)
      .eq('mentorship_id', pageData?.id)
      .maybeSingle();

    if (userRated && rated !== 0) {
      const { error: updateErr } = await supabase
        .from('mentorship_rating')
        .update({ rating: rated })
        .eq('user_id', currentUser?.id)
        .eq('mentorship_id', pageData?.id)

      if (updateErr) {
        setRateErr(true);
        return;
      }

      setSubmittedRating(true);
      setTimeout(() => {
        setOpenRatings(false);
        setSubmittedRating(false)
      }, 3000);
      return;
    }

    const { error } = await supabase
      .from('mentorship_rating')
      .insert({
        user_id: currentUser?.id,
        mentorship_id: pageData?.id,
        rating: rated
      })
      .select()
      .single();

    if (error) {
      setRateErr(true);
      return;
    }

    setSubmittedRating(true);
    setTimeout(() => {
      setOpenRatings(false);
      setSubmittedRating(false)
    }, 3000);
  }

  if (!id || !posts || !pageData) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Header */}
      <MentorHeader
        topic={pageData?.topic}
        imageUrl={pageData?.image_url}
        description={pageData?.description}
      />

      <div className="flex justify-between items-center px-4 pt-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 primary-color primary-color-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {isOwner && (
          <button
            onClick={() => navigate(`/mentorship-page/${pageData?.id}/edit`)}
            className="flex justify-center items-center primary-color primary-color-hover border-2 primary-border primary-border-hover primary-soft-bg rounded-lg py-1 px-4 gap-2"
          >
            <Edit size={18} />
            <span>Edit page</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-1 py-4">
        {/* Mentor Profile */}
        <div className="mb-8">
          <MentorProfile
            name={pageData?.users?.full_name}
            userId={pageData?.users?.id}
            title={pageData?.mentor_title}
            location={pageData?.location}
            imageUrl={pageData?.users?.profile_image}
            bio={pageData?.mentorship_bio}
            experience={pageData?.experience}
            rating={pageData?.avg_rating}
            openRatings={openRatings}
            setOpenRatings={setOpenRatings}
            setRated={setRated}
            handleRating={handleRating}
            rateErr={rateErr}
            submitted={submittedRating}
          />
        </div>

        {/* Posts Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl">Recent Posts & Insights</h2>
            {isOwner && (
              <button
                onClick={() => navigate(`/mentorship-page/${id}/add-post`)}
                className="flex justify-center items-center primary-color primary-color-hover border-2 primary-border primary-border-hover primary-soft-bg rounded-lg py-1 px-4 font-medium gap-2"
              >
                <Plus size={18} />
                <span className="hidden md:block">Create post</span>
              </button>
            )}
          </div>

          <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {mentorshipPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                deletePost={() => handleDeletePost(post.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}