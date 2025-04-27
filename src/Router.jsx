import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import DoctorLayout from "./layouts/DoctorLayout";
import Doctors from "./pages/Doctors";
import Agencies from "./pages/Doctors/Agencies";
import AgenciesNote from "./pages/AgenciesNote";
import GuestLayout from "./layouts/GuestLayout";
import AccountSettingsLayout from "./layouts/AccountSettingsLayout";
import AccountSetup from "./pages/AccountSettings/AccountSetup";
import PaymentSetup from "./pages/AccountSettings/PaymentSetup";
import ZaxReporting from "./pages/AccountSettings/ZaxReporting";
import ZaxBillingSummary from "./pages/AccountSettings/ZaxBillingSummary";
import ZaxAlerts from "./pages/AccountSettings/ZaxAlerts";
import ZaxCalLayout from "./layouts/ZaxCalLayout";
import Venues from "./pages/ZaxCal/Venues";
import Slots from "./pages/ZaxCal/Slots";
import Appointments from "./pages/ZaxCal/Appointments";
import Diary from "./pages/ZaxCal/Diary";
import ClinicList from "./pages/ZaxCal/ClinicList";
import DNAList from "./pages/ZaxCal/DNAList";
import ManageCSV from "./pages/ZaxCal/ManageCSV";
import Dashboard from "./pages/Dashboard";
import BookAndInstructCaseForm from "./pages/InstructCases/BookAndInstructCaseForm";
import InstructCaseLayout from "./layouts/InstructCaseLayout";
import AppointmentBookPage from "./pages/ZaxCal/Appointments/AppointmentBookPage";
import SolicitorsDiary from "./pages/Doctors/SolicitorsDiary";
import ContractsPage from "./pages/AccountSettings/ContractSetups/ContactContainer";
import NotFound from "./components/NotFound";
import ZaxBilling from "./pages/AccountSettings/Billings/ZaxBilling";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [ // upper level children
      {
        path: "dashboard",
        element: <Dashboard />,
        title: "Dashboard",
      },
      {
        path: "doctors", // Removed leading "/"
        element: <DoctorLayout />,
        title: "Doctors",
        children: [ // child level children
          { path: "", element: <Doctors />, title: "Doctors" },
          { path: "agencies", element: <Agencies />, title: "Agencies" },
          { path: "agencies-notes", element: <AgenciesNote />, title: "Agencies Notes" },
          { path: "solicitors-diary", element: <SolicitorsDiary />, title: "Solicitors Diary" },
        ],
      },
      {
        path: "account-settings", // Removed leading "/"
        element: <AccountSettingsLayout />,
        title: "Account Settings",
        children: [
          { path: ":id", element: <AccountSetup />, title: "Account Setup" },
          { path: "setup/:id", element: <AccountSetup />, title: "Account Setup :id" },
          { path: "contracts", element: <ContractsPage />, title: "Contracts" },
          { path: "reports", element: <ZaxReporting />, title: "Reports" },
          { path: "payment", element: <PaymentSetup />, title: "Payment Setup" },
          { path: "alerts", element: <ZaxAlerts />, title: "Alerts" },
          { path: "billing", element: <ZaxBilling />, title: "Billing" },
          { path: "billing-summary", element: <ZaxBillingSummary />, title: "Billing Summary" },
        ],
      },
      {
        path: "zax-cal", // Removed leading "/"
        element: <ZaxCalLayout />,
        title: "Zax Calendar",
        children: [
          { path: "", element: <Venues />, title: "Venues" },
          { path: "venues", element: <Venues />, title: "Venues" },
          { path: "slots", element: <Slots />, title: "Slots" },
          { path: "appointments", element: <Appointments />, title: "Appointments" },
          { path: "diary", element: <Diary />, title: "Diary" },
          { path: "clinic-list", element: <ClinicList />, title: "Clinic List" },
          { path: "dna-list", element: <DNAList />, title: "DNA List" },
          { path: "manage-csv", element: <ManageCSV />, title: "Manage CSV" },
        ],
      },
      {
        path: "instruct-cases",
        element: <InstructCaseLayout />,
        title: "Instruct Cases",
        children: [
          {
            path: "",
            element: <BookAndInstructCaseForm />,
            title: "Instruct & Book Appointment",
          },
          {
            path: "book/:id", // fixed from {id} to :id for React Router
            element: <BookAndInstructCaseForm />,
            title: "Instruct & Book Appointment",
          },
          {
            path: "edit/:id",
            element: <BookAndInstructCaseForm />,
            title: "Instruct & Book Appointment",
          },
          {
            path: "appointment-book-page",
            element: <AppointmentBookPage />,
            title: "Book Appointment",
          },
        ],
      }
    ],
  },
  {
    path: "/", // Guest Layout for non-authenticated users
    element: <GuestLayout />,
    children: [
      { path: "login", element: <Login />, title: "Login" },
      { path: "register", element: <Register />, title: "Register" },
      { path: "forgot-password", element: <ForgotPassword />, title: "Forgot Password" },
    ],
  },
]);

export default router;
