import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../contexts/authContext';
import { useWebData } from '../contexts/webData';
import ScrollToTop from '../constants/scrollToTop';
import { HelpCircle, ChevronLeft, Mail, ShieldCheck, MessageSquare, Clock3 } from 'lucide-react';

export function HelpCenter() {
  const navigate = useNavigate();
  const { webName } = useWebData();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const helpArticles = [
    {
      title: 'Account basics',
      description: 'Learn how to update your profile, change your password, and manage your account settings.',
      tag: 'Getting Started',
      tagClass: 'primary-color',
      icon: HelpCircle,
      iconBg: 'primary-soft-bg',
      iconClass: 'primary-color',
    },
    {
      title: 'Protect your data',
      description: 'Find out how to keep your account secure with passwords, verification, and privacy settings.',
      tag: 'Security',
      tagClass: 'text-green-600',
      icon: ShieldCheck,
      iconBg: 'bg-green-50',
      iconClass: 'text-green-600',
    },
    {
      title: 'Contact customer support',
      description: 'Submit feedback or ask questions directly through our support form.',
      tag: 'Support',
      tagClass: 'text-indigo-600',
      icon: MessageSquare,
      iconBg: 'bg-indigo-50',
      iconClass: 'text-indigo-600',
    },
    {
      title: 'Latest product news',
      description: `See what's new at ${webName} and learn about upcoming features before anyone else.`,
      tag: 'Updates',
      tagClass: 'text-amber-600',
      icon: Clock3,
      iconBg: 'bg-amber-50',
      iconClass: 'text-amber-600',
    },
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to the Change Password page in Settings and confirm your current password to update it securely.',
    },
    {
      question: 'How can I delete my account?',
      answer: 'Use the Manage Account page to deactivate or delete your account safely.',
    },
    {
      question: 'Where can I send feedback?',
      answer: 'Use our feedback form to share ideas or report issues. We review every message carefully.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showAuth={false} />
      <ScrollToTop />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Go back"
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <p className="text-sm primary-color font-semibold uppercase tracking-wide">Help Center</p>
            <h1 className="text-3xl font-bold text-gray-900">How can we help you?</h1>
            <p className="mt-2 text-sm text-gray-600">Browse support articles and contact our team if you need additional assistance.</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 mb-8">
          {helpArticles.map((article) => {
            const Icon = article.icon;
            return (
              <article key={article.title} className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${article.iconBg} rounded-2xl p-3`}>
                    <Icon className={`w-5 h-5 ${article.iconClass}`} />
                  </div>
                  <span className={`text-xs font-semibold uppercase ${article.tagClass}`}>{article.tag}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h2>
                <p className="text-sm text-gray-600">{article.description}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently asked questions</h2>
            <dl className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-1 text-sm text-gray-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-indigo-50 p-3">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Still need help?</h2>
                <p className="text-sm text-gray-600">Send us a message and our support team will get back to you as soon as possible.</p>
              </div>
            </div>
            <Link
              to="/feedback"
              className="inline-flex items-center justify-center rounded-full primary-bg px-5 py-3 text-sm font-medium text-white primary-bg-hover transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
