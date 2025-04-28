import React from "react";
import router from "./Router"; // Custom Router logic
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom"; // Import HashRouter


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
