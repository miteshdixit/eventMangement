import React from "react";

const EventCard = ({ event }) => {
  return (
    <div>
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
    </div>
  );
};

export default EventCard;
