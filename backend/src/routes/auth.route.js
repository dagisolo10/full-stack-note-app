const express = require("express");
const { login, logout, signup, getProfile, refreshToken } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-profile", protect, getProfile);
router.post("/refresh-token", refreshToken);

module.exports = router;
