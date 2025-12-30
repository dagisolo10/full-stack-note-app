require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const noteRoutes = require("./routes/note.route");
const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT;
app.use(
    cors({
        origin: [process.env.CLIENT_URL, "http://localhost:5173"],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://locallost:${PORT}`));
});
