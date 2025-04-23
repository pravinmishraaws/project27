import React from 'react';
import { Event } from '../interfaces/Event';

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div className="EventList">
      <h2>Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.type} - {new Date(event.timestamp).toLocaleString()} - {event.severity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
