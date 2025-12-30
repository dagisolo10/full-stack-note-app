import { Link, useNavigate, useParams } from "react-router-dom"; // ✅ should come from react-router-dom, not react-router
import { ChevronLeft, Save, Sparkles, Tag, ShieldCheck, Pin, Star, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../config/axios";

const UpdateNotePage = () => {
    const [note, setNote] = useState({ title: "", content: "", tag: "General", isPinned: null, favorite: null });
    const [autoSync, setAutoSync] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            setIsInitializing(true);
            const res = await toast.promise(api.get(`/notes/${id}`), {
                loading: "Getting note...",
                success: (res) => res.data.message,
                error: (err) => err.response.data.message,
            });
            setIsInitializing(false);
            setNote({
                title: res.data.note.title,
                content: res.data.note.content,
                tag: res.data.note.tag,
                isPinned: res.data.note.isPinned,
                favorite: res.data.note.favorite,
            });
        };
        fetchNote();
    }, [id]);

    useEffect(() => {
        if (!id || !autoSync) return;

        setIsSaving(true);
        const timeout = setTimeout(async () => {
            try {
                await api.patch(`/notes/update/${id}`, {
                    title: note.title,
                    content: note.content,
                    tag: note.tag,
                });
            } catch (err) {
                console.error("Auto-sync failed", err);
            } finally {
                setTimeout(() => setIsSaving(false), 1000);
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [id, note, autoSync]);

    useEffect(() => {
        setIsSaving(true);
        const updateStatus = async () => {
            await api.patch(`/notes/update/${id}`, {
                isPinned: note.isPinned,
                favorite: note.favorite,
            });
        };
        updateStatus();
        return () => setIsSaving(false);
    }, [note.isPinned, note.favorite, id]);

    const handleSubmit = async (e) => {
        e?.preventDefault();

        if (!id) return toast.error("Please wait, initializing your note...");

        await toast.promise(
            api.patch(`/notes/update/${id}`, {
                title: note.title,
                content: note.content,
                tag: note.tag,
                isPinned: note.isPinned,
                favorite: note.favorite,
            }),
            {
                loading: "Saving changes...",
                success: (res) => res?.data?.message || "Changes saved! 🎉",
                error: (err) => err?.response?.data?.message || "Failed to update.",
            }
        );
    };

    const handleDelete = async () => {
        await toast.promise(api.delete(`/notes/delete/${id}`), {
            loading: "Deleing note...",
            success: (res) => res?.data?.message || "Note deleted successfully",
            error: (err) => err?.response?.data?.message || "Something went wrong. Try again.",
        });
        navigate("/notes");
    };

    return (
        <div className="min-h-screen pb-4 pt-16">
            <div className="max-w-4xl w-full mx-auto flex flex-col items-start px-4 sm:px-6">
                {/* Header */}
                <div className="w-full flex items-center justify-between mb-4">
                    <Link to="/home" className="group flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                        <ChevronLeft className="size-5 group-hover:-translate-x-1 duration-300" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Exit Editor</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300">
                            {isSaving ? (
                                <span className="text-primary animate-pulse flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary" />
                                    Syncing...
                                </span>
                            ) : (
                                <span className="text-base-content/30 flex items-center gap-2">
                                    <ShieldCheck className="size-3" />
                                    {isInitializing ? "Initializing..." : "Saved to Cloud"}
                                </span>
                            )}
                        </div>

                        <button
                            type="button"
                            disabled={autoSync || isInitializing}
                            onClick={handleSubmit}
                            className={`${
                                autoSync || isInitializing ? "opacity-20 cursor-not-allowed bg-base-300" : "bg-primary/30 hover:bg-primary/70 cursor-pointer"
                            } flex items-center gap-2 text-primary-content px-6 py-2 rounded-full font-medium duration-300 transition-all`}>
                            <Save className="size-4" />
                            <span>{isInitializing ? "Connecting..." : "Save Note"}</span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-base-100/10 backdrop-blur-sm w-full flex flex-col gap-2 grow border border-primary-content/20 rounded-2xl p-4 sm:p-6">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                        <input
                            onChange={(e) => setNote({ ...note, title: e.target.value })}
                            value={note.title}
                            type="text"
                            className="text-primary-content/70 w-full bg-transparent border-0 outline-none text-lg italic"
                            placeholder="What's on your mind?"
                            autoFocus
                        />
                        <Trash2Icon onClick={handleDelete} className="size-5 text-white/10 hover:text-red-500 cursor-pointer duration-300" />
                        <Pin
                            onClick={() => setNote({ ...note, isPinned: !note.isPinned })}
                            className={`size-5 cursor-pointer duration-300 ${note.isPinned ? "text-primary fill-primary rotate-45" : "text-white/20 hover:text-primary"}`}
                        />
                        <Star
                            onClick={() => setNote({ ...note, favorite: !note.favorite })}
                            className={`size-5 cursor-pointer duration-300 ${note.favorite ? "text-yellow-500 fill-yellow-500" : "text-white/20 hover:text-yellow-500"}`}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 py-4 border-y border-white/5">
                        <div className="flex items-center gap-2 py-2 px-1 bg-base-100/50 border border-base-content/20 rounded-xl text-xs">
                            <Tag className="size-3.5 text-primary" />
                            <select onChange={(e) => setNote({ ...note, tag: e.target.value })} value={note.tag} className="bg-base-100 outline-none cursor-pointer">
                                <option value="General">General</option>
                                <option value="Personal">Personal</option>
                                <option value="Code">Code</option>
                                <option value="Ideas">Ideas</option>
                                <option value="Work">Work</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => setAutoSync((prev) => !prev)}
                            className={`${
                                autoSync ? "bg-primary text-primary-content" : "bg-base-100/50 text-base-content"
                            } flex items-center gap-2 p-2 border border-base-content/20 rounded-xl text-xs transition-colors duration-300`}>
                            <Sparkles className={`${autoSync ? "text-white" : "text-primary"} size-3.5`} />
                            <span>Auto-Syncing {autoSync ? "ON" : "OFF"}</span>
                        </button>
                    </div>

                    <textarea
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                        value={note.content}
                        className="text-primary-content/50 p-4 border border-primary-content/10 rounded-2xl outline-none h-full resize-none bg-transparent"
                        placeholder="Start typing your ideas here..."
                    />
                </form>

                <p className="w-full text-center mt-8 text-[10px] text-base-content/40 font-bold uppercase tracking-[0.4em]">Your words are automatically saved to your local vault</p>
            </div>
        </div>
    );
};

export default UpdateNotePage;
