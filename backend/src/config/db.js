const mongoose = require('mongoose');
require("dotenv").config();


const connectDB = async () => {
    mongoose.connect(process.env.MONGO_DB_URI)
    .then(() => console.log("MongoDB connected ✅"))
    .catch((err) => console.log("Failed to connect to MongoDB ❌", err.message))
}
module.exports = connectDB