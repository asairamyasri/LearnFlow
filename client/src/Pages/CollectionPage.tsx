import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./collpage.css";
type Resource = {
    id: number;
    collection_id: number;
    name: string;
    website: string;
    url: string;
    Confidence_rate: number;
};

function CollectionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);

    const [resourceName, setResourceName] = useState("");
    const [websiteName, setWebsiteName] = useState("");
    const [url, setUrl] = useState("");
    const [confidence, setConfidence] = useState(3);
    const [resources, setResources] = useState<Resource[]>([]);
    const [collectionName, setCollectionName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    async function loadResources() {
        const response = await fetch(
            `http://127.0.0.1:8000/resources/${id}`
        );

        const data = await response.json();

        setResources(data);
    }

    useEffect(() => {
        loadResources();

        fetch(`http://127.0.0.1:8000/collections/${id}`)
            .then((response) => response.json())
            .then((data) => setCollectionName(data.name));
    }, [id]);

    async function handleSave() {
        if (editingId === null) {
            await fetch("http://127.0.0.1:8000/resources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    collection_id: Number(id),
                    name: resourceName,
                    website: websiteName,
                    url: url,
                    Confidence_rate: confidence,
                }),
            });
        } else {
            await fetch(
                `http://127.0.0.1:8000/resources/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        collection_id: Number(id),
                        name: resourceName,
                        website: websiteName,
                        url: url,
                        Confidence_rate: confidence,
                    }),
                }
            );

            setEditingId(null);
        }

        setResourceName("");
        setWebsiteName("");
        setUrl("");
        setConfidence(3);
        setShowForm(false);

        loadResources();
    }

    async function handleDelete(resourceId: number) {
        await fetch(
            `http://127.0.0.1:8000/resources/${resourceId}`,
            {
                method: "DELETE",
            }
        );

        loadResources();
    }

    function handleEdit(resource: Resource) {
        setResourceName(resource.name);
        setWebsiteName(resource.website);
        setUrl(resource.url);
        setConfidence(resource.Confidence_rate);

        setEditingId(resource.id);

        setShowForm(true);
    }

    return (
        <div className="collection-page">

            <button
                className="back-btn"
                onClick={() => navigate("/collections")}
            >
                ← Back
            </button>

            <div className="page-header">

                <div>
                    <h1>📚 {collectionName}</h1>
                    <p>{resources.length} Resources</p>
                </div>

                <button
                    className="add-btn"
                    onClick={() => {
                        setEditingId(null);
                        setResourceName("");
                        setWebsiteName("");
                        setUrl("");
                        setConfidence(3);
                        setShowForm(true);
                    }}
                >
                    + Add Resource
                </button>

            </div>

            {showForm && (
                <div className="resource-form">

                    <h2>
                        {editingId !== null
                            ? "Edit Resource"
                            : "Add Resource"}
                    </h2>

                    <input
                        placeholder="Resource Name"
                        value={resourceName}
                        onChange={(e) =>
                            setResourceName(e.target.value)
                        }
                    />

                    <input
                        placeholder="Website"
                        value={websiteName}
                        onChange={(e) =>
                            setWebsiteName(e.target.value)
                        }
                    />

                    <input
                        placeholder="URL"
                        value={url}
                        onChange={(e) =>
                            setUrl(e.target.value)
                        }
                    />


                    <select
                        value={confidence}
                        onChange={(e) => setConfidence(Number(e.target.value))}
                    >
                        <option value={1}>⭐</option>
                        <option value={2}>⭐⭐</option>
                        <option value={3}>⭐⭐⭐</option>
                    </select>


                    <button
                        className="save-btn"
                        onClick={handleSave}
                    >
                        {editingId !== null ? "Update" : "Save"}
                    </button>

                </div>
            )}

            <div className="resources-grid">

                {resources.map((resource) => (

                    <div
                        className="resource-card"
                        key={resource.id}
                    >

                        <div className="resource-top">

                            <h3>{resource.name}</h3>

                            <span className="website-badge">
                                {resource.website}
                            </span>

                            <p>
                                {"⭐".repeat(resource.Confidence_rate)}
                            </p>

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

                            <div className="action-buttons">

                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(resource)}
                                >
                                    ✏️
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(resource.id)}
                                >
                                    🗑
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default CollectionPage;