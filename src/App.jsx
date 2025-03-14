import React from "react";
import router from "./Router";
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom";

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
