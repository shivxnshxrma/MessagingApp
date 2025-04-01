const express = require("express");
const multer = require("multer");
const path = require("path");
const Message = require("../models/Message");
const authMiddleware = require("../middleware/auth");
const { messageValidation } = require("../middleware/validation");
const optimizeImage = require("../middleware/imageOptimization");

const router = express.Router();

// 📂 Configure Multer for Media Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max size
});

// All test/debug endpoints must come first
router.get("/test/ping", (req, res) => {
  res.status(200).json({ message: "Messages API is working!" });
});

router.get("/debug", (req, res) => {
  res.status(200).json({ 
    message: "Messages debug endpoint working", 
    time: new Date().toISOString() 
  });
});

// Added test endpoint to check messages for a specific user
router.get("/user/debug", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    res.json({
      userId,
      message: "Messages user debug endpoint working",
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error in user debug endpoint:", error);
    res.status(500).json({ error: "Error in user debug endpoint" });
  }
});

// 📩 **Send Message (Text or Media)**
router.post(
  "/send",
  authMiddleware,
  upload.single("media"),
  optimizeImage,
  messageValidation,
  async (req, res) => {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user.id; // Extract from authentication middleware

      let mediaUrl = null;
      let mediaType = null;
      let thumbnailUrl = null;

      // ✅ If media is uploaded, set media URL and type
      if (req.file) {
        mediaUrl = `/uploads/${req.file.filename}`;
        mediaType = req.file.mimetype;
        
        if (req.file.thumbnail) {
          thumbnailUrl = req.file.thumbnail.url;
        }
      }

      // ✅ Save message to database
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        content: content || "", // Allow empty content for media-only messages
        mediaUrl,
        mediaType,
        thumbnailUrl,
      });

      await message.save();
      
      // Populate sender info
      await message.populate("sender", "username");
      
      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error("Message send error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// 📩 **Get Messages Between Two Users with Pagination**
router.get("/:otherUserId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.otherUserId;
    
    console.log(`Fetching messages between ${userId} and ${otherUserId}`);
    
    // Validate IDs
    if (!userId || !otherUserId || otherUserId.length < 12) {
      console.log('Invalid user IDs provided');
      return res.json({
        messages: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalMessages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }
    
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      // Get messages with pagination
      const messages = await Message.find({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      })
        .sort({ timestamp: -1 }) // Sort by newest first for pagination
        .skip(skip)
        .limit(limit)
        .populate("sender", "username")
        .lean();
      
      console.log(`Found ${messages.length} messages`);
      
      // Get total count for pagination info
      const totalMessages = await Message.countDocuments({
        $or: [
          { sender: userId, receiver: otherUserId },
          { sender: otherUserId, receiver: userId },
        ],
      });
      
      const totalPages = Math.ceil(totalMessages / limit);
      
      res.json({
        messages: messages.reverse(), // Reverse to show oldest first in the UI
        pagination: {
          currentPage: page,
          totalPages,
          totalMessages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } catch (dbError) {
      console.error("Database error fetching messages:", dbError);
      // Return an empty message array instead of failing
      res.json({
        messages: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalMessages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
        error: dbError.message
      });
    }
  } catch (error) {
    console.error("General error in messages route:", error);
    // Return empty messages array instead of error to prevent app crashes
    res.json({
      messages: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalMessages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
      error: error.message
    });
  }
});

module.exports = router;
