import { ArrowRightIcon, Lock, LogIn, MailIcon } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import api from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email) return toast.error("Email is required.");
        if (!form.password) return toast.error("Password is required.");

        const res = await toast.promise(api.post("/auth/login", { email: form.email, password: form.password }), {
            loading: "Logging in...",
            success: (res) => res?.data?.message || "Logged in successfully! 🎉",
            error: (err) => err?.response?.data?.message || "Something went wrong. Try again.",
        });
        setUser(res.data.user);
        navigate("/home");
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 py-8 sm:py-12">
            <h1 className="text-center mb-6 sm:mb-8 text-primary text-3xl sm:text-4xl lg:text-5xl font-bold">Welcome back</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-base-200/50 backdrop-blur-sm px-6 sm:px-8 py-6 sm:py-8 flex flex-col items-center gap-5 sm:gap-6 rounded-2xl border border-white/5 shadow-xl">
                <div className="flex w-full flex-col gap-2">
                    <label className="label text-sm font-medium" htmlFor="email">
                        Email   
                    </label>
                    <div className="flex items-center outline-0 outline-primary focus-within:outline-2 focus-within:outline-primary/50 group gap-2 px-4 py-2.5 bg-gray-700 rounded-lg transition-all">
                        <MailIcon className="size-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full outline-none bg-transparent text-base" id="email" placeholder="john@example.com" type="email" />
                    </div>
                </div>
                <div className="flex w-full flex-col gap-2">
                    <label className="label text-sm font-medium" htmlFor="password">
                        Password
                    </label>
                    <div className="flex items-center outline-0 outline-primary focus-within:outline-2 focus-within:outline-primary/50 group gap-2 px-4 py-2.5 bg-gray-700 rounded-lg transition-all">
                        <Lock className="size-5 text-base-content/50 group-focus-within:text-primary transition-colors" />
                        <input
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full outline-none bg-transparent text-base"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>
                </div>
                <button className="w-full bg-primary cursor-pointer duration-300 hover:bg-primary/80 flex justify-center items-center gap-2 px-6 py-3 rounded-lg font-medium text-base mt-2 transition-all hover:scale-105">
                    <LogIn className="size-5" />
                    <span>Login</span>
                </button>
                <div className="flex flex-wrap justify-center items-center gap-2 text-sm">
                    <p className="text-gray-400">Don't have an account?</p>
                    <Link to="/signup" className="text-primary flex items-center gap-1 group font-medium hover:underline">
                        <span>Signup</span>
                        <ArrowRightIcon className="duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
