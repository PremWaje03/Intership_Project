import { useEffect, useState } from "react";

const defaultData = {
  title: "",
  domain: "Web",
  difficulty: "Beginner",
  status: "Open",
  requiredSkills: "",
  description: "",
  createdBy: ""
};

export default function IdeaForm({ onSubmit, initialData, onCancelEdit, isSubmitting }) {
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        domain: initialData.domain,
        difficulty: initialData.difficulty,
        status: initialData.status,
        requiredSkills: initialData.requiredSkills?.join(", ") || "",
        description: initialData.description,
        createdBy: initialData.createdBy
      });
    } else {
      setFormData(defaultData);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    if (!initialData) {
      setFormData(defaultData);
    }
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-heading">
        <h2>{initialData ? "Edit Idea" : "Submit New Idea"}</h2>
        {initialData && (
          <button type="button" className="ghost-btn" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        )}
      </div>

      <div className="grid two-cols">
        <label>
          Title
          <input name="title" value={formData.title} onChange={handleChange} required maxLength={120} />
        </label>

        <label>
          Created By
          <input
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            required
            maxLength={80}
          />
        </label>

        <label>
          Domain
          <select name="domain" value={formData.domain} onChange={handleChange}>
            <option>Web</option>
            <option>AI/ML</option>
            <option>IoT</option>
            <option>Mobile</option>
            <option>Cybersecurity</option>
            <option>Other</option>
          </select>
        </label>

        <label>
          Difficulty
          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </label>

        <label>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Open</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </label>

        <label>
          Required Skills (comma separated)
          <input
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="React, MongoDB, Figma"
          />
        </label>
      </div>

      <label>
        Description
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          required
          maxLength={2000}
        />
      </label>

      <button type="submit" className="primary-btn" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : initialData ? "Update Idea" : "Create Idea"}
      </button>
    </form>
  );
}
