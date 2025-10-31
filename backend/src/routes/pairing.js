import express from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { authenticateToken } from "../middleware/auth.js";
import OpenAI from "openai";

const router = express.Router();
const prisma = new PrismaClient();

// Initialize OpenAI (requires your API key in .env)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post("/pairing", authenticateToken, async (req, res) => {
  try {
    const { itemType, itemName } = req.body;
    const userId = req.user.userId;

    if (!itemType || !itemName) {
      return res.status(400).json({ message: "itemType and itemName are required" });
    }

    // Fetch the user’s full collection
    const whiskeys = await prisma.whiskey.findMany({ where: { userId } });
    const cigars = await prisma.cigar.findMany({ where: { userId } });

    // Determine pairing direction
    let prompt = "";
    if (itemType === "whiskey") {
      prompt = `You are an expert in whiskey and cigars. The user has selected the whiskey "${itemName}". 
      Their cigar collection includes: ${cigars.map(c => c.name).join(", ")}.
      Suggest the best pairing and explain why in 2–3 sentences.`;
    } else if (itemType === "cigar") {
      prompt = `You are an expert in whiskey and cigars. The user has selected the cigar "${itemName}". 
      Their whiskey collection includes: ${whiskeys.map(w => w.name).join(", ")}.
      Suggest the best pairing and explain why in 2–3 sentences.`;
    }

    // Call OpenAI (or simulate if key missing)
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        pairing: "Simulated pairing suggestion: Elijah Craig 18 pairs well with Padron 1964 due to complementary notes of oak, cocoa, and spice."
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const pairingText = completion.choices[0].message.content.trim();

    res.json({ pairing: pairingText });
  } catch (error) {
    console.error("Error generating pairing:", error.message);
    res.status(500).json({ message: "Error generating pairing", error: error.message });
  }
});

export default router;
