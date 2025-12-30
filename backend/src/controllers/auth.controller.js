const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
require("dotenv").config();

const generateToken = (userId) => {
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN, {
        expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN, {
        expiresIn: "7d",
    });
    return { accessToken, refreshToken };
};
const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevents XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true, // prevents XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
const storeAccessToken = async (userId, refreshToken) => {
    await redis.set(`refresh-token:${userId}`, refreshToken, { ex: 7 * 24 * 60 * 60 });
};
exports.signup = asyncHandler(async (req, res) => {
    const { fullName, email, password, adminCode } = req.body;
    const existing = await User.findOne({ email });

    if (existing) return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ fullName, email, password, role: adminCode === process.env.ADMIN_CODE ? "admin" : "user" });

    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeAccessToken(user._id, refreshToken);

    res.status(201).json({
        message: "User created successfully!",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
    });
});
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateToken(user._id);
    setCookies(res, accessToken, refreshToken);
    await storeAccessToken(user._id, refreshToken);

    res.status(200).json({
        message: "Logged in successfully!",
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
    });
});
exports.logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        await redis.del(`refresh-token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({ message: "Logged out successfully!" });
});
exports.refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const storedToken = await redis.get(`refresh-token:${decoded.userId}`);

    if (refreshToken !== storedToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN, { expiresIn: "15m" });

    res.cookie("accessToken", accessToken, {
        httpOnly: true, // prevents XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // prevents CSRF attack
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
    res.json({ message: "Token refreshed successfully!" });
});
exports.getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
});
