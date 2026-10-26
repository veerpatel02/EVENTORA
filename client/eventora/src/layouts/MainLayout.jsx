import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const MainLayout = () => {
    return (
        <>
            <Navbar />

            <main className="min-h-screen">
                <Outlet />
            </main>
        </>
    );
};

export default MainLayout;