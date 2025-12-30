import { useState } from "react";
import { Check, Copy, EditIcon, Pin, Star, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../config/axios";
import { Link } from "react-router";

const NoteCard = ({ note, setNotes }) => {
    const [copying, setCopying] = useState(false);
    const colors = {
        Code: "bg-primary text-primary-content",
        Ideas: "bg-secondary text-secondary-content",
        Work: "bg-accent text-accent-content",
        Personal: "bg-purple-500 text-purple-500-content",
        General: "bg-gray-500 text-gray-500-content",
    }

    const handlePin = async (noteId, isPinned) => {
        await toast.promise(api.patch(`/notes/update/${noteId}`, { isPinned: !isPinned }), {
            loading: isPinned ? "Unpinning..." : "Pinning...",
            success: isPinned ? "Note unpinned" : "Note pinned",
            error: "Failed to update pin status",
        });
        setNotes((prev) => prev.map((note) => (note._id === noteId ? { ...note, isPinned: !isPinned } : note)));
    };
    const handleFav = async (noteId, favorite) => {
        await toast.promise(api.patch(`/notes/update/${noteId}`, { favorite: !favorite }), {
            loading: favorite ? "Removing to favorites..." : "Adding to favorites...",
            success: favorite ? "Note removed from favorites" : "Note added to favorites",
            error: "Failed to add to favorites",
        });
        setNotes((prev) => prev.map((note) => (note._id === noteId ? { ...note, favorite: !favorite } : note)));
    };
    const handleDelete = async (noteId) => {
        await toast.promise(api.delete(`/notes/delete/${noteId}`), {
            loading: "Deleing note...",
            success: (res) => res?.data?.message || "Note deleted successfully",
            error: (err) => err?.response?.data?.message || "Something went wrong. Try again.",
        });
        setNotes((prev) => prev.filter((note) => note._id !== noteId));
    };

    const handleCopy = (content) => {
        setCopying(true);
        navigator.clipboard.writeText(content);
        toast.success("Content copied to clipboard");
        setTimeout(() => {
            setCopying(false);
        }, 2000);
    };

    return (
        <div className={`group border border-primary-content/20 library-card p-6 rounded-2xl flex flex-col h-72 relative overflow-hidden`}>
            {/* Top Row: Title & Actions */}
            <div className="flex items-start justify-between mb-4 gap-2">
                <h2 className="text-lg font-bold text-white/90 line-clamp-1 grow italic">{note.title || "Untitled Thought"}</h2>
                <div className="flex items-center gap-2 transition-opacity duration-300">
                    <Pin
                        onClick={() => handlePin(note._id, note.isPinned)}
                        className={`size-4 cursor-pointer group-hover:opacity-100 transition-all ${note.isPinned ? "text-primary fill-primary rotate-45" : "text-white/20 opacity-0 hover:text-white"}`}
                    />
                    <Star
                        onClick={() => handleFav(note._id, note.favorite)}
                        className={`size-4 cursor-pointer group-hover:opacity-100 transition-all ${note.favorite ? "text-yellow-500 fill-yellow-500" : "text-white/20 opacity-0  hover:text-white"}`}
                    />
                </div>
            </div>

            {/* Tag Badge */}
            <div className="mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${colors[note.tag]} border border-primary/20`}>{note.tag}</span>
            </div>

            {/* Content Preview */}
            <p className="text-sm text-white/50 whitespace-pre-line overflow-auto leading-relaxed grow scrollbar-thin mask-fade-bottom">{note.content}</p>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-white/5 flex gap-6 items-center justify-end">
                <span className="text-[10px] mr-auto font-medium text-white/20 uppercase tracking-tighter">
                    {new Date(note.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
                <button onClick={() => handleCopy(note.content)}>
                    {!copying && <Copy className="size-4 text-white/10 hover:text-primary-content cursor-pointer duration-300" />}
                    {copying && <Check className="size-4 text-white/10 hover:text-primary-content cursor-pointer duration-300" />}
                </button>
                <Link to={`/notes/update/${note._id}`}>
                    <EditIcon className="size-4 text-white/10 hover:text-primary-content cursor-pointer duration-300" />
                </Link>
                <Trash2Icon onClick={() => handleDelete(note._id)} className="size-4 text-white/10 hover:text-red-500 cursor-pointer duration-300" />
            </div>
        </div>
    );
};

export default NoteCard;
