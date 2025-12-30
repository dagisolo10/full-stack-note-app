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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 pt-4 sm:pt-6">
            <div>
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold flex items-center gap-3 mb-2">
                        <BarChart3 className="size-8 sm:size-10 text-primary" /> <span>Note Dashboard</span>
                    </h1>
                    <p className="text-base-content/60 text-sm sm:text-base mt-2">Quantitative overview of your digital sanctuary.</p>
                </div>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {cards.map((card) => (
                        <div
                            key={card.heading}
                            className="group hover:border-primary border border-primary-content/20 duration-300 flex flex-col min-h-[180px] sm:h-48 justify-between p-5 sm:p-6 rounded-2xl bg-base-100/40 backdrop-blur-md transition-all hover:scale-105">
                            <div className="flex justify-between w-full items-start mb-4">
                                <p className="tracking-wide text-base sm:text-lg lg:text-xl font-medium opacity-80 pr-2">{card.heading}</p>
                                <div className="flex-shrink-0">{card.icon}</div>
                            </div>
                            <h1 className="group-hover:text-primary transition-all duration-300 text-3xl sm:text-4xl lg:text-5xl font-bold">{card.value}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NoteDashboard;
