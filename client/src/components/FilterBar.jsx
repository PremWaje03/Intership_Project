export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="panel filter-panel">
      <div className="panel-heading">
        <h2>Explore Ideas</h2>
        <button className="ghost-btn" onClick={onReset}>
          Reset Filters
        </button>
      </div>

      <div className="grid filter-grid">
        <label>
          Search
          <input
            name="search"
            value={filters.search}
            onChange={onChange}
            placeholder="Search title, skills, description"
          />
        </label>

        <label>
          Domain
          <select name="domain" value={filters.domain} onChange={onChange}>
            <option value="">All</option>
            <option value="Web">Web</option>
            <option value="AI/ML">AI/ML</option>
            <option value="IoT">IoT</option>
            <option value="Mobile">Mobile</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Difficulty
          <select name="difficulty" value={filters.difficulty} onChange={onChange}>
            <option value="">All</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </label>

        <label>
          Status
          <select name="status" value={filters.status} onChange={onChange}>
            <option value="">All</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </label>

        <label>
          Sort
          <select name="sort" value={filters.sort} onChange={onChange}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="liked">Most Liked</option>
          </select>
        </label>
      </div>
    </div>
  );
}
