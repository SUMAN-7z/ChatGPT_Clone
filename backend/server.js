import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", chatRouter);

app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Database + Server Start
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

startServer();