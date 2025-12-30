const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");

exports.getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({ userId: req.user._id }).sort({
        createdAt: -1,
    });
    if (notes.length === 0) {
        return res.status(404).json({ message: "No note added yet." });
    }

    res.status(200).json(notes);
});
exports.getNote = asyncHandler(async (req, res) => {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) {
        return res.status(404).json({ message: "No note found." });
    }
    res.status(200).json({ message: "here is your note", note });
});
exports.addNote = asyncHandler(async (req, res) => {
    const { title, content, tag } = req.body;
    const note = await Note.create({ title, content, tag, userId: req.user._id });
    res.status(201).json({ message: "Note added successfully", note });
});
exports.deleteNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) {
        return res.status(404).json({ message: "Note not found!" });
    }
    const { user, ...noteData } = note.toObject();
    res.status(200).json({
        message: "Note deleted successfully.",
        note: noteData,
    });
});
exports.deleteAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.deleteMany({ userId: req.user._id });
    if (notes.deletedCount === 0) {
        return res.status(404).json({ message: "No notes found to delete!" });
    }
    res.status(200).json({
        message: "All notes deleted successfully",
        deletedCount: notes.deletedCount,
    });
});
exports.updateNote = asyncHandler(async (req, res) => {
    const note = await Note.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    if (!note) return res.status(404).json({ message: "Note not found!" });

    const { user, ...noteData } = note.toObject();
    res.status(200).json({
        message: "Note updated successfully.",
        note: noteData,
    });
});
