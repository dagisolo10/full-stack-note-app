const express = require("express");
const { getAllUsers, deleteAllUsers, deleteUser, promoteUser, terminateAccount } = require("../controllers/user.controller");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.delete("/terminate/:id", protect, terminateAccount);
router.delete("/delete", protect, adminOnly, deleteAllUsers);
router.delete("/delete/:id", protect, adminOnly, deleteUser);
router.patch("/promote/:id", protect, adminOnly, promoteUser);

module.exports = router;
