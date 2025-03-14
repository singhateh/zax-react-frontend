import React, { useState } from "react";
import { Outlet } from "react-router-dom";

function Agencies() {
  return (
    <div>
      <h1 className="text-4xl text-red-500">Agencies content here</h1>
      <Outlet />
    </div>
  );
}

export default Agencies;
