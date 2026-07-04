import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useMentorshipData } from "../contexts/mentorshipContext";
import { useAuth } from "../contexts/authContext";
import supabase from "../supabaseClient";
import SuccessMessage from "../components/SuccessMessage";
import { FOLDER, imageHandlerService } from "../constants/imageHandler";
import { useUserData } from "../contexts/userDataContext";
import ScrollToTop from "../constants/scrollToTop";

export default function EditMentorship() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { mentorshipData } = useMentorshipData();
  const { session } = useAuth();
  const { currentUser } = useUserData();

  const editingData = mentorshipData?.find(m => m.id === id)

  const [formData, setFormData] = useState({
    topic: editingData?.topic,
    category: editingData?.category,
    description: editingData?.description,
    mentorTitle: editingData?.mentor_title,
    location: editingData?.location,
    bio: editingData?.mentorship_bio,
    experience: editingData?.experience,
    imageUrl: null as File | null,
  });
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  const dismissSelectedImage = () => setFormData({ ...formData, imageUrl: null })

  useEffect(() => {
    setFormData({
      topic: editingData?.topic,
      category: editingData?.category,
      description: editingData?.description,
      mentorTitle: editingData?.mentor_title,
      location: editingData?.location,
      bio: editingData?.mentorship_bio,
      experience: editingData?.experience,
      imageUrl: null,
    })
  }, [id])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !session) return;
    setSaving(true);
    setErrorMessage('');

    const { data, error } = await supabase
      .from('mentorship_page')
      .update({
        topic: formData?.topic,
        category: formData?.category,
        description: formData?.description,
        mentor_title: formData?.mentorTitle,
        location: formData?.location,
        mentorship_bio: formData?.bio,
        experience: formData?.experience,
      })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      setSaving(false)
      setErrorMessage("Error updating data, please try again.")
      return;
    }

    if (formData.imageUrl) {
      const updatedDisplayImage = await imageHandlerService.cloudinaryImageUploader(
        formData.imageUrl,
        FOLDER.MENTORSHIP_BANNER,
        currentUser?.id || '',
        undefined,
        undefined,
        editingData?.id
      );

      if (!updatedDisplayImage) {
        setErrorMessage('Failed to update banner image, please try again.');
        setSaving(false);
        return;
      }

    }

    setSaving(false)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        topic: '',
        category: '',
        description: '',
        mentorTitle: '',
        location: '',
        bio: '',
        experience: '',
        imageUrl: null,
      })
      navigate(`/mentorship-page/${data.id}`)
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Header */}
      <div className="bg-blue-600 text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl">Edit Mentorship</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mentorship</span>
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
                    Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    name="topic"
                    required
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Web Development Mentorship"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Web Development Mentorship"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Brief description of what students will learn..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                      Title
                    </label>
                    <input
                      type="text"
                      id="mentorTitle"
                      name="mentorTitle"
                      required
                      value={formData.mentorTitle}
                      onChange={handleChange}
                      placeholder="e.g., Senior Full-Stack Developer"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="City, State/Country"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm mb-2 text-gray-700"
                    >
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g., 10+ years"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm mb-2 text-gray-700"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    required
                    value={formData.bio}
                    onChange={handleChange}
                    rows={8}
                    placeholder="Tell students about your background, expertise, and what you're passionate about..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <label className="block text-sm text-gray-700">
                  Mentorship Banner
                  {formData.imageUrl ? (
                    <div className="w-full flex items-start gap-1">
                      <img
                        src={formData.imageUrl ? URL.createObjectURL(formData.imageUrl) : undefined}
                        alt="Cover"
                        className="w-full h-full rounded-lg object-cover"
                      />
                      <button
                        className='justify-end bg-blue-100 rounded-full border-none cursor-pointer'
                        onClick={dismissSelectedImage}
                      >
                        <X className="text-red-500 font-bold text-3xl hover:text-red-300" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        id="images"
                        name="imageUrl"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                      <label htmlFor="images" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">Click to upload images</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </label>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          {errorMessage && (
            <p className="mt-4 text-red-600">{errorMessage}</p>
          )}

          {/* Action Buttons */}
          {submitted ? (
            <SuccessMessage
              header="Page data updated successfully!"
              message={null}
              error={false}
            />
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
