import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { PrismaClient } from "./generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/auth.js";
import pairingRoutes from "./routes/pairing.js";


dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/api", pairingRoutes);


/* ==========================
   AUTH ROUTES
========================== */

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ==========================
   WHISKEY ROUTES
========================== */

// Get all whiskeys
app.get("/whiskeys", authenticateToken, async (req, res) => {
  try {
    const whiskeys = await prisma.whiskey.findMany({
      where: { userId: req.user.userId },
    });
    res.json(whiskeys);
  } catch (error) {
    console.error("Fetch whiskeys error:", error);
    res.status(500).json({ message: "Error fetching whiskeys" });
  }
});

// Add whiskey
app.post("/whiskeys", authenticateToken, async (req, res) => {
  try {
    const { name, type, notes } = req.body;
    if (!name)
      return res.status(400).json({ message: "Whiskey name is required" });

    const whiskey = await prisma.whiskey.create({
      data: { name, type, notes, userId: req.user.userId },
    });

    res.status(201).json(whiskey);
  } catch (error) {
    console.error("Add whiskey error:", error);
    res.status(500).json({ message: "Error adding whiskey" });
  }
});

/* ==========================
   CIGAR ROUTES
========================== */

// Get all cigars
app.get("/cigars", authenticateToken, async (req, res) => {
  try {
    const cigars = await prisma.cigar.findMany({
      where: { userId: req.user.userId },
    });
    res.json(cigars);
  } catch (error) {
    console.error("Fetch cigars error:", error);
    res.status(500).json({ message: "Error fetching cigars" });
  }
});

// Add cigar
app.post("/cigars", authenticateToken, async (req, res) => {
  try {
    const { name, strength, flavor } = req.body;
    if (!name)
      return res.status(400).json({ message: "Cigar name is required" });

    const cigar = await prisma.cigar.create({
      data: { name, strength, flavor, userId: req.user.userId },
    });

    res.status(201).json(cigar);
  } catch (error) {
    console.error("Add cigar error:", error);
    res.status(500).json({ message: "Error adding cigar" });
  }
});

/* ==========================
   SEARCH WHISKEY ROUTE
========================== */

app.get("/api/search-whiskey", async (req, res) => {
  const query = req.query.q;
  console.log("Received search request:", query);

  try {
    const apiUrl = `https://whiskyhunter.net/api/whisky-search?query=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error("Whisky Hunter API error:", response.status);
      return res.status(500).json({ message: "External API error", status: response.status });
    }

    const data = await response.json();
    console.log(`Fetched ${data.count || 0} results`);
    res.json(data.results || []);
  } catch (error) {
    console.error("Error fetching whiskey data:", error.message);
    res.status(500).json({ message: "Error fetching whiskey data", error: error.message });
  }
});


/* ==========================
   GLOBAL ERROR & SHUTDOWN HANDLERS
========================== */

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("🛑 Prisma disconnected, shutting down server...");
  process.exit(0);
});

/* ==========================
   START SERVER
========================== */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
