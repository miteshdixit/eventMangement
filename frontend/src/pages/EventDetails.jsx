import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../services/api";
import io from "socket.io-client";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch event details
    const fetchEvent = async () => {
      const response = await getEventById(id);
      setEvent(response.event);
    };
    fetchEvent();

    // Connect to Socket.IO
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Listen for attendee updates
    newSocket.on("attendeeUpdate", (updatedEvent) => {
      if (updatedEvent._id === id) {
        setEvent(updatedEvent);
      }
    });

    return () => newSocket.disconnect();
  }, [id]);

  return (
    <div>
      {event && (
        <div>
          <h2>{event.name}</h2>
          <p>{event.description}</p>
          <p>Date: {new Date(event.date).toLocaleDateString()}</p>
          <h3>Attendees: {event.attendees.length}</h3>
          <ul>
            {event.attendees.map((attendee) => (
              <li key={attendee._id}>{attendee.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
