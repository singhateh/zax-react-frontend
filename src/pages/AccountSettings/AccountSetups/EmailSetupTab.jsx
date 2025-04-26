import { EmailDisplayView } from "./Emails/EmailDisplayView";

export const EmailSetupTab = ({ doctor, onUpdate }) => (
    <EmailDisplayView doctor={doctor} onUpdate={onUpdate} />
);