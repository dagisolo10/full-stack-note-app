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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center pb-10">
            {/* Header / Back Link */}
            <div className="w-full flex justify-start mb-8">
                <Link to="/home" className="inline-flex items-center gap-2 text-gray-500 group hover:text-primary transition-colors font-medium uppercase text-xs tracking-widest">
                    <ArrowLeft className="size-4 group-hover:-translate-x-4 duration-300" />
                    Back to thoughts
                </Link>
            </div>

            {/* Profile Glass Card */}
            <div className="group relative w-full bg-base-200/40 backdrop-blur-md border border-white/5 rounded-4xl p-8 md:p-12 transition-all duration-500 hover:border-primary/20 shadow-2xl">
                {/* <div className="card-glow-overlay opacity-10" /> */}

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Avatar Section */}
                    <div className="relative">
                        <div className="size-32 rounded-3xl bg-linear-to-br from-primary/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                            <User className="size-16 text-primary opacity-80" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-base-300 border border-white/10 p-2 rounded-xl text-primary shadow-lg">
                            <Shield className="size-5" />
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                            {user.role} Status
                        </div>
                        <h1 className="text-4xl font-extrabold pb-3 text-gradient-muted mb-2">{user.fullName}</h1>
                        {/* <p className="text-gray-400 text-lg mb-6">{user.email}</p> */}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoTile icon={<Mail />} label="Primary Email" value={user.email} />
                            <InfoTile icon={<Calendar />} label="Account Type" value={user.role === "admin" ? "Administrative" : "Standard"} />
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/5 my-6" />

                {/* Actions Section */}
                <div className="relative flex flex-wrap gap-4 justify-center md:justify-start">
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-all font-medium">
                        <Key className="size-4" />
                        Change Password
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium">
                        <LogOut className="size-4" />
                        Terminate Session
                    </button>
                </div>
            </div>

            {/* Subtle bottom text */}
            <p className="mt-6 text-gray-600 text-[10px] uppercase tracking-[0.3em] font-bold">NoteBase Security Protocol v2.4.0</p>
        </div>
    );
};

const InfoTile = ({ icon, label, value }) => (
    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
        <div className="p-2 rounded-lg bg-base-300 text-primary opacity-70">{React.cloneElement(icon, { size: 18 })}</div>
        <div className="text-left">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{label}</p>
            <p className="text-sm font-semibold text-base-content/90">{value}</p>
        </div>
    </div>
);

export default ProfilePage;
