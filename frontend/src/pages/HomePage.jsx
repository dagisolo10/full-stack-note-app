import { Link } from "react-router";
import { PlusCircle, BookOpen, LayoutDashboard, Sparkles, Search } from "lucide-react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../config/axios";

const HomePage = () => {
    const { setNotes } = useContext(AuthContext);

    useEffect(() => {
        const fetchNotes = async () => {
            const res = await api.get("/notes");
            const sorted = res.data.sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
            setNotes(sorted);
        };
        fetchNotes();
    }, [setNotes]);

    return (
        <div className="max-w-6xl mx-auto flex flex-col items-center mb-12 px-4">
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xl font-medium mb-6 animate-pulse">
                    <Sparkles className="size-3" />
                    <span>Welcome back to NoteBase</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-gradient-muted">
                    Where thoughts <br /> become <span className="text-primary">clarity.</span>
                </h1>

                <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed">Your digital sanctuary for ideas. Organized, secure, and always within reach.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 w-full max-w-5xl">
                <HomeCard to="/add-note" icon={<PlusCircle className="size-8" />} title="Quick Note" description="Capture a thought before it's gone." color="hover:border-blue-500/50" />
                <HomeCard to="/notes" icon={<BookOpen className="size-8" />} title="Library" description="Dive back into your collection of ideas." color="hover:border-accent/50" />
                <HomeCard to="/search-notes" icon={<Search className="size-8" />} title="Search Vault" description="Locate any thought or tag instantly." color="hover:border-secondary/50" />
                <HomeCard to="/note-dashboard" icon={<LayoutDashboard className="size-8" />} title="Insights" description="Analyze your productivity and habits." color="hover:border-purple-500/50" />
            </div>

            <p className="mt-6 text-base-content/40 text-sm font-medium tracking-widest uppercase opacity-50">"Small notes today become big ideas tomorrow."</p>
        </div>
    );
};

const HomeCard = ({ to, icon, title, description, color }) => {
    return (
        <Link
            to={to}
            className={`group relative bg-base-200/40 backdrop-blur-md border border-white/5 rounded-2xl px-8 py-4 transition-all duration-500 hover:-translate-y-2 hover:bg-base-200/80 ${color}`}>
            <div className="card-glow-overlay" />

            <div className="relative">
                <div className="mb-4 inline-block p-3 rounded-xl bg-base-300 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">{icon}</div>
                <h2 className="text-xl font-bold text-base-content/80 mb-2">{title}</h2>
                <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            </div>
        </Link>
    );
};

export default HomePage;
