import "../App.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function Layout() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="layout">
            <aside className="sidebar">
                <div>
                    <h2 className="logo">
                        <span>📚</span>
                        <span>My Tracker</span>
                    </h2>

                    <div
                        className={`nav-item ${location.pathname === "/" ? "active" : ""
                            }`}
                        onClick={() => navigate("/")}
                        style={{ cursor: "pointer" }}
                    >
                        📊 Dashboard
                    </div>

                    <div
                        className={`nav-item ${location.pathname.startsWith("/collections")
                                ? "active"
                                : ""
                            }`}
                        onClick={() => navigate("/collections")}
                        style={{ cursor: "pointer" }}
                    >
                        📁 Collections
                    </div>
                </div>

                <div className="sidebar-bottom">
                    <h3>✨ Stay Organized</h3>
                    <p>
                        Save all your learning resources in one place.
                    </p>
                </div>
            </aside>

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;