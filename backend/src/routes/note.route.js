const express = require("express");
const { getAllNotes, getNote, addNote, updateNote, deleteAllNotes, deleteNote } = require("../controllers/note.controller");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllNotes);
router.get("/:id", protect, getNote);
router.post("/add", protect, addNote);
router.patch("/update/:id", protect, updateNote);
router.delete("/delete-all", protect, deleteAllNotes);
router.delete("/delete/:id", protect, deleteNote);

module.exports = router;
