import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Resource = {
    id: number;
    collection_id: number;
    name: string;
    website: string;
    url: string;
    Confidence_rate: number;
    last_reviewed: string;
};

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [resources, setResources] = useState<Resource[]>([]);

    async function loadDashboard() {
        const response = await fetch(
            "https://learnflow-bos1.onrender.com/dashboard",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
        }

        const data = await response.json();
        setResources(data);
    }

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();
    }, []);

    return (
        <div className="dashboard-page">

            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resources to revise today</p>
                </div>
            </div>

            {resources.length === 0 ? (
                <div className="empty-state">
                    <h2>🎉 Nothing to revise today!</h2>
                </div>
            ) : (
                <div className="resources-grid">

                    {resources.map((resource) => (

                        <div
                            key={resource.id}
                            className="resource-card"
                        >

                            <div className="resource-header">

                                <div className="resource-info">

                                    <h3>{resource.name}</h3>

                                    <span className="website-badge">
                                        {resource.website}
                                    </span>

                                </div>

                                <div className="resource-rating">
                                    {"⭐".repeat(resource.Confidence_rate)}
                                </div>

                            </div>

                            <a
                                className="resource-link"
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {resource.url}
                            </a>

                            <div className="resource-actions">

                                <a
                                    className="open-btn"
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    🔗 Open
                                </a>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Dashboard;