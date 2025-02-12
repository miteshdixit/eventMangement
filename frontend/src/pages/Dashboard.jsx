import React, { useState, useEffect } from "react";
import { getEvents } from "../services/api";
import EventCard from "../components/EventCard";
import io from "socket.io-client";
import "../styles/dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await getEvents({
        category: categoryFilter !== "all" ? categoryFilter : undefined,
        date: dateFilter || undefined,
      });
      if (response.success) {
        setEvents(response.data);
      } else {
        setEvents([]);
      }
    };
    fetchEvents();

    const socket = io("http://localhost:5000");
    socket.on("eventUpdate", async () => {
      fetchEvents();
    });

    return () => socket.disconnect();
  }, [categoryFilter, dateFilter]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Event Management Dashboard</h2>
        <div className="filters">
          <label>
            Category:
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="tech">Tech</option>
              <option value="music">Music</option>
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </label>
        </div>
      </div>
      <div className="event-grid">
        {events?.length > 0 ? (
          events.map((event) => (
            <div className="event-card" key={event._id}>
              <EventCard event={event} />
            </div>
          ))
        ) : (
          <p className="no-events">No events found</p>
        )}
      </div>

      <div className="back-link">
        <button onClick={() => navigate("/eventCreate")}>create Event</button>
      </div>
    </div>
  );
};

export default Dashboard;
