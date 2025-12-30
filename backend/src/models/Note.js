const mongoose =  require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        tag: {
            type: String,
            trim: true,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        favorite: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
