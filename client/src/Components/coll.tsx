import "./coll.css";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { FiFolder } from "react-icons/fi";
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

                <div className="folder-box">  <FiFolder /></div>

                <div className="collection-details">

                    <h3>{props.name}</h3>

                    <p>Click to open collection</p>

                </div>

            </div>

            <div className="action-buttons">

                <button
                    className="edit-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onEdit();
                    }}
                >
                    <FiEdit2 />
                </button>

                <button
                    className="delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        props.onDelete();
                    }}
                >
                    <FiTrash2 />
                </button>

            </div>

        </div>
    );
}

export default CollectionCard;