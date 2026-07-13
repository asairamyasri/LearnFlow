import "../App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    FiBookOpen,
    FiGrid,
    FiFolder,
    FiStar,
    FiLogOut,
    FiLayers,

} from "react-icons/fi";
function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    if (
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {
        return <Outlet />;
    }
    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }
    return (
        <div className="layout">
            <aside className="sidebar">
                <div>
                    <h2 className="logo">

                        <FiLayers />     <span> LearnFlow </span>
                    </h2>

                    <div
                        className={`nav-item ${location.pathname === "/" ? "active" : ""
                            }`}
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        <FiGrid /> Dashboard
                    </div>

                    <div
                        className={`nav-item ${location.pathname.startsWith("/collections")
                            ? "active"
                            : ""
                            }`}
                        onClick={() => navigate("/collections")}
                        style={{ cursor: "pointer" }}
                    >
                        <FiFolder /> Collections
                    </div>

                </div>

                <div className="sidebar-bottom">
                    <button className="logout-btn" onClick={handleLogout}>
                        < FiLogOut />  Logout
                    </button>
                    <h3>✨ Stay Organized</h3>
                    <p>Save all your learning resources in one place.</p>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;