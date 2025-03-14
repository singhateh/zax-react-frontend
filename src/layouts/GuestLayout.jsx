import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../contex/ContexProvider";

export default function GuestLayout() {
    const { token } = useStateContext();
    const location = useLocation();

    const exemptUrls = ['/validate-warranty', '/dealer-varication'];

    if (exemptUrls.includes(location.pathname)) {
        return <Outlet />;
    }

    if (token) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div>
            <Outlet />
        </div>
    );
}
