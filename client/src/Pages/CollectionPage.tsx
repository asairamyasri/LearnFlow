import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./collpage.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
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
    const token = localStorage.getItem("token");
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
            `https://learnflow-bos1.onrender.com/resources/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        setResources(data);
    }

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadResources();

        fetch(`https://learnflow-bos1.onrender.com/collections/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCollectionName(data.name));
    }, [id]);

    async function handleSave() {
        if (resourceName.trim() === "") {
            alert("Resource name cannot be empty!");
            return;
        }

        if (url.trim() === "") {
            alert("Resource link is required!");
            return;
        }
        if (editingId === null) {
            await fetch("https://learnflow-bos1.onrender.com/resources", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
                `https://learnflow-bos1.onrender.com/resources/${editingId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
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
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resource?"
        );
        if (!confirmDelete) { return; }
        await fetch(
            `https://learnflow-bos1.onrender.com/resources/${resourceId}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                ← Back to Collections
            </button>

            <div className="page-header">

                <div>
                    <h1>{collectionName}</h1>
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


                    <div className="rating-picker">
                        {[1, 2, 3].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="star-btn"
                                onClick={() => setConfidence(star)}
                            >
                                {confidence >= star ? <FaStar /> : <FaRegStar />}
                            </button>
                        ))}
                    </div>

                    <div className="form-buttons">

                        <button
                            className="cancel-btn"
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                                setResourceName("");
                                setWebsiteName("");
                                setUrl("");
                                setConfidence(3);
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            className="save-btn"
                            onClick={handleSave}
                        >
                            {editingId !== null ? "Update" : "Save"}
                        </button>

                    </div>

                </div>
            )}

            <div className="resources-grid">

                {resources.map((resource) => (

                    <div
                        className="resource-card"
                        key={resource.id}
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

                            <div className="action-buttons">

                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(resource)}
                                >
                                    <FiEdit2 />
                                </button>

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(resource.id)}
                                >
                                    <FiTrash2 />
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