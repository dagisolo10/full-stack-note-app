import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from "./pages/WelcomePage";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import { Navigate, Route, Routes, useLocation } from "react-router";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AddNotePage from "./pages/AddNotePage";
import Notes from "./pages/Notes";
import NoteDashboard from "./pages/NoteDashboard";
import UpdateNotePage from "./pages/UpdateNotePage";
import SearchNotesPage from "./pages/SearchNotesPage";
import api from "./config/axios";
import AdminDashboard from "./pages/AdminDashboard";
import ProfilePage from "./pages/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
    const location = useLocation().pathname;
    const [user, setUser] = useState(null);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/get-profile", {
                    // Mark this request to suppress error logging
                    validateStatus: (status) => status < 500, // Don't throw for 4xx errors
                });
                if (res.status === 200 && res.data) {
                    setUser(res.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                // Only log unexpected errors (network errors, etc.)
                if (error?.response?.status !== 401 && error?.response?.status !== 403) {
                    console.error("Auth check error:", error);
                }
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <div className="relative min-h-screen w-full">
            <div className="fixed inset-0 pointer-events-none -z-50">
                {/* grid boxes - behind everything */}
                <div className="absolute inset-0 grid grid-box w-full z-0">
                    {[...Array(400)].map((_, i) => (
                        <div key={i} className="relative w-full border-gray-50/10 border-b border-l aspect-square" />
                    ))}
                </div>
                {/* glow effect - on top of grid */}
                <div className="absolute inset-0 left-1/2 -translate-x-1/2 w-full h-screen z-10">
                    <div className="w-full h-full background-glow" />
                </div>
            </div>

            <AuthContext.Provider value={{ user, setUser, notes, setNotes, loading, fetching, setFetching }}>
                <ScrollToTop />
                {location !== "/login" && location !== "/signup" && <NavBar />}
                <main className="relative z-10 pb-8 sm:pb-12">
                    <Routes>
                        <Route element={<PublicRoute />}>
                            <Route path="/" element={<WelcomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignUpPage />} />
                        </Route>
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            <Route element={<AdminDashboard />} path="/admin-dashboard" />
                        </Route>

                        <Route element={<ProtectedRoute />}>
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/add-note" element={<AddNotePage />} />
                            <Route path="/notes" element={<Notes />} />
                            <Route path="/search-notes" element={<SearchNotesPage />} />
                            <Route path="/notes/update/:id" element={<UpdateNotePage />} />
                            <Route path="/note-dashboard" element={<NoteDashboard />} />
                        </Route>

                        <Route path="*" element={<Navigate to={user ? "/home" : "/"} />} />
                    </Routes>
                </main>
            </AuthContext.Provider>
        </div>
    );
};

export default App;
