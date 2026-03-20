import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, "Comment author is required"],
      trim: true,
      maxlength: 60
    },
    message: {
      type: String,
      required: [true, "Comment message is required"],
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

const projectIdeaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120
    },
    domain: {
      type: String,
      required: [true, "Domain is required"],
      enum: ["Web", "AI/ML", "IoT", "Mobile", "Cybersecurity", "Other"]
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required"],
      enum: ["Beginner", "Intermediate", "Advanced"]
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Completed"],
      default: "Open"
    },
    requiredSkills: {
      type: [String],
      default: []
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000
    },
    createdBy: {
      type: String,
      required: [true, "Creator name is required"],
      trim: true,
      maxlength: 80
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: {
      type: [commentSchema],
      default: []
    }
  },
  { timestamps: true }
);

projectIdeaSchema.index({ title: "text", description: "text", requiredSkills: "text" });

export const ProjectIdea = mongoose.model("ProjectIdea", projectIdeaSchema);
