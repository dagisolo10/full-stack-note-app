const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const noteRoutes = require("./routes/note.route");
const errorMiddleware = require("./middlewares/error.middleware");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(
    cors({
        origin: ["http://localhost:5173", process.env.CLIENT_URL].filter(Boolean),
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
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
