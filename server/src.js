import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import enquiryRoutes from "./routes/enquiries.js";

const app = express();
const port = Number(process.env.PORT || 5000);
const clientOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server and local health checks with no Origin header.
    if (!origin || clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS"));
  },
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Inspiring Minds API" });
});

app.use("/api/enquiries", enquiryRoutes);

app.use((err, _req, res, _next) => {
  console.error(err.message);
  if (err.message === "Origin is not allowed by CORS") {
    return res.status(403).json({ message: "This origin is not allowed." });
  }
  return res.status(500).json({ message: "An unexpected server error occurred." });
});

async function start() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI. Copy .env.example to .env and configure MongoDB.");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
    app.listen(port, () => console.log(`Inspiring Minds API listening on port ${port}`));
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

start();
