import { Link } from "react-router-dom";
import { BUSINESS_PERSONNEL_ROLE, MENTOR_ROLE, type userData } from "../contexts/userDataContext";
import { useState, type SetStateAction } from "react";
import { Check } from "lucide-react";
import SuccessMessage from "./SuccessMessage";

export const ActionsPopup = (user: Partial<userData> | null) => {
  const userRoles = Array.isArray(user?.user_roles) ? user.user_roles : [];

  return (
    <div
      className="absolute top-10 right-0 flex flex-col bg-white rounded-md border-2 border-gray-300 shadow-lg p-2 w-52 z-10 font-semibold"
    >
      {userRoles.includes(BUSINESS_PERSONNEL_ROLE) && (
        <Link
          to="/create"
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Create Business Page
        </Link>
      )}
      {userRoles.includes(MENTOR_ROLE) && (
        <Link
          to="/mentorship-page/create"
          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
        >
          Create Mentorship Page
        </Link>
      )}
    </div>
  );
}

export const RateMentorship = ({
  setRated,
  onClick,
  rateErr,
  submitted
}: {
  setRated: React.Dispatch<SetStateAction<number>>;
  onClick: () => void;
  rateErr: boolean;
  submitted: boolean;
}) => {
  const [saving, setSaving] = useState(false);

  const handleClick = async () => {
    setSaving(true);
    await onClick();
    setSaving(false);
  }

  return (
    <div className="absolute top-10 right-0 flex flex-col bg-white rounded-md border-2 border-gray-300 shadow-lg p-2 w-52 z-10 font-semibold gap-4">
      <select
        title="rating"
        id="category"
        required
        onChange={(e: any) => setRated(e.target.value)}
        className="w-full not-md:text-sm px-2 py-1 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 primary-focus focus:border-transparent"
      >
        <option value={0}>--0--</option>
        <option value={1}>1</option>
        <option value={2}>2</option>
        <option value={3}>3</option>
        <option value={4}>4</option>
        <option value={5}>5</option>
      </select>

      {rateErr && (
        <p className="text-red-700 font-medium">Error submitting rating. Please try again.</p>
      )}

      {submitted ? (
        <SuccessMessage
          header='Thank you for rating!'
          message=''
          error={false}
        />
      ) : (
        <button
          title="rate"
          onClick={() => handleClick()}
          disabled={saving}
          className="rounded-lg flex justify-center items-center py-2 primary-bg primary-bg-disabled disabled:cursor-not-allowed text-white"
        >
          <Check />
        </button>
      )}
    </div>
  )
}