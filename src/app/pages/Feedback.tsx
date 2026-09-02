import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, MessageSquare, Star, CheckCircle } from 'lucide-react';
import { useWebData } from '../contexts/webData';
import { useAuth } from '../contexts/authContext';
import supabase from '../supabaseClient';
import { useUserData } from '../contexts/userDataContext';
import { formatDate } from '../constants/dateFormat';
import SuccessMessage from '../components/SuccessMessage';
import ScrollToTop from '../constants/scrollToTop';

interface FeedbackMessage {
  id: number;
  author: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  created_at: string;
}

export function Feedback() {
  const { webName } = useWebData();
  const { user } = useAuth();
  const { currentUser } = useUserData();
  const [loading, setLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackMessage[]>([]);
  const [formData, setFormData] = useState({
    author: currentUser?.full_name || '',
    email: user?.email || '',
    rating: 5,
    category: 'General Feedback',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching feedback:', error);
        return;
      }
      if (data) {
        setFeedbackList(data);
      }
    };

    fetchFeedback();
  }, [feedbackList.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) return;

    if (formData.message.length < 10) {
      alert('Please enter a message with at least 10 characters.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        author: formData.author,
        email: formData.email,
        rating: formData.rating,
        category: formData.category,
        message: formData.message,
        user_id: currentUser?.id || null
      })
      .select()
      .single();

    if (error) {
      alert('There was an error submitting your feedback. Please try again later.');
      setLoading(false);
      return;
    }

    if (!data) {
      alert('There was an error submitting your feedback. Please try again later.');
      setLoading(false);
      return;
    }

    setFeedbackList([data, ...feedbackList]);
    setFormData({
      author: currentUser?.full_name || '',
      email: user?.email || '',
      rating: 5,
      category: 'General Feedback',
      message: ''
    });
    setSubmitted(true);
    setLoading(false);

    // Reset success message after 6 seconds
    setTimeout(() => setSubmitted(false), 6000);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${star <= rating
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      <ScrollToTop />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 primary-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Share Your Feedback
          </h1>
          <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
            Help us improve {webName}! Your feedback is valuable and helps us create a better platform for both entrepreneurs and users.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Feedback</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback Category *
                  </label>
                  <select
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                  >
                    <option value="General Feedback">General Feedback</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="User Experience">User Experience</option>
                    <option value="Content Suggestion">Content Suggestion</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rate Your Experience *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        title={`Rate ${star} stars`}
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${star <= formData.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300 hover:text-yellow-300'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.rating === 5 && 'Excellent!'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 1 && 'Needs Improvement'}
                  </p>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    placeholder={`Tell us what you think about ${webName}...`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent resize-none"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Minimum 10 characters ({formData.message.length}/10)
                  </p>
                </div>

                {/* Success Message */}
                {submitted ? (
                  <SuccessMessage
                    header='Thank you for your feedback.'
                    message='Your message has been submitted successfully.'
                    error={!submitted}
                  />
                ) : loading ? (
                  <p
                    className="w-full primary-bg primary-bg-hover text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <span>Submitting...</span>
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={formData.message.length < 10}
                    className="w-full primary-bg primary-bg-hover text-white py-4 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </button>
                )}

              </form>
            </div>
          </div>

          {/* Feedback Stats & Info */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="primary-gradient rounded-2xl shadow-md p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Community Feedback</h3>
              <div className="space-y-4">
                <div>
                  <p className="primary-light-color text-sm mb-1">Total Feedback</p>
                  <p className="text-3xl font-bold">{feedbackList.length}</p>
                </div>
                <div>
                  <p className="primary-light-color text-sm mb-1">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-3xl font-bold">
                      {feedbackList.length > 0 ? (feedbackList.reduce((acc, f) => acc + f.rating, 0) / feedbackList.length).toFixed(1) : '0.0'}
                    </p>
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Why Your Feedback Matters</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Helps us improve the platform for everyone</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Guides our development priorities</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Shapes the future of {webName}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Ensures we meet your needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Feedback Section */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Feedback</h2>
            <p className="text-gray-600">See what others are saying about {webName}</p>
          </div>

          {feedbackList.length === 0 ? (
            <p className="text-gray-500 border border-gray-300 rounded-lg p-4 shadow-sm text-center">
              No feedback available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbackList.map((feedback) => (
                <div
                  key={feedback.id}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center text-white font-semibold">
                        {feedback.author[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{feedback.author}</p>
                        <p className="text-xs text-gray-500">{formatDate(feedback.created_at, false)}</p>
                      </div>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>

                  {/* Category Badge */}
                  <span className="inline-block text-xs primary-soft-bg primary-soft-color px-3 py-1 rounded-full mb-3">
                    {feedback.category}
                  </span>

                  {/* Message */}
                  <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
