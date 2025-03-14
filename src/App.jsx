import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Doctors from "./pages/Doctors";
import Agencies from "./pages/Agencies";
import AgenciesNote from "./pages/AgenciesNote";
import SolicitorsDiary from "./pages/SolicitorsDiary";
import NotFound from "./pages/NotFound";
import Layout from "./layouts/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Doctors />} />
          <Route path="doctors" element={<Doctors />}>
            <Route path="agencies" element={<Agencies />} />
          </Route>
          <Route path="agencies/notes" element={<AgenciesNote />} />
          <Route path="manage/solicitors/diary" element={<SolicitorsDiary />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
