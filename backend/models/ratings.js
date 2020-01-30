var mongoose = require("mongoose");

var comment = new mongoose.Schema({
  lastReviewed: {
    type: String
  },
  value: {
    type: String
  }
});

var question = new mongoose.Schema({
  questionId: {
    type: String
  },
  notes: [comment],
  lastReviewed: {
    type: String
  }
});

var reviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.ObjectId
    },
    userId: {
      type: String
    },
    rating: {
      type: Number
    },
    comments: [comment],
    lastReviewed: {
      type: String
    },
    questionList: [question]
  },
  { collection: "Reviews" }
);

var Ratings = mongoose.model("Ratings", reviewSchema);

module.exports = Ratings;