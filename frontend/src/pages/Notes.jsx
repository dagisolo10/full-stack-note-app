import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";
import { Link } from "react-router";
import { Notebook } from "lucide-react";

const Notes = () => {
    const { notes, setNotes } = useContext(AuthContext);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 pt-4 sm:pt-6">
            <div className="note-grid mx-auto">
                {notes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                        <p className="text-xl sm:text-2xl text-gray-400">No notes yet. Start creating!</p>
                        <Notebook className="size-8 text-center text-primary" />
                        <Link>
                            <p className="text-primary underline text-2xl text-center">Create your first note</p>
                        </Link>
                    </div>
                ) : (
                    notes.map((note) => (
                        <NoteCard setNotes={setNotes} key={note._id} note={note} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Notes;
