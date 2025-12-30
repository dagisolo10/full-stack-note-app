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
        <div className="min-h-screen flex flex-col lg:flex-row items-start justify-between gap-6 max-w-6xl mx-auto px-4 pb-8">
            {/* Filters / sidebar */}
            <div className="flex flex-col gap-4 items-start w-full lg:max-w-xs">
                <h1 className="text-4xl">
                    Search <span className="text-primary">Note</span>
                </h1>
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border bg-base-100 border-primary-content/20 focus:border-primary-content/50 rounded-md px-4 py-1 outline-none w-full"
                    type="text"
                />
                <div className="w-full bg-base-100 px-4 py-2 rounded-2xl">
                    <p>Filter By:</p>
                    <hr className="w-full my-2" />
                    {["title", "content", "tag"].map((type) => (
                        <div key={type} className="w-full">
                            <label htmlFor={type} className="flex cursor-pointer items-center justify-between">
                                <input id={type} type="radio" name="method" className={`peer hidden`} checked={filter === type} onChange={(e) => setFilter(e.target.id)} />
                                <span className="capitalize">{type}</span>
                                <Circle className={`size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all`} />
                            </label>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-base-100 px-4 py-2 rounded-2xl">
                    <label htmlFor="fav" className="cursor-pointer flex my-2 items-center justify-between">
                        <input checked={favOnly} onChange={() => setFavOnly(!favOnly)} className="hidden peer" type="checkbox" id="fav" />
                        <span>Favorite</span>
                        <Circle className="size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all" />
                    </label>
                </div>
                <div className="w-full bg-base-100 px-4 py-2 rounded-2xl">
                    <p>Sort By:</p>
                    <hr className="w-full my-2" />
                    {["new_to_old", "old_to_new"].map((type) => (
                        <div key={type} className="w-full">
                            <label htmlFor={type} className="flex cursor-pointer items-center justify-between">
                                <input id={type} type="radio" name="sortBy" className={`peer hidden`} checked={sortBy === type} onChange={(e) => setSortBy(e.target.id)} />
                                <span className="capitalize">{type}</span>
                                <Circle className={`size-5 text-gray-400 peer-checked:fill-primary peer-checked:text-primary transition-all`} />
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Results grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow scrollbar-thin w-full">
                {displayNotes.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center opacity-50">
                        <Search className="size-12 mb-4" />
                        <p className="text-xl">No notes found matching "{query}"</p>
                    </div>
                ) : (
                    displayNotes.map((note) => <NoteCard setNotes={setNotes} key={note._id} note={note} />)
                )}
            </div>
        </div>
    );
};

export default SearchNotesPage;
