import { Outlet } from "react-router-dom";

function Agencies() {
  return (
    <div className="p-4 text-lg font-semibold mt-10">
      <h1 className="text-4xl text-red-500">Agencies content here</h1>
      <Outlet />
    </div>
  );
}

export default Agencies;
