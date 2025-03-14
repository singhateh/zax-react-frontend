import React, { useState } from "react";
import Tabs from "../components/Tabs";
import { Outlet } from "react-router-dom";

function Doctors() {
  return (
    <div className="text-4xl text-red-500">
      Doctors content here
      <Outlet />
    </div>
  );
}

export default Doctors;
