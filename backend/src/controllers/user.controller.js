const User = require("../models/User");
const asyncHandler = require("express-async-handler");

exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password");
    if (users.length === 0) return res.status(404).json({ message: "No users found" });

    res.status(200).json(users);
});
exports.deleteAllUsers = asyncHandler(async (req, res) => {
    if (!req.user?._id) return res.status(401).json({ message: "Unauthorized" });

    const result = await User.deleteMany({ _id: { $ne: req.user._id } });

    res.status(200).json({ message: "Operation completed", deleteCount: result.deletedCount });
});
exports.deleteUser = asyncHandler(async (req, res) => {
    if (req.params.id.toString() === req.user._id.toString()) return res.status(400).json({ message: "You cannot delete your own admin account." });
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully", user });
});
exports.promoteUser = asyncHandler(async (req, res) => {
    if (req.params.id.toString() === req.user._id.toString()) return res.status(400).json({ message: "You are already an admin" });
    const user = await User.findById(req.params.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "User is already an admin" });

    user.role = "admin";
    await user.save();

    res.status(200).json({ message: "User promoted to admin", user });
});
exports.terminateAccount = asyncHandler(async (req, res) => {
    if (req.params.id.toString() !== req.user._id.toString()) return res.status(403).json({ message: "You can only delete your own account" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Account terminated successfully" });
});
