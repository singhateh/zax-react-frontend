import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Doctors from "./pages/Doctors";
import DoctorLayout from "./layouts/DoctorLayout";
import Agencies from "./pages/Agencies";
import AgenciesNote from "./pages/AgenciesNote";
import SolicitorsDiary from "./pages/SolicitorsDiary";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GuestLayout from "./layouts/GuestLayout";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthLayout />,
        children: [
            {
                path: "/",  // Prefix
                element: <DoctorLayout />,
                children: [
                    {
                        path: "/doctors",
                        element: <Doctors />,
                    },
                    {
                        path: "/doctors/agencies",
                        element: <Agencies />,
                    },
                    {
                        path: "doctors/agencies-notes",
                        element: <AgenciesNote />,
                    },
                    {
                        path: "/doctors/solicitors-diary",
                        element: <SolicitorsDiary />,
                    },

                ]
            },


        ],
    },
    {
        path: "",
        element: <GuestLayout />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "/validate-warranty",
                element: <Register />,
            },
            {
                path: "/dealer-varication",
                element: <ForgotPassword />,
            },
        ],
    },
]);

export default router;
