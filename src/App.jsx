import React from "react";
import router from "./Router";
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom";

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
    // <React.StrictMode>

    // </React.StrictMode>
  );
}

export default App;
