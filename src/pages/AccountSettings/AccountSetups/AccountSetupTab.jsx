import { AccountSetupContainer } from "./AccountInfo/AccountSetupContainer";

export const AccountSetupTab = ({ doctor, onUpdate }) => (
    <AccountSetupContainer doctor={doctor} onUpdate={onUpdate} />
);