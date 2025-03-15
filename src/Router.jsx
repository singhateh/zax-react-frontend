import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Doctors from "./pages/Doctors/Doctors";
import DoctorLayout from "./layouts/DoctorLayout";
import Agencies from "./pages/Doctors/Agencies";
import AgenciesNote from "./pages/Doctors/AgenciesNote";
import SolicitorsDiary from "./pages/Doctors/SolicitorsDiary";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import GuestLayout from "./layouts/GuestLayout";
import Settings from "./pages/Settings/Settings";
import AccountSetup from "./pages/AccountSettings/AccountSetup";
import PaymentSetup from "./pages/AccountSettings/PaymentSetup";
import ZaxReporting from "./pages/AccountSettings/ZaxReporting";
import ZaxBilling from "./pages/AccountSettings/ZaxBilling";
import ZaxBillingSummary from "./pages/AccountSettings/ZaxBillingSummary";
import ZaxAlerts from "./pages/AccountSettings/ZaxAlerts";
import AccountSettingsLayout from "./layouts/AccountSettingsLayout";
import Invoices from "./pages/Invoices";
import Cases from "./pages/Cases/Cases";
import ZaxCalLayout from "./layouts/ZaxCalLayout";
import SetUpVenue from "./pages/ZaxCal/SetUpVenue";
import CreateSlots from "./pages/ZaxCal/CreateSlots";
import BookAppointments from "./pages/ZaxCal/BookAppointments";
import Diary from "./pages/ZaxCal/Diary";
import PrintClinicList from "./pages/ZaxCal/PrintClinicList";
import PrintDnaList from "./pages/ZaxCal/PrintDnaList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/", // Prefix
        element: <Dashboard />,
        children: [
          {
            path: "/dashboard",
            element: <Doctors />,
          },
        ],
      },
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
          { path: "/account-settings/setup", element: <AccountSetup /> },
          { path: "/account-settings/reports", element: <ZaxReporting /> },
          { path: "/account-settings/payment", element: <PaymentSetup /> },
          { path: "/account-settings/alerts", element: <ZaxAlerts /> },
          { path: "/account-settings/billing", element: <ZaxBilling /> },
          {
            path: "/account-settings/billing-summary",
            element: <ZaxBillingSummary />,
          },
        ],
      },
      {
        path: "/",
        element: <ZaxCalLayout />,
        children: [
          { path: "/zax-cal/setup-venue", element: <SetUpVenue /> },
          { path: "/zax-cal/create-slots", element: <CreateSlots /> },
          { path: "/zax-cal/book-appointments", element: <BookAppointments /> },
          { path: "/zax-cal/diary", element: <Diary /> },
          { path: "/zax-cal/print-clinic-list", element: <PrintClinicList /> },
          { path: "/zax-cal/print-dna-list", element: <PrintDnaList /> },
          { path: "/zax-cal/manage-csv", element: <PrintDnaList /> },
        ],
      },
      {
        path: "/",
        element: <Settings />,
        children: [{ path: "/settings", element: <Settings /> }],
      },
      {
        path: "/",
        element: <Invoices />,
        children: [{ path: "/invoices", element: <Invoices /> }],
      },
      {
        path: "/",
        element: <ZaxAlerts />,
        children: [{ path: "/zax-alerts", element: <ZaxAlerts /> }],
      },
      {
        path: "/",
        element: <ZaxReporting />,
        children: [{ path: "/zax-reports", element: <ZaxReporting /> }],
      },
      {
        path: "/",
        element: <ZaxBilling />,
        children: [{ path: "/zax-billing", element: <ZaxBilling /> }],
      },
      {
        path: "/",
        element: <Cases />,
        children: [{ path: "/manage-cases", element: <Cases /> }],
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
