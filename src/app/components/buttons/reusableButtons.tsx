import { BiArrowBack } from "react-icons/bi"

type BackButtonProps = {
  className?: string;
}

export const BackButton = ({ className = '' }: BackButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Go back"
      title="Go back"
      className={`absolute m-2 bg-gray-200 md:hover:bg-gray-300 text-gray-800 font-semibold p-2 rounded-full inline-flex items-center ${className}`}
    >
      <BiArrowBack />
    </button>
  )
}