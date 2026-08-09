import { RouterProvider } from 'react-router';
import { router } from './routes';
import { PopupProvider, usePopup } from './contexts/EdgePopupContext';
import { CatalogProvider } from './contexts/catalogContext';
import GlobalPopup from './components/GlobalPopup';
import { useEffect } from 'react';

export default function App() {

  function NetworkWatcher() {
    const { showPopup } = usePopup();

    useEffect(() => {
      const offline = () => showPopup("You are offline", "error");
      const online = () => showPopup("Back online", "success");

      window.addEventListener("offline", offline);
      window.addEventListener("online", online);

      return () => {
        window.removeEventListener("offline", offline);
        window.removeEventListener("online", online);
      };
    }, []);

    return null;
  }

  return (
    <PopupProvider>
      <CatalogProvider>
        <NetworkWatcher />
        <GlobalPopup />
        <RouterProvider router={router} />
      </CatalogProvider>
    </PopupProvider>
  );
}
