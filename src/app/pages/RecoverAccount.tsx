import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Mail, CheckCircle, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { useAuth } from '../contexts/authContext';
import supabase from '../supabaseClient';

export function RecoverAccount() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email);
  const [recoveryType, setRecoveryType] = useState<'reactivate' | 'password'>('reactivate');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const reactivate = async () => {
    const { error } = await supabase
      .from('users')
      .update({ is_active: true })
      .eq('auth_id', user?.id)

    if (error) {
      setError(`${error.message}`);
      return;
    }

    setIsSuccess(true)
    setError('')
  }

  const reactivateWithPasswordReset = async () => {
    setError("Coming soon")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (recoveryType === 'password' && email) {
        reactivateWithPasswordReset();
      } else if (recoveryType === 'reactivate') {
        reactivate();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {!isSuccess ? (
          <div className="bg-white rounded-2xl shadow-md p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full primary-gradient flex items-center justify-center mx-auto mb-4 shadow-lg">
                <RefreshCw className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Recover Your Account
              </h1>
              <p className="text-gray-600">
                Choose how you'd like to recover your account
              </p>
            </div>

            {/* Recovery Type Selection */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setRecoveryType('reactivate')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${recoveryType === 'reactivate'
                  ? 'primary-border primary-soft-bg'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${recoveryType === 'reactivate' ? 'primary-border' : 'border-gray-300'
                    }`}>
                    {recoveryType === 'reactivate' && (
                      <div className="w-2.5 h-2.5 rounded-full primary-bg" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Reactivate Account
                    </h3>
                    <p className="text-sm text-gray-600">
                      Restore access to your deactivated account
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setRecoveryType('password')}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${recoveryType === 'password'
                  ? 'primary-border primary-soft-bg'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${recoveryType === 'password' ? 'primary-border' : 'border-gray-300'
                    }`}>
                    {recoveryType === 'password' && (
                      <div className="w-2.5 h-2.5 rounded-full primary-bg" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Reset Password
                    </h3>
                    <p className="text-sm text-gray-600">
                      Get a link to create a new password
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {recoveryType === 'password' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full primary-bg primary-bg-hover text-white py-3 rounded-full transition-all font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {recoveryType === 'reactivate' ? (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Reactivate Account
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </>
                )}
              </button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Remember your password?
                </p>
                <button
                  title='back-to-login'
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true })
                  }}
                  className="text-sm primary-color primary-color-hover font-medium"
                >
                  Back to Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            {/* Success State */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {recoveryType === 'reactivate' ? 'ACCOUNT RE-ACTIVATED' : 'Check Your Email'}
            </h2>
            <p className="text-gray-600 mb-6">
              {recoveryType === 'reactivate'
                ? "Welcome back to the paltform. We are glad to have you back."
                : "We've sent you an email with a link to reset your password. The link will expire in 1 hour."}
            </p>

            {recoveryType === 'password' && (
              <div className="primary-soft-bg border primary-border rounded-xl p-4 mb-6">
                <p className="text-sm primary-soft-color">
                  <strong>Didn't receive the email?</strong>
                </p>
                <p className="text-sm primary-soft-color mt-1">
                  Check your spam folder or try again in a few minutes
                </p>
              </div>
            )}

            {recoveryType === 'password' && (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full px-6 py-3 primary-bg primary-bg-hover text-white rounded-full transition-all font-medium shadow-md hover:shadow-lg"
                >
                  Send Again
                </button>
                <button
                  title='back-to-login'
                  onClick={() => {
                    logout();
                    navigate('/login', { replace: true })
                  }}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium inline-block"
                >
                  Back to Login
                </button>
              </div>
            )}

            {recoveryType === 'reactivate' && (
              <Link
                to='/'
                className="w-full px-6 py-3 primary-bg primary-bg-hover text-white rounded-full transition-all font-medium shadow-md hover:shadow-lg"
              >
                Continue
              </Link>
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Need additional help?
          </p>
          <Link
            to="/feedback"
            className="text-sm primary-color primary-color-hover font-medium"
          >
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}
