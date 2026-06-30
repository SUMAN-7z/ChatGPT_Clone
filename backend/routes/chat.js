import express from "express";
import getGeminiResponse from "../utils/gemini.js";
import Thread from "../models/Schema.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
import { jwtAuthMiddleware } from "../utils/jwtAuthMiddleware.js";
import {
  signupValidation,
  loginValidation,
} from "../middleware/joivalidation.js";

const router = express.Router();

router.post("/signup", signupValidation, async (req, res) => {
  try {
    const { name, address, email, password } = req.body;
    if (!name || !address || !email || !password) {
      return res.status(500).json({
        success: false,
        message: "All fields are required!",
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      address,
      password: hashPassword,
      email,
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Login routes
router.post("/login", loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = await generateToken(payload);

    res.status(200).json({
      message: "User logged in successfully",
      token: token,
      username: user.name,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/thread", jwtAuthMiddleware, async (req, res) => {
  try {
    const threads = await Thread.find({ user: req.user.id }).sort({
      updatedAt: -1,
    });
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to Fatch threads",
    });
  }
});

router.get("/thread/:threadId", jwtAuthMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId, user: req.user.id });
    if (!thread) {
      return res.status(404).json({
        error: "Thread is not found",
      });
    }
    res.send(thread);
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch single data",
    });
  }
});

router.delete("/thread/:threadId", jwtAuthMiddleware, async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId,
      user: req.user.id,
    });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread is not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Thread deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});

router.post("/chat", jwtAuthMiddleware, async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({
      error: "Missing required field",
    });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      thread = new Thread({
        user: req.user.id,
        threadId,
        title: message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    } else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }

    const assistantReply = await getGeminiResponse(message);

    if (!assistantReply) {
      return res.status(500).json({
        error: "Failed to get response from Gemini",
      });
    }
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    return res.json({
      reply: assistantReply,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Something went wrong",
    });
  }
});
export default router;
