import "../App.css";
import { useEffect, useState } from "react";
import CollectionCard from "../Components/coll";
import { useNavigate } from "react-router-dom";

type Collection = {
    id: number;
    name: string;
};

const API_URL = "http://127.0.0.1:8000";

function Home() {
    const token = localStorage.getItem("token");
    const [collections, setCollections] = useState<Collection[]>([]);
    const [newCollection, setNewCollection] = useState("");

    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const navigate = useNavigate();


    const loadCollections = async () => {
        const response = await fetch(`${API_URL}/collections`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        setCollections(data);
    };


    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadCollections();
    }, []);



    const addCollection = async () => {

        if (newCollection.trim() === "") {
            alert("Collection name cannot be empty!");
            return;
        }


        if (
            collections.some(
                (c) =>
                    c.name.toLowerCase() ===
                    newCollection.trim().toLowerCase()
            )
        ) {
            alert("Collection already exists!");
            return;
        }


        await fetch(`${API_URL}/collections`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: newCollection.trim(),
            }),
        });


        setNewCollection("");
        loadCollections();
    };



    const updateCollection = async () => {

        if (!editName.trim()) {
            alert("Collection name cannot be empty");
            return;
        }


        await fetch(
            `${API_URL}/collections/${editId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: editName.trim(),
                }),
            }
        );


        setCollections((prev) =>
            prev.map((c) =>
                c.id === editId
                    ? {
                        ...c,
                        name: editName.trim()
                    }
                    : c
            )
        );


        setEditId(null);
        setEditName("");
    };



    return (
        <>

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


                        <button onClick={addCollection}>
                            + Add Collection
                        </button>

                    </div>


                </div>

            </section>



            <section className="collections-section">

                <h2>Collections</h2>


                <div className="collections-list">


                    {collections.map((collection) => (

                        <div key={collection.id}>


                            <CollectionCard
                                name={collection.name}
                                onOpen={() => navigate(`/collection/${collection.id}`)}
                                onEdit={() => {
                                    setEditId(collection.id);
                                    setEditName(collection.name);
                                }}
                                onDelete={async () => {
                                    const confirmDelete = window.confirm(
                                        "Are you sure you want to delete this collection?"
                                    );

                                    if (!confirmDelete) return;

                                    await fetch(`${API_URL}/collections/${collection.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    });

                                    setCollections(prev =>
                                        prev.filter(c => c.id !== collection.id)
                                    );
                                }}
                            />

                        </div>

                    ))}


                </div>


            </section>
            {editId !== null && (
                <div className="modal-overlay">

                    <div className="edit-modal">

                        <h2>Edit Collection</h2>

                        <p>Update the collection name.</p>

                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                        />

                        <div className="modal-buttons">

                            <button
                                className="cancel-btn"
                                onClick={() => {
                                    setEditId(null);
                                    setEditName("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="save-btn"
                                onClick={updateCollection}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>
            )}
        </>
    );
}


export default Home;