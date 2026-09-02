import { useNavigate } from "react-router";
import { useUserData } from "../contexts/userDataContext";
import { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import SuccessMessage from "../components/SuccessMessage";
import { useWebData } from "../contexts/webData";

export default function TC_agree() {
  const { agreeToTC, currentUser } = useUserData();
  const { webName } = useWebData();
  const [roles, setRoles] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingMessage, setOnboardingMessage] = useState(false);
  const navigate = useNavigate();

  const checkAgreedStatus = () => {
    if (currentUser?.TC_agreed) {
      setAgreed(true);
    } else {
      setAgreed(false);
    }
  };

  useEffect(() => {
    checkAgreedStatus();
  }, [currentUser]);

  const updateRoles = async () => {
    if (!currentUser?.id) return;

    const { data, error } = await supabase
      .from('users')
      .update({ user_roles: roles })
      .eq('id', currentUser.id)
      .select('id, user_roles')
      .single();

    if (error || !data) {
      setError('Failed to update roles. Please try again.');
      return false;
    }

    return Boolean(data.user_roles);
  }

  const handleSubmit = async () => {
    setLoading(true);

    if (roles.length === 0) {
      setError('Please select at least one role.');
      setLoading(false);
      return;
    }

    if (!agreed) {
      setError('You must agree to the Terms and Conditions to proceed.');
      setLoading(false);
      return;
    }

    const isAgreed = await agreeToTC();
    const rolesUpdated = await updateRoles();

    if (!isAgreed) {
      setError('Please agree to the Terms and Conditions.');
      setLoading(false);
      setAgreed(false);
      return;
    }

    if (isAgreed && rolesUpdated && !error) {
      setSubmitted(true);
      setTimeout(() => {
        setOnboardingMessage(true);

        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 10000);
      }, 3000);

    } else {
      setError('Failed to submit! Please try again.');
      setLoading(false);
      setAgreed(false);
      return;
    }
  };

  return (
    <div className="flex h-screen justify-center items-center primary-gradient-soft">
      {!onboardingMessage && (
        <div className="border border-gray-300 p-6 mx-2 rounded-xl shadow-lg bg-gray-50">
          <h1 className="text-2xl font-bold mb-4">Welcome to {webName}!</h1>
          <h1 className="text-lg font-bold mb-4">What role do you wish to hold in this platform?</h1>
          <div className="mb-6">
            <label htmlFor="selected-roles" className="block text-sm font-medium text-gray-700 mb-2">
              Designated roles
            </label>
            <div className="flex items-center justify-center gap-2">
              <input
                title="designated-roles"
                type="text"
                placeholder="Selected roles are shown here"
                value={roles.join(', ')}
                disabled
                onChange={(e) => setRoles(e.target.value.split(', '))}
                className="w-full not-md:text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (roles.length > 0) {
                    setRoles([]);
                  }
                }}
                className="text-white text-sm w-10 h-10 font-semibold border border-gray-300 bg-gray-400 shadow-sm rounded-lg"
              >
                X
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Select roles *
            </label>
            <select
              id="category"
              required
              value={roles.join(', ')}
              onChange={(e) => {
                roles.push(e.target.value);
                setRoles([...roles]);
              }}
              className="w-full not-md:text-sm px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
            >
              <option value="">--Select--</option>
              <option value="business personnel">Business personnel</option>
              <option value="customer">Customer</option>
              <option value="investor">Investor</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>

          <div className="flex justify-between items-center gap-4 border border-gray-300 rounded-lg my-6 p-2">
            <p className="text-gray-600 text-xs md:text-sm font-semibold">
              Please agree to the&nbsp;
              <span>
                <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>
              </span>
            </p>
            {!agreed ? (
              <button
                onClick={() => setAgreed(true)}
                className="text-white font-semibold border border-gray-300 primary-bg shadow-sm py-2 px-4 rounded-lg"
              >
                Agree
              </button>
            ) : (
              <p className="text-green-600 font-semibold">Agreed</p>
            )}
          </div>

          {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!agreed || loading}
              className={`w-full mt-6 py-3 text-white font-semibold rounded-lg ${agreed && !loading && roles.length > 0 ? 'primary-bg primary-bg-hover' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          ) : (
            <SuccessMessage
              header='Thank you for choosing your role!'
              message='Your preferences have been saved successfully.'
              error={false}
            />
          )}
        </div>
      )}

      {onboardingMessage && (
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="flex flex-col items-center justify-center border border-gray-300 p-8 rounded-lg shadow-sm bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-700 mb-4 0 p-2 rounded-lg shadow-sm">Welcome to {webName}</h1>
            <h1 className="text-xl text-center font-bold text-gray-900 mb-4">Thank You for signing up with us!</h1>
            <p className="text-lg text-gray-600 mb-6">Your account has been created successfully.</p>
            <div className="bg-green-100 text-green-700 rounded-lg p-4">
              <p className="text-sm">You will be redirected shortly...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
