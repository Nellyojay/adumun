import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { useNavigate } from "react-router"

type BackButtonProps = {
  className?: string;
}

export const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label="Go back"
      title="Go back"
      className={`absolute m-2 border border-gray-300 bg-gray-200 md:hover:bg-gray-300 text-gray-800 font-semibold p-2 rounded-full inline-flex items-center ${className}`}
    >
      <BiArrowBack />
    </button>
  )
}

type ScrollToTopButtonProps = {
  className?: string;
  threshold?: number;
}

export const ScrollToTopButton = ({ className = '', threshold = 320 }: ScrollToTopButtonProps) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > threshold)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={`fixed bottom-14 right-3 z-40 border border-gray-300 bg-white text-gray-800 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 primary-focus p-2 rounded-full inline-flex items-center ${className}`}
    >
      <ArrowUp size={16} />
    </button>
  )
}

