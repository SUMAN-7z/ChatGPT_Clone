import express from "express";
import getGeminiResponse from "../utils/gemini.js";
import Thread from "../models/Schema.js";
const router = express.Router();

// router.post("/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     if (!message) {
//       return res.status(400).json({
//         error: "Message is required",
//       });
//     }

//     const response = await getGeminiResponse(message);

//     return res.json({
//       success: true,
//       response,
//     });
//   } catch (error) {
//     console.error(error);

//     return res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Failed to Fatch threads",
    });
  }
});

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const thread = await Thread.findOne({ threadId });
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

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread is not found" });
    }
    return res.status(200).json({
      success: "Thread deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});

router.post("/chat", async (req, res) => {
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
