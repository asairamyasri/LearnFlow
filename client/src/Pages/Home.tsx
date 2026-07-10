import "../App.css";
import { useEffect, useState } from "react";
import CollectionCard from "../Components/coll";
import { useNavigate } from "react-router-dom";
type Collection = {
    id: number;
    name: string;
};

function Home() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [newCollection, setNewCollection] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://127.0.0.1:8000/collections")
            .then((response) => response.json())
            .then((data) => setCollections(data));
    }, []);

    return (
        <div className="layout">

            {/* Sidebar */}

            <aside className="sidebar">

                <div>

                    <h2 className="logo">
                        <span>📚</span>
                        <span>My Tracker</span>
                    </h2>

                    <div className="nav-item active">
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

            {/* Main Content */}

            <main className="content">

                <section className="hero">

                    <div className="hero-content">

                        <h1>Your Collections</h1>

                        <p>
                            Organize YouTube videos, PDFs, Notes and LeetCode
                            problems in one beautiful place.
                        </p>

                        <div className="add-box">

                            <input
                                type="text"
                                placeholder="Enter collection name..."
                                value={newCollection}
                                onChange={(e) =>
                                    setNewCollection(e.target.value)
                                }
                            />

                            <button
                                onClick={() => {
                                    if (newCollection.trim() === "") return;

                                    if (
                                        collections.some(
                                            (c) =>
                                                c.name.toLowerCase() ===
                                                newCollection
                                                    .trim()
                                                    .toLowerCase()
                                        )
                                    ) {
                                        alert(
                                            "Collection already exists!"
                                        );
                                        return;
                                    }

                                    fetch(
                                        "http://127.0.0.1:8000/collections",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                name: newCollection.trim(),
                                            }),
                                        }
                                    )
                                        .then(() =>
                                            fetch(
                                                "http://127.0.0.1:8000/collections"
                                            )
                                        )
                                        .then((response) =>
                                            response.json()
                                        )
                                        .then((data) => {
                                            setCollections(data);
                                            setNewCollection("");
                                        });
                                }}
                            >
                                + Add Collection
                            </button>

                        </div>

                    </div>

                </section>

                <section className="collections-section">

                    <h2>Collections</h2>

                    <div className="collections-list">

                        {collections.map((collection) => (
                            <CollectionCard
                                key={collection.id}
                                name={collection.name}
                                onDelete={async () => {
                                    await fetch(
                                        `http://127.0.0.1:8000/collections/${collection.id}`,
                                        {
                                            method: "DELETE",
                                        }
                                    );

                                    setCollections((prev) =>
                                        prev.filter(
                                            (c) => c.id !== collection.id
                                        )
                                    );
                                }}
                                onOpen={() =>
                                    navigate(
                                        `/collection/${collection.id}`
                                    )
                                }
                            />
                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Home;