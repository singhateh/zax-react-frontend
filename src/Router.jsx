import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./Modules/Auth/Login";
import Register from "./Modules/Auth/Register";
import Doctors from "./Modules/Doctors/Doctors";
import DoctorLayout from "./layouts/DoctorLayout";
import Agencies from "./Modules/Doctors/Agencies";
import AgenciesNote from "./Modules/Doctors/AgenciesNote";
import SolicitorsDiary from "./Modules/Doctors/SolicitorsDiary";
import ForgotPassword from "./Modules/Auth/ForgotPassword";
import GuestLayout from "./layouts/GuestLayout";
import AccountSetup from "./Modules/AccountSettings/AccountSetup";
import PaymentSetup from "./Modules/AccountSettings/PaymentSetup";
import ZaxReporting from "./Modules/ZaxBilling/ZaxReporting";
import ZaxBilling from "./Modules/ZaxBilling/ZaxBilling";
import ZaxBillingSummary from "./Modules/ZaxBilling/ZaxBilling";
import ZaxAlerts from "./Modules/ZaxBilling/ZaxAlerts";
import AccountSettingsLayout from "./layouts/AccountSettingsLayout";
import ZaxCalLayout from "./layouts/ZaxCalLayout";
import SetUpVenue from "./Modules/ZaxCal/SetUpVenue";
import CreateSlots from "./Modules/ZaxCal/CreateSlots";
import BookAppointments from "./Modules/ZaxCal/BookAppointments";
import Diary from "./Modules/ZaxCal/Diary";
import PrintClinicList from "./Modules/ZaxCal/PrintClinicList";
import PrintDnaList from "./Modules/ZaxCal/PrintDnaList";
import Dashboard from "./Modules/Dashboard/Dashboard";
import InstructCase from "./Modules/InstructCase/InstructCase";
import ManageCase from "./Modules/ManageCase/ManageCase";
import MedicalRecords from "./Modules/ManageCase/MedicalRecords";
import GeneralLetters from "./Modules/ManageCase/GeneralLetters";
import ManageCaseLayout from "./layouts/ManageCaseLayout";
import ManageInvoices from "./Modules/Invoices/ManageInvoices";
import InvoiceReports from "./Modules/Invoices/InvoiceReports/InvoiceReports";
import ManageInvoicesLayout from "./Modules/Invoices/ManageInvoices/Layouts/ManageInvoicesLayout";
import ZaxBillingLayout from "./layouts/ZaxBillingLayout";
import Generate from "./Modules/Invoices/ManageInvoices/Pages/Generate/Generate";
import Cancel from "./Modules/Invoices/ManageInvoices/Pages/Cancel/Cancel";
import Unpaid from "./Modules/Invoices/ManageInvoices/pages/Unpaid";
import Remittance from "./Modules/Invoices/ManageInvoices/pages/Remittance";

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
        element: <InstructCase />,
        children: [
          {
            path: "/instruct-case",
            element: <InstructCase />,
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
          { path: "/account-settings/payment", element: <PaymentSetup /> },
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
        element: <ManageInvoicesLayout />,
        children: [
          {
            path: "/invoices/manage-invoices",
            element: <ManageInvoices />,
            children: [
              {
                path: "/invoices/manage-invoices/generate",
                element: <Generate />,
              },
              {
                path: "/invoices/manage-invoices/cancel",
                element: <Cancel />,
              },
              {
                path: "/invoices/manage-invoices/unpaid",
                element: <Unpaid />,
              },
              {
                path: "/invoices/manage-invoices/remittance",
                element: <Remittance />,
              },
            ],
          },
          {
            path: "/invoices/reports",
            element: <InvoiceReports />,
            children: [],
          },
        ],
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
        element: <ZaxBillingLayout />,
        children: [
          { path: "/zax/billing", element: <ZaxBilling /> },
          { path: "/zax/billing-summary", element: <ZaxBillingSummary /> },
          { path: "/zax/alerts", element: <ZaxAlerts /> },
        ],
      },
      {
        path: "/",
        element: <ManageCaseLayout />,
        children: [
          { path: "/cases/manage-cases", element: <ManageCase /> },
          { path: "/cases/medical-records", element: <MedicalRecords /> },
          { path: "/cases/general-letters", element: <GeneralLetters /> },
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
