import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../services/api";
import "../styles/EventCreation.css"; // Import the CSS file
import { AuthContext } from "../context/AuthCreation";

const EventCreation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    category: "tech",
    location: "",
    capacity: "",
    image: null,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "events_preset");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmgegtwbf/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const imageData = await response.json();
      return { public_id: imageData.public_id, url: imageData.secure_url };
    } catch (err) {
      setError("Image upload failed");
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user || user.role !== "organizer") {
        console.log(user);
        throw new Error("Only organizers can create events");
      }
      let imageData = null;
      if (formData.image) {
        imageData = await handleImageUpload(formData.image);
      }

      const eventPayload = {
        ...formData,
        image: imageData,
        capacity: Number(formData.capacity),
      };
      await createEvent(eventPayload, user.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <h2>Create New Event</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Event Image</label>
        <div className="file-input-container">
          {previewImage && (
            <img src={previewImage} alt="Preview" className="image-preview" />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <label>Event Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />

        <label>Event Date</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        >
          <option value="tech">Technology</option>
          <option value="music">Music</option>
          <option value="business">Business</option>
          <option value="sports">Sports</option>
        </select>

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
        />

        <label>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleInputChange}
          min="1"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Event..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventCreation;
