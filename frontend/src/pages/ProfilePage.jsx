import React, { useContext } from "react";
import { User, Mail, Shield, Calendar, ArrowLeft, LogOut, Key } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import api from "../config/axios";

const ProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            navigate("/");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center pb-12 sm:pb-16 pt-4 sm:pt-6">
            {/* Header / Back Link */}
            <div className="w-full flex justify-start mb-6 sm:mb-8">
                <Link to="/home" className="inline-flex items-center gap-2 text-gray-500 group hover:text-primary transition-colors font-medium uppercase text-xs tracking-widest">
                    <ArrowLeft className="size-4 group-hover:-translate-x-1 duration-300" />
                    <span>Back to thoughts</span>
                </Link>
            </div>

            {/* Profile Glass Card */}
            <div className="group relative w-full bg-base-200/40 backdrop-blur-md border border-white/5 rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 lg:p-12 transition-all duration-500 hover:border-primary/20 shadow-2xl">
                {/* <div className="card-glow-overlay opacity-10" /> */}

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 sm:gap-10">
                    {/* Avatar Section */}
                    <div className="relative flex-shrink-0">
                        <div className="size-24 sm:size-28 md:size-32 rounded-2xl sm:rounded-3xl bg-linear-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                            <User className="size-12 sm:size-14 md:size-16 text-primary opacity-80" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-base-300 border border-white/10 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-primary shadow-lg">
                            <Shield className="size-4 sm:size-5" />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left w-full">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            {user.role} Status
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold pb-2 sm:pb-3 text-gradient-muted mb-3 sm:mb-4">{user.fullName}</h1>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <InfoTile icon={<Mail />} label="Primary Email" value={user.email} />
                            <InfoTile icon={<Calendar />} label="Account Type" value={user.role === "admin" ? "Administrative" : "Standard"} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/5 my-6 sm:my-8" />

                {/* Actions Section */}
                <div className="relative flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
                    <button className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium text-sm sm:text-base">
                        <Key className="size-4" />
                        <span>Change Password</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium text-sm sm:text-base">
                        <LogOut className="size-4" />
                        <span>Terminate Session</span>
                    </button>
                </div>
            </div>

            {/* Subtle bottom text */}
            <p className="mt-6 sm:mt-8 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">NoteBase Security Protocol v2.4.0</p>
        </div>
    );
};

const InfoTile = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4">
        <div className="p-2 rounded-lg bg-base-300 text-primary opacity-70 flex-shrink-0">{React.cloneElement(icon, { size: 18 })}</div>
        <div className="text-left min-w-0 flex-1">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1">{label}</p>
            <p className="text-sm sm:text-base font-semibold text-base-content/90 break-words">{value}</p>
        </div>
    </div>
);

export default ProfilePage;
