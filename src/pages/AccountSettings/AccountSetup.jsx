import React, { useCallback } from "react";
import DoctorProfile from "./DoctorProfile";
import { useStateContext } from "../../contex/ContexProvider";

function AccountSetup() {
  const { selectedDoctor: doctor, setSelectedDoctor } = useStateContext();

  const handleDoctorUpdate = useCallback((update) => {
    setSelectedDoctor(prevDoctor => {
      const newDoctor = typeof update === 'function'
        ? update(prevDoctor)
        : { ...prevDoctor, ...update };

      return newDoctor;
    });
  }, [setSelectedDoctor]);

  return <DoctorProfile doctor={doctor} onUpdate={handleDoctorUpdate} />;
}

export default AccountSetup;
