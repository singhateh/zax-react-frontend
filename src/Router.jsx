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
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import AccountSetup from "./pages/AccountSettings/AccountSetup";
import PaymentSetup from "./pages/AccountSettings/PaymentSetup";
import ZaxReporting from "./pages/AccountSettings/ZaxReporting";
import ZaxBilling from "./pages/AccountSettings/ZaxBilling";
import ZaxBillingSummary from "./pages/AccountSettings/ZaxBillingSummary";
import ZaxAlerts from "./pages/AccountSettings/ZaxAlerts";
import AccountSettingsLayout from "./layouts/AccountSettingsLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/", // Prefix
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
        ],
      },
      {
        path: "/",
        element: <AccountSettingsLayout />,
        children: [
          // { path: "/account-settings", element: <AccountSettings /> },
          { path: "/account-settings/setup", element: <AccountSetup /> },
          {
            path: "/account-settings/reports",
            element: <ZaxReporting />,
          },
          {
            path: "/account-settings/payment",
            element: <PaymentSetup />,
          },
          {
            path: "/account-settings/alerts",
            element: <ZaxAlerts />,
          },
          { path: "/account-settings/billing", element: <ZaxBilling /> },
          {
            path: "/account-settings/billing-summary",
            element: <ZaxBillingSummary />,
          },
        ],
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
