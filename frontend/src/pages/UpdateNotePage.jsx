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
        <div className="min-h-screen pb-4">
            <div className="max-w-4xl w-full mx-auto flex flex-col items-start px-4 sm:px-6 lg:px-8">
                {/* Header */}

                <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                    <Link to="/home" className="group flex items-center gap-2 text-white/40 hover:text-primary transition-colors">
                        <ChevronLeft className="size-5 group-hover:-translate-x-1 duration-300" />
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">Exit Editor</span>
                    </Link>

                    <div className="flex sm:flex-row items-center sm:items-center gap-3 sm:gap-6 w-full sm:w-auto">
                        <div className="flex sm:flex-row-reverse items-center gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
                            <button
                                type="button"
                                disabled={autoSync || isInitializing}
                                onClick={handleSubmit}
                                className={`${
                                    autoSync || isInitializing ? "opacity-20 cursor-not-allowed bg-base-300" : "bg-primary/30 hover:bg-primary/70 cursor-pointer"
                                } flex items-center gap-2 text-primary-content px-5 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium duration-300 transition-all text-sm sm:text-base`}>
                                <Save className="size-4" />
                                <span>{isInitializing ? "Connecting..." : "Save Note"}</span>
                            </button>
                            {isSaving ? (
                                <span className="text-primary animate-pulse flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary" />
                                    <span>Saving...</span>
                                </span>
                            ) : (
                                <span className="text-base-content/30 flex items-center gap-2">
                                    <ShieldCheck className="size-3 sm:size-4" />
                                    <span>{isInitializing ? "Initializing..." : "Saved to Cloud"}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-base-100/10 backdrop-blur-sm w-full flex flex-col gap-3 sm:gap-4 grow border border-primary-content/20 rounded-2xl p-4 sm:p-6 min-h-[500px] sm:min-h-[600px]">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                        <input
                            onChange={(e) => setNote({ ...note, title: e.target.value })}
                            value={note.title}
                            type="text"
                            className="text-primary-content/70 flex-1 min-w-[200px] bg-transparent border-0 outline-none text-base sm:text-lg lg:text-xl italic placeholder:text-white/20"
                            placeholder="What's on your mind?"
                            autoFocus
                        />
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button type="button" onClick={handleDelete} className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2Icon className="size-5 text-white/30 hover:text-red-500 cursor-pointer duration-300" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setNote({ ...note, isPinned: !note.isPinned })}
                                className={`p-2 rounded-lg transition-colors ${note.isPinned ? "bg-primary/20" : "hover:bg-white/5"}`}>
                                <Pin className={`size-5 cursor-pointer duration-300 ${note.isPinned ? "text-primary fill-primary rotate-45" : "text-white/20 hover:text-primary"}`} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setNote({ ...note, favorite: !note.favorite })}
                                className={`p-2 rounded-lg transition-colors ${note.favorite ? "bg-yellow-500/20" : "hover:bg-white/5"}`}>
                                <Star className={`size-5 cursor-pointer duration-300 ${note.favorite ? "text-yellow-500 fill-yellow-500" : "text-white/20 hover:text-yellow-500"}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-3 sm:py-4 border-y border-white/5">
                        <div className="flex items-center gap-2 py-2 px-2 sm:px-3 bg-base-100/50 border border-base-content/20 rounded-xl text-xs sm:text-sm">
                            <Tag className="size-3.5 sm:size-4 text-primary" />
                            <select onChange={(e) => setNote({ ...note, tag: e.target.value })} value={note.tag} className="bg-base-100 outline-none cursor-pointer text-xs sm:text-sm">
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
                            } flex items-center gap-2 p-2 sm:p-2.5 border border-base-content/20 rounded-xl text-xs sm:text-sm transition-colors duration-300`}>
                            <Sparkles className={`${autoSync ? "text-white" : "text-primary"} size-3.5 sm:size-4`} />
                            <span>Auto-Syncing {autoSync ? "ON" : "OFF"}</span>
                        </button>
                    </div>

                    <textarea
                        onChange={(e) => setNote({ ...note, content: e.target.value })}
                        value={note.content}
                        className="text-primary-content/50 p-4 sm:p-5 border border-primary-content/10 rounded-2xl outline-none flex-1 resize-none bg-transparent text-sm sm:text-base leading-relaxed placeholder:text-white/20"
                        placeholder="Start typing your ideas here..."
                    />
                </form>

                <p className="w-full text-center mt-6 sm:mt-8 text-[10px] sm:text-xs text-base-content/40 font-bold uppercase tracking-[0.4em] px-4">
                    Your words are automatically saved to your local vault
                </p>
            </div>
        </div>
    );
};

export default UpdateNotePage;
