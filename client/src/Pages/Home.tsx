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
    const [collections, setCollections] = useState<Collection[]>([]);
    const [newCollection, setNewCollection] = useState("");

    const [editId, setEditId] = useState<number | null>(null);
    const [editName, setEditName] = useState("");

    const navigate = useNavigate();


    const loadCollections = async () => {
        const response = await fetch(`${API_URL}/collections`);
        const data = await response.json();
        setCollections(data);
    };


    useEffect(() => {
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


                            {editId === collection.id ? (

                                <div className="edit-box">

                                    <input
                                        value={editName}
                                        onChange={(e) =>
                                            setEditName(e.target.value)
                                        }
                                    />


                                    <button
                                        onClick={updateCollection}
                                    >
                                        Save
                                    </button>


                                    <button
                                        onClick={() => {
                                            setEditId(null);
                                            setEditName("");
                                        }}
                                    >
                                        Cancel
                                    </button>

                                </div>


                            ) : (

                                <CollectionCard

                                    name={collection.name}


                                    onOpen={() =>
                                        navigate(
                                            `/collection/${collection.id}`
                                        )
                                    }


                                    onEdit={() => {

                                        setEditId(collection.id);
                                        setEditName(collection.name);

                                    }}


                                    onDelete={async () => {


                                        await fetch(
                                            `${API_URL}/collections/${collection.id}`,
                                            {
                                                method: "DELETE",
                                            }
                                        );


                                        setCollections((prev) =>
                                            prev.filter(
                                                (c) =>
                                                    c.id !== collection.id
                                            )
                                        );

                                    }}

                                />

                            )}

                        </div>

                    ))}


                </div>


            </section>

        </>
    );
}


export default Home;