import express from "express";
import connectToDatabase from "./src/config/db.js";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
const corsOptions = {
  origin: "http://localhost:5173", // фронтенд на Vite
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // чтобы работали куки
};
app.use(cors(corsOptions));

// Routes
app.get("/", (_req, res) => {
  res.send("HomePage");
});
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, async () => {
  try {
    await connectToDatabase();
    console.log(`✅ Server running on http://localhost:${PORT}`);
  } catch (error) {
    console.error(" Failed to connect to MongoDB:", error.message);
  }
});
