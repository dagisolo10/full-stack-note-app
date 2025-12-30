import React, { useEffect, useState, useContext } from "react";
import { Users, ShieldCheck, Trash2, UserPlus, ArrowLeft, Activity, Loader2 } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router";
import api from "../config/axios";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [isInternalLoading, setIsInternalLoading] = useState(true); // Track local data fetch
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsInternalLoading(true);
        try {
            const { data } = await api.get("/users");
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Access denied or server error", err);
        } finally {
            setIsInternalLoading(false);
        }
    };
    const handlePromote = async (id) => {
        try {
            await api.patch(`/users/promote/${id}`);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Promotion failed");
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Permanent deletion cannot be undone. Proceed?")) return;
        try {
            await api.delete(`/users/delete/${id}`);
            setUsers(users.filter((u) => u._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || "Delete failed");
        }
    };

    return (
        /* Added pt-24 to clear the Fixed NavBar */
        <div className="max-w-11/12 mx-auto mb-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
                        <ShieldCheck className="size-4" />
                        <span>Admin Authorization Active</span>
                    </div>
                    <h1 className="text-5xl pb-6 font-extrabold tracking-tight text-gradient-muted">
                        System <span className="text-primary">Registry.</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <StatBox icon={<Users />} label="Total Entities" value={users.length} />
                    <StatBox icon={<Activity />} label="Admins" value={users.filter((u) => u.role === "admin").length} />
                </div>
            </div>

            {/* Glass Table Container */}
            <div className="group relative bg-base-200/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-primary/20">
                <div className="card-glow-overlay opacity-20" />

                <div className="overflow-x-auto relative">
                    {isInternalLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Loader2 className="size-8 animate-spin text-primary mb-2" />
                            <p className="uppercase tracking-widest text-xs font-bold">Accessing Database...</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <p className="uppercase tracking-widest text-xs font-bold">No Records Found</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase text-xs tracking-[0.2em] font-bold">
                                    <th className="px-8 py-5">User Identification</th>
                                    <th className="px-8 py-5">Role Status</th>
                                    <th className="px-8 py-5 text-right">Administrative Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user) => (
                                    <tr key={user._id} className="group/row hover:bg-white/2 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-semibold text-base-content/90">{user.fullName}</span>
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border ${
                                                    user.role === "admin" ? "bg-primary/10 border-primary/20 text-primary" : "bg-gray-500/10 border-gray-500/20 text-gray-400"
                                                }`}>
                                                <div className={`size-1.5 rounded-full ${user.role === "admin" ? "bg-primary animate-pulse" : "bg-gray-500"}`} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3">
                                                {user.role !== "admin" && (
                                                    <button
                                                        onClick={() => handlePromote(user._id)}
                                                        className="p-2 rounded-xl bg-base-300 text-primary hover:bg-primary hover:text-white transition-all duration-300"
                                                        title="Promote to Admin">
                                                        <UserPlus className="size-5" />
                                                    </button>
                                                )}
                                                {user._id !== currentUser?._id && (
                                                    <button
                                                        onClick={() => handleDelete(user._id)}
                                                        className="p-2 rounded-xl bg-base-300 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                        title="Delete User">
                                                        <Trash2 className="size-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <Link to="/home" className="inline-flex items-center gap-2 mt-8 text-gray-500 hover:text-primary transition-colors font-medium uppercase text-xs tracking-widest">
                <ArrowLeft className="size-4" />
                Return to Command Center
            </Link>
        </div>
    );
};

const StatBox = ({ icon, label, value }) => (
    <div className="bg-base-200/40 backdrop-blur-md border border-white/5 p-4 rounded-2xl min-w-[160px]">
        <div className="flex items-center gap-3 text-primary mb-1 opacity-80">
            {React.cloneElement(icon, { size: 16 })}
            <span className="text-[12px] uppercase font-bold tracking-tighter text-gray-400">{label}</span>
        </div>
        <div className="text-2xl font-bold text-base-content/90">{value}</div>
    </div>
);

export default AdminDashboard;
