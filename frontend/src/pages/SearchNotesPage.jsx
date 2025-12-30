import { Circle, Search } from "lucide-react";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NoteCard from "../components/NoteCard";

const SearchNotesPage = () => {
    const { notes, setNotes } = useContext(AuthContext);
    const [sortBy, setSortBy] = useState("new_to_old");
    const [filter, setFilter] = useState("title");
    const [favOnly, setFavOnly] = useState(false);
    const [query, setQuery] = useState("");

    const displayNotes = notes
        .filter((note) => {
            const matchesQuery = note[filter]?.toLowerCase().includes(query.toLowerCase());
            const matchesFav = favOnly ? note.favorite === true : true;
            return matchesQuery && matchesFav;
        })
        .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            return sortBy === "new_to_old" ? dateB - dateA : dateA - dateB;
        });

    return (
        <div className="min-h-screen flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 pt-4 sm:pt-6">
            {/* Filters / sidebar */}
            <div className="flex flex-col gap-4 sm:gap-5 items-start w-full lg:max-w-xs lg:sticky lg:top-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                    Search <span className="text-primary">Note</span>
                </h1>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border bg-base-100 border-primary-content/20 focus:border-primary-content/50 rounded-lg px-4 py-2.5 outline-none w-full text-base transition-colors"
                    type="text"
                    placeholder="Search notes..."
                />
                <div className="w-full bg-base-100/50 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-white/5">
                    <p className="font-semibold text-sm mb-3 text-gray-300">Filter By:</p>
                    <hr className="w-full my-3 border-white/5" />
                    <div className="flex flex-col gap-2">
                        {["title", "content", "tag"].map((type) => (
                            <div key={type} className="w-full">
                                <label htmlFor={type} className="flex cursor-pointer items-center justify-between py-1.5 hover:bg-white/5 rounded-lg px-2 transition-colors">
                                    <input id={type} type="radio" name="method" className={`peer hidden`} checked={filter === type} onChange={(e) => setFilter(e.target.id)} />
                                    <span className="capitalize text-sm font-medium">{type}</span>
                                    <Circle className={`size-4 sm:size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all`} />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-full bg-base-100/50 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-white/5">
                    <label htmlFor="fav" className="cursor-pointer flex items-center justify-between py-1.5 hover:bg-white/5 rounded-lg px-2 transition-colors">
                        <input checked={favOnly} onChange={() => setFavOnly(!favOnly)} className="hidden peer" type="checkbox" id="fav" />
                        <span className="text-sm font-medium">Favorite Only</span>
                        <Circle className="size-4 sm:size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all" />
                    </label>
                </div>
                <div className="w-full bg-base-100/50 backdrop-blur-sm px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-white/5">
                    <p className="font-semibold text-sm mb-3 text-gray-300">Sort By:</p>
                    <hr className="w-full my-3 border-white/5" />
                    <div className="flex flex-col gap-2">
                        {["new_to_old", "old_to_new"].map((type) => (
                            <div key={type} className="w-full">
                                <label htmlFor={type} className="flex cursor-pointer items-center justify-between py-1.5 hover:bg-white/5 rounded-lg px-2 transition-colors">
                                    <input id={type} type="radio" name="sortBy" className={`peer hidden`} checked={sortBy === type} onChange={(e) => setSortBy(e.target.id)} />
                                    <span className="capitalize text-sm font-medium">{type.replace(/_/g, " ")}</span>
                                    <Circle className={`size-4 sm:size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all`} />
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 grow scrollbar-thin w-full">
                {displayNotes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50">
                        <Search className="size-12 sm:size-16 mb-4 text-gray-400" />
                        <p className="text-lg sm:text-xl text-gray-400">No notes found matching "{query}"</p>
                    </div>
                ) : (
                    displayNotes.map((note) => <NoteCard setNotes={setNotes} key={note._id} note={note} />)
                )}
            </div>
        </div>
    );
};

export default SearchNotesPage;
