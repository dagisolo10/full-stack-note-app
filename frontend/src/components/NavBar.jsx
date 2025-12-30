import { Link, useLocation, useNavigate } from "react-router";
import { LogIn, LogOut, Menu, UserPlusIcon, X } from "lucide-react";
import { useContext, useState } from "react";
import api from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const NavBar = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [menu, setMenu] = useState(false);

    // console.log(user)
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
        <header className="bg-transparent mb-4 w-full px-4 sm:px-6 py-3 flex gap-4 justify-end items-center">
            {/* Mobile slide-over menu */}
            <div
                className={`fixed top-0 ${
                    menu ? "right-0" : "-right-full"
                } transition-all duration-300 bg-gray-900/95 backdrop-blur-md h-screen w-3/4 max-w-xs z-50 sm:hidden flex flex-col gap-6 items-start p-6`}>
                <button onClick={closeMenu} aria-label="Close navigation menu">
                    <X className="sm:hidden" />
                </button>
                {location !== "/" && (
                    <Link
                        to="/"
                        onClick={() => {
                            handleLogout();
                            closeMenu();
                        }}
                        className="duration-500 text-primary-content hover:text-gray-700">
                        <span>Logout</span>
                    </Link>
                )}
                {location === "/" && (
                    <Link to="/signup" onClick={closeMenu} className="duration-500 text-primary-content hover:text-gray-700">
                        <span>Signup</span>
                    </Link>
                )}
                {location === "/" && (
                    <Link to="/login" onClick={closeMenu} className="duration-500 text-primary-content hover:text-gray-700">
                        <span>Login</span>
                    </Link>
                )}
                {user && location !== "/profile" && (
                    <Link onClick={closeMenu} to="/profile">
                        <p className="duration-500 text-primary-content hover:text-gray-700">Profile</p>
                    </Link>
                )}
                {user && user.role === "admin" && location !== "/" && location !== "/admin-dashboard" && (
                    <Link onClick={closeMenu} to="/admin-dashboard">
                        <p className="duration-500 text-primary-content hover:text-gray-700">Admin Dashboard</p>
                    </Link>
                )}
            </div>

            {/* Brand */}
            <Link to="/" className="text-primary/70 mr-auto font-bold text-2xl sm:text-3xl whitespace-nowrap">
                <span>Note Base</span>
            </Link>

            {/* Mobile menu toggle */}
            <button onClick={toggleMenu} className="sm:hidden p-2 rounded-md hover:bg-base-100/20" aria-label="Open navigation menu">
                <Menu />
            </button>

            {/* Desktop links */}
            {user && location !== "/" && location !== "/admin-dashboard" && (
                <Link to="/admin-dashboard">
                    <p className="sm:block hidden font-bold text-lg hover:text-gray-400 duration-300 text-gray-200 tracking-tight">Admin Dashboard</p>
                </Link>
            )}
            {user && location !== "/" && (
                <Link to="/profile">
                    <p className="sm:flex hidden items-center justify-center size-8 btn btn-primary rounded-full cursor-pointer">{user.fullName[0]}</p>
                </Link>
            )}
            {location === "/" && (
                <Link to="/signup" className="sm:flex hidden  gap-2 items-center bg-primary duration-500 hover:bg-primary/50 rounded-lg px-4 py-2">
                    <UserPlusIcon className="size-5" />
                    <span>Signup</span>
                </Link>
            )}
            {location === "/" && (
                <Link to="/login" className="sm:flex hidden  gap-2 items-center bg-base-100 duration-500 hover:bg-gray-700 rounded-lg px-4 py-2">
                    <LogIn className="size-5" />
                    <span>Login</span>
                </Link>
            )}
            {location !== "/" && (
                <Link to="/" onClick={handleLogout} className="sm:flex hidden  gap-2 items-center bg-base-100 duration-500 group hover:bg-gray-700 rounded-lg px-4 py-2">
                    <span>Logout</span>
                    <LogOut className="size-5 group-hover:translate-x-2 duration-300" />
                </Link>
            )}
        </header>
    );
};

export default NavBar;
