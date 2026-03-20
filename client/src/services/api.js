const API_BASE = "/api/ideas";

const handleResponse = async (response) => {
  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch (_error) {
      data = { message: raw };
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

const request = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Backend API is not reachable. Start server on port 5000 and MongoDB.");
    }
    throw error;
  }
};

const qs = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });

  return searchParams.toString();
};

export const ideaApi = {
  getIdeas: async (params = {}) => {
    const query = qs(params);
    return request(`${API_BASE}${query ? `?${query}` : ""}`);
  },

  getStats: async () => {
    return request(`${API_BASE}/stats`);
  },

  createIdea: async (payload) => {
    return request(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  updateIdea: async (id, payload) => {
    return request(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  },

  deleteIdea: async (id) => {
    return request(`${API_BASE}/${id}`, {
      method: "DELETE"
    });
  },

  likeIdea: async (id) => {
    return request(`${API_BASE}/${id}/like`, {
      method: "POST"
    });
  },

  addComment: async (id, payload) => {
    return request(`${API_BASE}/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
};
