import { useState } from "react";

const formatDate = (value) => {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

export default function IdeaCard({ idea, onLike, onEdit, onDelete, onAddComment }) {
  const [commentData, setCommentData] = useState({ author: "", message: "" });

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    await onAddComment(idea._id, commentData);
    setCommentData({ author: "", message: "" });
  };

  return (
    <article className="panel idea-card">
      <header className="idea-top">
        <div>
          <h3>{idea.title}</h3>
          <p className="meta">
            {idea.domain} | {idea.difficulty} | {idea.status}
          </p>
        </div>
        <span className="chip">By {idea.createdBy}</span>
      </header>

      <p className="description">{idea.description}</p>

      <div className="skills-row">
        {idea.requiredSkills?.length ? (
          idea.requiredSkills.map((skill) => (
            <span key={`${idea._id}-${skill}`} className="skill-tag">
              {skill}
            </span>
          ))
        ) : (
          <span className="skill-tag muted">No skills added</span>
        )}
      </div>

      <div className="actions-row">
        <button className="primary-btn" onClick={() => onLike(idea._id)}>
          Like ({idea.likes})
        </button>
        <button className="ghost-btn" onClick={() => onEdit(idea)}>
          Edit
        </button>
        <button className="danger-btn" onClick={() => onDelete(idea._id)}>
          Delete
        </button>
      </div>

      <section className="comments-section">
        <h4>Comments ({idea.comments?.length || 0})</h4>
        <div className="comment-list">
          {idea.comments?.length ? (
            idea.comments
              .slice()
              .reverse()
              .map((comment) => (
                <div key={comment._id} className="comment-item">
                  <strong>{comment.author}</strong>
                  <span>{comment.message}</span>
                </div>
              ))
          ) : (
            <p className="muted">No comments yet.</p>
          )}
        </div>

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <input
            placeholder="Your name"
            value={commentData.author}
            onChange={(event) => setCommentData((prev) => ({ ...prev, author: event.target.value }))}
            required
          />
          <input
            placeholder="Write a quick feedback"
            value={commentData.message}
            onChange={(event) => setCommentData((prev) => ({ ...prev, message: event.target.value }))}
            required
          />
          <button className="ghost-btn" type="submit">
            Add Comment
          </button>
        </form>
      </section>

      <p className="meta">Posted on {formatDate(idea.createdAt)}</p>
    </article>
  );
}
