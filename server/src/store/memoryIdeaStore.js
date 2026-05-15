import crypto from "crypto";

const ideas = [];

const nowIso = () => new Date().toISOString();

const toCountArray = (records, key) => {
  const counts = records.reduce((acc, item) => {
    const value = item[key] || "Unknown";
    acc.set(value, (acc.get(value) || 0) + 1);
    return acc;
  }, new Map());

  return [...counts.entries()]
    .map(([id, count]) => ({ _id: id, count }))
    .sort((a, b) => b.count - a.count);
};

const searchMatch = (idea, search) => {
  if (!search) return true;
  const term = String(search).toLowerCase();
  return (
    idea.title.toLowerCase().includes(term) ||
    idea.description.toLowerCase().includes(term) ||
    idea.requiredSkills.some((skill) => String(skill).toLowerCase().includes(term))
  );
};

export const memoryIdeaStore = {
  create(payload) {
    const now = nowIso();
    const idea = {
      _id: crypto.randomUUID(),
      title: payload.title,
      domain: payload.domain,
      difficulty: payload.difficulty,
      status: payload.status || "Open",
      requiredSkills: payload.requiredSkills || [],
      description: payload.description,
      createdBy: payload.createdBy,
      likes: Number(payload.likes || 0),
      comments: [],
      createdAt: now,
      updatedAt: now
    };

    ideas.push(idea);
    return idea;
  },

  list({ search, domain, difficulty, status, sort = "newest" }) {
    let filtered = ideas.filter((idea) => {
      if (domain && idea.domain !== domain) return false;
      if (difficulty && idea.difficulty !== difficulty) return false;
      if (status && idea.status !== status) return false;
      if (!searchMatch(idea, search)) return false;
      return true;
    });

    filtered = [...filtered];
    if (sort === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "liked") {
      filtered.sort((a, b) => b.likes - a.likes || new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  },

  findById(id) {
    return ideas.find((idea) => idea._id === id) || null;
  },

  update(id, payload) {
    const idx = ideas.findIndex((idea) => idea._id === id);
    if (idx === -1) return null;
    ideas[idx] = {
      ...ideas[idx],
      ...payload,
      updatedAt: nowIso()
    };
    return ideas[idx];
  },

  delete(id) {
    const idx = ideas.findIndex((idea) => idea._id === id);
    if (idx === -1) return false;
    ideas.splice(idx, 1);
    return true;
  },

  like(id) {
    const idea = this.findById(id);
    if (!idea) return null;
    idea.likes += 1;
    idea.updatedAt = nowIso();
    return idea;
  },

  comment(id, author, message) {
    const idea = this.findById(id);
    if (!idea) return null;
    idea.comments.push({
      _id: crypto.randomUUID(),
      author,
      message,
      createdAt: nowIso(),
      updatedAt: nowIso()
    });
    idea.updatedAt = nowIso();
    return idea;
  },

  stats() {
    return {
      totalIdeas: ideas.length,
      totalLikes: ideas.reduce((sum, idea) => sum + idea.likes, 0),
      domainStats: toCountArray(ideas, "domain"),
      difficultyStats: toCountArray(ideas, "difficulty"),
      statusStats: toCountArray(ideas, "status")
    };
  }
};
