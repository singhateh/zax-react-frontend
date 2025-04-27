import React from "react";
import router from "./Router";
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom";
import { registerSW } from 'virtual:pwa-register';

// 🔁 MOVE THIS OUTSIDE THE COMPONENT
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
        <RouterProvider router={router} />
      </ContextProvider>
    </React.StrictMode>
  );
}

export default App;
