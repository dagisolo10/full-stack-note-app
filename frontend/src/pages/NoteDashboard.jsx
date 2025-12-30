import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { BarChart3, BookOpen, Clock, Pin, Star, Tag } from "lucide-react";

const NoteDashboard = () => {
    const { notes } = useContext(AuthContext);

    const totalCount = notes.length;
    const pinnedCount = notes.filter((note) => note.isPinned === true).length;
    const favCount = notes.filter((note) => note.favorite === true).length;
    const total = notes.reduce((acc, note) => {
        const words = note.content
            ? note.content
                  .trim()
                  .split(/\s+/)
                  .filter((word) => word.length > 0).length
            : 0;
        return acc + words;
    }, 0);
    const cards = [
        {
            heading: "Total Notes",
            icon: <BookOpen className="size-8 text-primary" />,
            value: totalCount,
        },
        {
            heading: "Pinned Notes",
            icon: <Pin className="size-8 group-hover:fill-secondary duration-500 text-secondary" />,
            value: pinnedCount,
        },
        {
            heading: "Favorite Notes",
            icon: <Star className="size-8 group-hover:fill-yellow-400 text-yellow-400" />,
            value: favCount,
        },
        {
            heading: "Total Word Count",
            icon: <Clock className="size-8 group-hover:text-primary text-primary-content" />,
            value: total,
        },
    ];

    return (
        <div className="max-w-11/12 mx-auto">
            <div>
                <div className="mb-6">
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <BarChart3 className="text-primary" /> Note Dashboard
                    </h1>
                    <p className="text-base-content/60 mt-2">Quantitative overview of your digital sanctuary.</p>
                </div>
                <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-cols-1 gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.heading}
                            className="group hover:border-primary border border-primary-content/20 duration-300 flex flex-col h-48 justify-between p-6 rounded-2xl bg-base-100/40 backdrop-blur-md">
                            <div className="flex justify-between w-full">
                                <p className="tracking-wide text-xl font-medium opacity-80">{card.heading}</p>
                                {card.icon}
                            </div>
                            <h1 className="group-hover:text-primary transition-all duration-300 text-4xl font-bold">{card.value}</h1>
                        </div>
                    ))}
                </div>
            </div>
            <div></div>
        </div>
    );
};

export default NoteDashboard;
