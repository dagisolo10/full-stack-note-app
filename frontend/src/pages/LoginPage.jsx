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
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
            <h1 className="text-center mb-4 text-primary text-3xl sm:text-4xl font-bold">Welcome back</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-base-200 px-6 py-5 flex flex-col items-center gap-5 rounded-lg">
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="email">
                        Email   
                    </label>
                    <div className="flex items-center outline-0 outline-primary focus-within:outline group gap-2 px-4 py-2 bg-gray-700 rounded-md">
                        <MailIcon className="text-base-content/50 group-focus-within:text-primary" />
                        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full outline-none" id="email" placeholder="John Smith" type="text" />
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="password">
                        Password
                    </label>
                    <div className="flex items-center outline-0 outline-primary focus-within:outline group gap-2 px-4 py-2 bg-gray-700 rounded-md">
                        <Lock className="text-base-content/50 group-focus-within:text-primary" />
                        <input
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full outline-none"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                        />
                    </div>
                </div>
                <button className="bg-primary cursor-pointer duration-300 hover:bg-primary/50 flex justify-center items-center gap-2 px-12 py-2 rounded-md">
                    <LogIn className="size-5" />
                    <span>Login</span>
                </button>
                <div className="flex justify-center items-center gap-2">
                    <p>Don't have an account?</p>
                    <Link to="/signup" className="text-primary flex items-center gap-1 group">
                        <span>Signup</span>
                        <ArrowRightIcon className="duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
