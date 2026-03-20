export default function StatsPanel({ stats }) {
  const topDomain = stats.domainStats?.[0]?._id || "-";
  const topDifficulty = stats.difficultyStats?.[0]?._id || "-";

  return (
    <section className="stats-grid">
      <article className="stat-card">
        <p>Total Ideas</p>
        <h3>{stats.totalIdeas ?? 0}</h3>
      </article>
      <article className="stat-card">
        <p>Total Likes</p>
        <h3>{stats.totalLikes ?? 0}</h3>
      </article>
      <article className="stat-card">
        <p>Top Domain</p>
        <h3>{topDomain}</h3>
      </article>
      <article className="stat-card">
        <p>Popular Difficulty</p>
        <h3>{topDifficulty}</h3>
      </article>
    </section>
  );
}
