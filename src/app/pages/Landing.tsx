import { Link } from 'react-router';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Rocket, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useAuth } from '../contexts/authContext';
import Loader from '../constants/loader';

export function Landing() {
  const { session } = useAuth();
  const [webName, setWebName] = useState<string>('');

  const fetchWebName = async () => {
    const { data, error } = await supabase
      .from('changes')
      .select('web_name')
      .single();

    if (error) {
      return;
    } else {
      setWebName(data.web_name);
    }
  }

  useEffect(() => {
    fetchWebName();
  }, []);

  if (!webName) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar showAuth={true} />

      <div className='max-w-6xl mx-auto'>
        {/* Hero Section */}
        <section className="pt-32 md:pt-48 pb-20 px-4 sm:px-6 lg:px-8 h-screen">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Launch. Showcase.
              <span className="block primary-color text-transparent mt-2 pb-2">Grow your business.</span>
            </h1>
            <p className="md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {webName} is a platform where entrepreneurs, startups and business owners showcase their ideas, products and growing to the world.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="primary-bg primary-bg-hover text-white px-4 md:px-8 py-2 md:py-4 rounded-full  transition-all shadow-lg hover:shadow-xl text-lg font-medium"
              >
                Create Account
              </Link>
              <Link
                to="/feed"
                className="bg-white primary-color border-2 primary-border px-4 md:px-8 py-2 md:py-4 rounded-full primary-bg-hover transition-colors text-lg font-medium shadow-md hover:shadow-lg"
              >
                Explore Businesses
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50 rounded-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why {webName}?
              </h2>
              <p className="text-lg text-gray-600">
                The perfect platform to showcase and discover businesses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Launching a business?</h3>
                <p className="text-gray-600">
                  Get discovered by potential customers and investors and grow your startup business strategically with customer's or investor's opinions as building bricks.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Have an established business?</h3>
                <p className="text-gray-600">
                  Share your updates and build a community around your brand with comments, and direct support from fellow investors.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-md text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-linear-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow Your Business</h3>
                <p className="text-gray-600">
                  Connect with audiences and gain visibility. Allow reactions to your products and services from the business posts to help you grow accordingly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600">
                Get started in three simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 primary-gradient text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for free and set up your profile in minutes.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Post Your Startup</h3>
                <p className="text-gray-600">
                  Share your business story, products, and services with beautiful images.
                </p>
                <p className='text-gray-600'>
                  <strong>One user can have more than one business page.</strong>
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-linear-to-br from-green-600 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Discovered</h3>
                <p className="text-gray-600">
                  Connect with customers and grow your startup community
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id='for-who' className='py-20 bg-gray-50 mb-6 rounded-xl'>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Who It Is For
            </h2>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:grid grid-cols-4">
            <div className="text-center border border-gray-300 p-8 m-2 rounded-xl shadow-md md:hover:shadow-xl">
              <div className="w-8 h-8 bg-teal-600 opacity-60 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Entrepreneurs</h3>
              <p className="text-gray-600">
                People building new startups and ideas
              </p>
            </div>
            <div className="text-center border border-gray-300 p-8 m-2 rounded-xl shadow-md md:hover:shadow-xl">
              <div className="w-8 h-8 bg-teal-600 opacity-60 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Small business owners</h3>
              <p className="text-gray-600">
                Businesses looking for visibility and growth
              </p>
            </div>
            <div className="text-center border border-gray-300 p-8 m-2 rounded-xl shadow-md md:hover:shadow-xl">
              <div className="w-8 h-8 bg-teal-600 opacity-60 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovators and Creators</h3>
              <p className="text-gray-600">
                Individuals launching products, services or projects
              </p>
            </div>
            <div className="text-center border border-gray-300 p-8 m-2 rounded-xl shadow-md md:hover:shadow-xl">
              <div className="w-8 h-8 bg-teal-600 opacity-60 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold shadow-lg">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Supporters and Customers.</h3>
              <p className="text-gray-600">
                Poeple who want to discover and support new business ventures
              </p>
            </div>
          </div>
        </section>

        <section id='what-you-can-do' className='pb-10'>
          <div className="bg-white rounded-2xl shadow-md p-6 mx-8 max-w-6xl lg:mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-lg font-bold text-gray-900 text-center mb-4">What You Can Do In {webName}</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Create a profile for your business or startup and introduce your brand to the community.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Post updates, milestones and product developments.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Gain followers and people interested in your business journey.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span>Reach potential customers, partners and supporters.</span>
              </li>
            </ul>
          </div>
        </section>

        <section id='why-it-was-started' className='py-20'>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ~ Why <span className='primary-color'>{webName}</span> Exists ~
            </h2>
          </div>

          <div className='border border-gray-400 primary-bg opacity-80 m-10 lg:mx-auto lg:max-w-xl p-8 rounded-xl shadow-md'>
            <p className='font-semibold text-white'>Many entrepreneurs and small businesses struggle to get visibilty on their early stages. {webName} was created to give every idea and every business mutual visibility. It is a space where innovations, ambition, and entrepreneurship can be shared with the world.</p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 primary-bg lg:max-w-7xl lg:mx-auto rounded-xl shadow-md shadow-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Showcase Your Business?
            </h2>
            <p className="text-xl primary-light-color mb-10">
              Join hundreds of entrepreneurs already showcasing their businesses and ideas
            </p>
            <Link
              to={session ? "/create" : "/signup"}
              className="bg-white primary-color px-8 py-4 rounded-full hover:bg-gray-100 transition-colors text-lg font-medium inline-block shadow-xl hover:shadow-2xl"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </div>


      <Footer />
    </div>
  );
}