import { Link, useLocation, useNavigate } from "react-router";
import { LogIn, LogOut, Menu, UserPlusIcon, X } from "lucide-react";
import { useContext, useState } from "react";
import api from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import SideBarButton from "./SideBarButton";

const NavBar = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [menu, setMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await toast.promise(api.post("/auth/logout"), {
                loading: "Logging out...",
                success: (res) => res?.data?.message || "Logged out successfully! 🎉",
                error: (err) => err?.response?.data?.message || "Something went wrong. Try again.",
            });
            setUser(null); // Clear user state
            navigate("/");
        } catch (error) {
            // Even if logout fails, clear user state and navigate
            console.log(error);
            setUser(null);
            navigate("/");
        }
    };

    const closeMenu = () => setMenu(false);
    const toggleMenu = () => setMenu((prev) => !prev);

    return (
        <header className="bg-transparent mb-6 w-full px-4 sm:px-6 lg:px-8 py-4 flex gap-4 justify-end items-center">
            {/* Mobile slide-over menu */}
            <div
                className={`fixed top-0 ${
                    menu ? "right-0" : "-right-full"
                } transition-all duration-500 bg-gray-900/75 backdrop-blur-md h-screen w-3/4 max-w-xs z-50 sm:hidden flex flex-col gap-3 items-start p-8`}>
                <button onClick={closeMenu} aria-label="Close navigation menu" className="mb-2 p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="size-5" />
                </button>

                {location === "/" && <SideBarButton onClick={closeMenu} to="/signup" text="Signup" />}
                {location === "/" && <SideBarButton onClick={closeMenu} to="/login" text="Login" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/profile" text="Profile" />}
                {user && location !== "/" && user.role === "admin" && <SideBarButton onClick={closeMenu} to="/admin-dashbaord" text="Admin Dashboard" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/home" text="Home" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/notes" text="Notes" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/note-dashboard" text="Notes Overview" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/add-note" text="Add Note" />}
                {location !== "/" && <SideBarButton onClick={closeMenu} to="/search-notes" text="Search Note" />}
                {location !== "/" && (
                    <SideBarButton
                        onClick={() => {
                            handleLogout();
                            closeMenu();
                        }}
                        to="/"
                        text="Logout"
                    />
                )}
            </div>

            {/* Brand */}
            <Link to="/" className="text-primary/70 mr-auto font-bold text-2xl sm:text-3xl lg:text-4xl whitespace-nowrap hover:text-primary transition-colors duration-300">
                <span>Note Base</span>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={toggleMenu} className="sm:hidden p-2 rounded-lg hover:bg-base-100/20 transition-colors" aria-label="Open navigation menu">
                <Menu className="size-6" />
            </button>

            {/* Desktop links */}
            <div className="hidden sm:flex items-center gap-4 lg:gap-6">
                {user && location !== "/" && location !== "/admin-dashboard" && (
                    <Link to="/admin-dashboard" className="font-semibold text-base lg:text-lg hover:text-primary duration-300 text-gray-200 tracking-tight transition-colors">
                        <span>Admin Dashboard</span>
                    </Link>
                )}
                {user && location !== "/" && (
                    <Link to="/profile" className="flex items-center justify-center size-9 lg:size-10 btn btn-primary rounded-full cursor-pointer hover:scale-105 transition-transform duration-300">
                        <span className="text-sm lg:text-base font-semibold">{user.fullName[0]}</span>
                    </Link>
                )}
                {location === "/" && (
                    <Link to="/signup" className="flex gap-2 items-center bg-primary duration-300 hover:bg-primary/80 rounded-lg px-5 py-2.5 font-medium transition-all hover:scale-105">
                        <UserPlusIcon className="size-5" />
                        <span>Signup</span>
                    </Link>
                )}
                {location === "/" && (
                    <Link to="/login" className="flex gap-2 items-center bg-base-100 duration-300 hover:bg-gray-700 rounded-lg px-5 py-2.5 font-medium transition-all hover:scale-105">
                        <LogIn className="size-5" />
                        <span>Login</span>
                    </Link>
                )}
                {location !== "/" && (
                    <Link
                        to="/"
                        onClick={handleLogout}
                        className="flex gap-2 items-center bg-base-100 duration-300 group hover:bg-gray-700 rounded-lg px-5 py-2.5 font-medium transition-all hover:scale-105">
                        <span>Logout</span>
                        <LogOut className="size-5 group-hover:translate-x-2 duration-300" />
                    </Link>
                )}
            </div>
        </header>
    );
};

export default NavBar;
