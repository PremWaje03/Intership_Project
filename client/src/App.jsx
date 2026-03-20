import { useEffect, useMemo, useState } from "react";
import FilterBar from "./components/FilterBar";
import IdeaCard from "./components/IdeaCard";
import IdeaForm from "./components/IdeaForm";
import StatsPanel from "./components/StatsPanel";
import { ideaApi } from "./services/api";

const defaultFilters = {
  search: "",
  domain: "",
  difficulty: "",
  status: "",
  sort: "newest"
};

export default function App() {
  const [ideas, setIdeas] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState(defaultFilters);
  const [editingIdea, setEditingIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState("");

  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => key !== "sort" && Boolean(value)).length;
  }, [filters]);

  const fetchStats = async () => {
    const data = await ideaApi.getStats();
    setStats(data);
  };

  const fetchIdeas = async (currentFilters) => {
    const data = await ideaApi.getIdeas(currentFilters);
    setIdeas(data);
  };

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      setLoading(true);
      setError("");
      try {
        await Promise.all([fetchIdeas(filters), fetchStats()]);
      } catch (apiError) {
        if (mounted) setError(apiError.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timeout = setTimeout(run, 250);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [filters]);

  const refreshIdeasAndStats = async () => {
    await Promise.all([fetchIdeas(filters), fetchStats()]);
  };

  const showBanner = (message) => {
    setBanner(message);
    setTimeout(() => setBanner(""), 2400);
  };

  const handleFormSubmit = async (payload) => {
    try {
      setIsSubmitting(true);
      setError("");

      if (editingIdea) {
        await ideaApi.updateIdea(editingIdea._id, payload);
        showBanner("Idea updated successfully.");
      } else {
        await ideaApi.createIdea(payload);
        showBanner("Idea created successfully.");
      }

      setEditingIdea(null);
      await refreshIdeasAndStats();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await ideaApi.deleteIdea(id);
      showBanner("Idea deleted.");
      if (editingIdea?._id === id) setEditingIdea(null);
      await refreshIdeasAndStats();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleLike = async (id) => {
    try {
      await ideaApi.likeIdea(id);
      await refreshIdeasAndStats();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleAddComment = async (id, payload) => {
    try {
      await ideaApi.addComment(id, payload);
      await refreshIdeasAndStats();
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="app-shell">
      <div className="glow glow-left" />
      <div className="glow glow-right" />

      <header className="hero">
        <p className="eyebrow">MERN Portfolio Project</p>
        <h1>Campus Project Hub</h1>
        <p>
          A collaborative board where students pitch project ideas, get feedback, and track what is trending across
          domains.
        </p>
      </header>

      {banner && <div className="banner success">{banner}</div>}
      {error && <div className="banner error">{error}</div>}

      <StatsPanel stats={stats} />

      <IdeaForm
        onSubmit={handleFormSubmit}
        initialData={editingIdea}
        onCancelEdit={() => setEditingIdea(null)}
        isSubmitting={isSubmitting}
      />

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(defaultFilters)}
      />

      <section className="idea-section">
        <div className="section-title-row">
          <h2>Idea Feed</h2>
          <span className="chip">Active Filters: {activeFilterCount}</span>
        </div>

        {loading ? (
          <p className="muted">Loading ideas...</p>
        ) : ideas.length ? (
          <div className="idea-grid">
            {ideas.map((idea) => (
              <IdeaCard
                key={idea._id}
                idea={idea}
                onLike={handleLike}
                onEdit={setEditingIdea}
                onDelete={handleDelete}
                onAddComment={handleAddComment}
              />
            ))}
          </div>
        ) : (
          <p className="muted">No ideas found. Try adjusting filters or create one.</p>
        )}
      </section>
    </div>
  );
}
