import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";

const Notes = () => {
    const { notes, setNotes } = useContext(AuthContext);

    return (
        <div className="w-full px-4 mb-10">
            <div className="note-grid mx-auto">
                {notes.map((note) => (
                    <NoteCard setNotes={setNotes} key={note._id} note={note} />
                ))}
            </div>
        </div>
    );
};

export default Notes;
