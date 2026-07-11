import "./coll.css";

type CollectionCardProps = {
    name: string;
    onDelete: () => void;
    onOpen: () => void;
    onEdit: () => void;
};

function CollectionCard(props: CollectionCardProps) {
    return (
        <div className="collection-card" onClick={props.onOpen}>

            <div className="collection-left">

                <div className="folder-box">
                    📁
                </div>

                <div className="collection-details">

                    <h3>{props.name}</h3>

                    <p>Click to open collection</p>

                </div>

            </div>

            <button
                className="edit-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("EDIT BUTTON CLICKED");
                    props.onEdit();
                }}
            >
                ✏️
            </button>

            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    props.onDelete();
                }}
            >
                🗑
            </button>

        </div>
    );
}

export default CollectionCard;