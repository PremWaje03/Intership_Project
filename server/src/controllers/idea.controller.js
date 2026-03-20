import mongoose from "mongoose";
import { ProjectIdea } from "../models/projectIdea.model.js";

const parseSkills = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

export const createIdea = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      requiredSkills: parseSkills(req.body.requiredSkills)
    };

    const created = await ProjectIdea.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getIdeas = async (req, res) => {
  try {
    const { search, domain, difficulty, status, sort = "newest" } = req.query;

    const filter = {};

    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (status) filter.status = status;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { description: regex }, { requiredSkills: regex }];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      liked: { likes: -1, createdAt: -1 }
    };

    const query = ProjectIdea.find(filter).sort(sortMap[sort] || sortMap.newest);

    const ideas = await query.exec();
    return res.status(200).json(ideas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getIdeaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const idea = await ProjectIdea.findById(id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json(idea);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const payload = {
      ...req.body
    };

    if (req.body.requiredSkills !== undefined) {
      payload.requiredSkills = parseSkills(req.body.requiredSkills);
    }

    const updated = await ProjectIdea.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const deleted = await ProjectIdea.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json({ message: "Idea deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const likeIdea = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const updated = await ProjectIdea.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { author, message } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    if (!author || !message) {
      return res.status(400).json({ message: "Author and message are required" });
    }

    const updated = await ProjectIdea.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            author: String(author).trim(),
            message: String(message).trim()
          }
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getStats = async (_req, res) => {
  try {
    const [totalIdeas, totalLikes, domainStats, difficultyStats, statusStats] = await Promise.all([
      ProjectIdea.countDocuments(),
      ProjectIdea.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$likes" }
          }
        }
      ]),
      ProjectIdea.aggregate([
        {
          $group: {
            _id: "$domain",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      ProjectIdea.aggregate([
        {
          $group: {
            _id: "$difficulty",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]),
      ProjectIdea.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ])
    ]);

    return res.status(200).json({
      totalIdeas,
      totalLikes: totalLikes[0]?.total || 0,
      domainStats,
      difficultyStats,
      statusStats
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
