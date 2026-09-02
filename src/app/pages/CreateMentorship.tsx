import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, X } from "lucide-react";
import ScrollToTop from "../constants/scrollToTop";
import SuccessMessage from "../components/SuccessMessage";
import supabase from "../supabaseClient";
import { useUserData } from "../contexts/userDataContext";

export default function CreateMentorship() {
  const navigate = useNavigate();
  const { currentUser } = useUserData();
  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    topic: "",
    category: "",
    description: "",
    mentorTitle: "",
    location: "",
    bio: "",
    experience: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData) setErrorMessage("Please fill in all the necessary fields.");

    const { data, error } = await supabase
      .from('mentorship_page')
      .insert({
        user_id: currentUser?.id,
        category: formData.category,
        description: formData.description,
        topic: formData.topic,
        mentor_title: formData.mentorTitle,
        experience: formData.experience,
        mentorship_bio: formData.bio
      })
      .select()

    if (error) {
      setErrorMessage('Error submitting information, please try again.')
    } else {
      setSubmitted(true)
      setFormData({
        topic: "",
        category: "",
        description: "",
        mentorTitle: "",
        location: "",
        bio: "",
        experience: "",
      })

      setTimeout(() => {
        setSubmitted(false)
      }, 4000);
      console.log(data)
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Header */}
      <div className="primary-bg text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl">Create Mentorship Page</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 primary-color primary-color-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8"
        >
          <div className="space-y-6">
            {/* Topic Section */}
            <div>
              <h2 className="text-xl mb-4">Mentorship Details</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Sector of Discussion *
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Marketing in Agriculture"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Brief description of what students will learn..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Category * (Choose a definitive category for this topic.)
                  </label>
                  <input
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g. Agriculture"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus"
                  />
                </div>
              </div>
            </div>

            {/* Mentor Information */}
            <div>
              <h2 className="text-xl mb-4">Mentor Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="mentorTitle"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      id="mentorTitle"
                      name="mentorTitle"
                      required
                      value={formData.mentorTitle}
                      onChange={handleChange}
                      placeholder="e.g., Senior Full-Stack Developer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State/Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Years of Experience *
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 10+ years"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Bio *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell others about your background, expertise, and what you're passionate about in this specific category..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 primary-focus resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p>{errorMessage}</p>
          )}

          {/* Action Buttons */}
          {submitted ? (
            <SuccessMessage
              header="Created Successfully"
              message="Thank you for choosing to share your experience and knowledge"
              error={false}
            />
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-6 py-2.5 primary-bg text-white rounded-lg primary-bg-hover transition-colors flex items-center justify-center gap-2"
              >
                <span>Create Mentorship</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
