export interface Event {
    id: string;  // Unique identifier for the event, if it exists
    deviceId: string;  // Device ID to which this event belongs
    type: string;  // Type of event (e.g., 'Error', 'Warning', etc.)
    timestamp: string;  // Event timestamp
    severity?: string;  // Optional: Event severity (if applicable)
  }
  