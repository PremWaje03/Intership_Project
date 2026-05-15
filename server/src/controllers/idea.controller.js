import mongoose from "mongoose";
import { ProjectIdea } from "../models/projectIdea.model.js";
import { memoryIdeaStore } from "../store/memoryIdeaStore.js";

const isMongoMode = Boolean(process.env.MONGO_URI);

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

    if (!isMongoMode) {
      const createdIdea = memoryIdeaStore.create(payload);
      return res.status(201).json(createdIdea);
    }

    const created = await ProjectIdea.create(payload);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getIdeas = async (req, res) => {
  try {
    const { search, domain, difficulty, status, sort = "newest" } = req.query;

    if (!isMongoMode) {
      const ideas = memoryIdeaStore.list({ search, domain, difficulty, status, sort });
      return res.status(200).json(ideas);
    }

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

    if (isMongoMode && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    if (!isMongoMode) {
      const ideaRecord = memoryIdeaStore.findById(id);
      if (!ideaRecord) {
        return res.status(404).json({ message: "Idea not found" });
      }
      return res.status(200).json(ideaRecord);
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

    if (isMongoMode && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    const payload = {
      ...req.body
    };

    if (req.body.requiredSkills !== undefined) {
      payload.requiredSkills = parseSkills(req.body.requiredSkills);
    }

    if (!isMongoMode) {
      const updatedIdea = memoryIdeaStore.update(id, payload);
      if (!updatedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      return res.status(200).json(updatedIdea);
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

    if (isMongoMode && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    if (!isMongoMode) {
      const deletedIdea = memoryIdeaStore.delete(id);
      if (!deletedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      return res.status(200).json({ message: "Idea deleted" });
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

    if (isMongoMode && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    if (!isMongoMode) {
      const updatedIdea = memoryIdeaStore.like(id);
      if (!updatedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      return res.status(200).json(updatedIdea);
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

    if (isMongoMode && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid idea id" });
    }

    if (!author || !message) {
      return res.status(400).json({ message: "Author and message are required" });
    }

    if (!isMongoMode) {
      const updatedIdea = memoryIdeaStore.comment(id, String(author).trim(), String(message).trim());
      if (!updatedIdea) {
        return res.status(404).json({ message: "Idea not found" });
      }
      return res.status(200).json(updatedIdea);
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
    if (!isMongoMode) {
      return res.status(200).json(memoryIdeaStore.stats());
    }

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
