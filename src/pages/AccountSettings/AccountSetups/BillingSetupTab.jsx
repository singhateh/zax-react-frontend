import { BillingContainer } from "./Billings/BillingContainer";

export const BillingSetupTab = ({ doctor, onUpdate }) => (
    <BillingContainer doctor={doctor} onUpdate={onUpdate} />
);