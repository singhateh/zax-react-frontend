import PaymentDetailsView from "./Payments/PaymentDetailsView";
import PaymentSetupForm from "./Payments/PaymentSetupForm";

export const PaymentSetupTab = ({ doctor, onUpdate }) => (
    <PaymentDetailsView doctor={doctor} onUpdate={onUpdate} />
);