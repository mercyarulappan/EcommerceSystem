const express = require("express");
const router = express.Router();
const {
  updateReview,
  getReviewById,
} = require("../controllers/reviewController");
const { verifyAdmin } = require("../middleware/authMiddleware");

// GET review by id (optional, for pre-fill)
router.get("/:id", verifyAdmin, getReviewById);

// PUT update review
router.put("/:id", verifyAdmin, updateReview);

module.exports = router;
