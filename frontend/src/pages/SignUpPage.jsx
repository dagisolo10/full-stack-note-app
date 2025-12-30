import { ArrowRightIcon, Lock, MailIcon, UserIcon, UserPlus } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import api from "../config/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const SignUpPage = () => {
    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email) return toast.error("Email is required.");
        if (!form.password) return toast.error("Password is required.");
        if (!form.fullName) return toast.error("Full Name is required.");
        if (form.password !== form.confirmPassword) return toast.error("Passwords do not match.");

        const res = await toast.promise(api.post("/auth/signup", { fullName: form.fullName, email: form.email, password: form.password }), {
            loading: "Signing up...",
            success: (res) => res?.data?.message || "Signed up successfully 🎉",
            error: (err) => err?.response?.data?.message || "Something went wrong. Try again.",
        });
        setUser(res.data.user);
        navigate("/home");
    };
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-center mb-4 text-primary text-4xl font-bold">Create your account</h1>
            <form onSubmit={handleSubmit} className="w-10/12 md:w-xl bg-base-200 px-6 py-4 flex flex-col items-center gap-1 md:gap-3 rounded-lg">
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="fullName">
                        Full Name
                    </label>
                    <div className="flex items-center gap-2 outline-0 outline-primary focus-within:outline group px-4 py-2 bg-gray-700 rounded-md">
                        <UserIcon className="text-base-content/50 group-focus-within:text-primary" />
                        <input onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full outline-none" placeholder="John Smith" type="text" />
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="fullName">
                        Email
                    </label>
                    <div className="flex items-center gap-2 outline-0 outline-primary focus-within:outline group px-4 py-2 bg-gray-700 rounded-md">
                        <MailIcon className="text-base-content/50 group-focus-within:text-primary" />
                        <input onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full outline-none" placeholder="john@example.com" type="text" />
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="fullName">
                        Password
                    </label>
                    <div className="flex items-center gap-2 outline-0 outline-primary focus-within:outline group px-4 py-2 bg-gray-700 rounded-md">
                        <Lock className="text-base-content/50 group-focus-within:text-primary" />
                        <input onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full outline-none" placeholder="••••••••" type="text" />
                    </div>
                </div>
                <div className="flex w-full flex-col">
                    <label className="label" htmlFor="fullName">
                        Confirm Password
                    </label>
                    <div className="flex items-center gap-2 outline-0 outline-primary focus-within:outline group px-4 py-2 bg-gray-700 rounded-md">
                        <Lock className="text-base-content/50 group-focus-within:text-primary" />
                        <input onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full outline-none" placeholder="••••••••" type="text" />
                    </div>
                </div>
                <button className="bg-primary flex justify-center items-center gap-2 px-12 py-2 rounded-md">
                    <UserPlus className="size-5" />
                    <span>Signup</span>
                </button>
                <div className="flex justify-center items-center gap-2">
                    <p>Already have an account?</p>
                    <Link to="/login" className="text-primary flex items-center gap-1 group">
                        <span>Login</span>
                        <ArrowRightIcon className="duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default SignUpPage;
