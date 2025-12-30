import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";

const Notes = () => {
    const { notes, setNotes } = useContext(AuthContext);

    return (
        <div className="px-4 mb-6 note-grid">
            {notes.map((note) => (
                <NoteCard setNotes={setNotes} key={note._id} note={note} />
            ))}
        </div>
    );
};

export default Notes;
