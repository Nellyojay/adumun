import { usePopup } from "../contexts/EdgePopupContext";

export default function GlobalPopup() {
  const { popup } = usePopup();

  if (!popup.visible) return null;

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50">

      <div
        className={`px-2 py-1 rounded-sm flex justify-center items-center shadow-lg text-white text-sm font-medium
        ${popup.type === "error" && "bg-red-500"}
        ${popup.type === "success" && "bg-green-500"}
        ${popup.type === "info" && "primary-bg"}
        `}
      >
        {popup.message}
      </div>

    </div>
  );
}