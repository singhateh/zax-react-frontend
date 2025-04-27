import React from "react";
import router from "./Router"; // Custom Router logic
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom"; // Import HashRouter
import { registerSW } from 'virtual:pwa-register';

// 🔁 Move this outside the component
registerSW({
  onNeedRefresh() {
    console.log("New content available, refresh the page.");
  },
  onOfflineReady() {
    console.log("App is ready to work offline.");
  },
});

function App() {
  return (
    <React.StrictMode>
      <ContextProvider>
        <RouterProvider router={router} basename="/zax-react-frontend" />
      </ContextProvider>
    </React.StrictMode>
  );
}

export default App;
