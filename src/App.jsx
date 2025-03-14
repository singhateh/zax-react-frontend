
import React from "react";
import router from "./Router";
import { ContextProvider } from "./contex/ContexProvider";
import { RouterProvider } from "react-router-dom";


function App() {
  // return (
  //   <Router>
  //     <Routes>
  //       <Route path="/" element={<Layout />}>
  //         <Route index element={<Doctors />} />
  //         <Route path="doctors" element={<Doctors />}>
  //           <Route path="agencies" element={<Agencies />} />
  //         </Route>
  //         <Route path="agencies/notes" element={<AgenciesNote />} />
  //         <Route path="manage/solicitors/diary" element={<SolicitorsDiary />} />
  //         <Route path="*" element={<NotFound />} />
  //       </Route>
  //     </Routes>
  //   </Router>
  // );

  return (
    <React.StrictMode>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </React.StrictMode>
  );
};


export default App;



