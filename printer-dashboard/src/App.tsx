import React, { useEffect, useState } from 'react';
// Importing React core along with `useEffect` and `useState` hooks.
// `useState` allows the component to manage state, while `useEffect` is used for side effects like fetching data.

import axios from 'axios';
// Importing `axios`, a popular HTTP client for making requests to the backend API.

import PrinterList from './components/PrinterList';
import EventList from './components/EventList';
import EventChart from './components/EventChart';
// Importing custom components: PrinterList, EventList, and EventChart.
// These components are likely used for displaying printers, events, and visualizing data, respectively.

import { Printer } from './interfaces/Printer';
import { Event } from './interfaces/Event';
// Importing TypeScript interfaces for `Printer` and `Event` to define the types used in the application.
// Using interfaces ensures type safety and allows easier debugging by defining object structures explicitly.

import './App.css';
// Importing the CSS file for the `App` component to apply custom styling.

const API_BASE_URL = 'https://thvvimwtii.execute-api.eu-north-1.amazonaws.com/dev/';
// Defining the base URL of the API. This allows for easier configuration and avoids hardcoding the URL multiple times.

const App: React.FC = () => {
// Declaring the `App` component as a functional component (`React.FC`).
// The `React.FC` type is used to declare a function component with built-in type-checking and support for children.

  const [printers, setPrinters] = useState<Printer[]>([]);
// Using `useState` to store a list of `Printer` objects in the `printers` state variable. Initially, it's an empty array.
// TypeScript's type inference with `<Printer[]>` ensures that the array contains only `Printer` objects.

  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
// This state variable holds the currently selected printer's ID. It can be a string or `null` if no printer is selected.

  const [events, setEvents] = useState<Event[]>([]);
// Another state variable to store a list of `Event` objects. This will hold the events for the selected printer.

  const [loading, setLoading] = useState(false);
// A boolean state to track whether data is currently being loaded (e.g., during API calls).

  const [error, setError] = useState<string | null>(null);
// A state to store error messages. This will be used to display any errors that occur while fetching data.

  // Fetch printers
  useEffect(() => {
// `useEffect` is a React hook that runs a side effect (like fetching data) when the component mounts or updates.
// In this case, it runs only when the component first renders, since it has an empty dependency array (`[]`).

    const fetchPrinters = async () => {
// Defining an async function to fetch the list of printers from the API.

      try {
        setLoading(true);
// Set the `loading` state to true to indicate that data fetching is in progress.

        const response = await axios.get(`${API_BASE_URL}/printers`);
// Making an HTTP GET request to the API endpoint to fetch printers using `axios`.

        setPrinters(response.data);
// On a successful response, the printers data is stored in the `printers` state variable.

      } catch (err) {
        setError('Failed to fetch printers');
// If an error occurs, set an error message to `error` state, which will be displayed in the UI.

      } finally {
        setLoading(false);
// After the fetch completes (either success or failure), stop the loading state.
      }
    };

    fetchPrinters();
// Calling the `fetchPrinters` function when the component is first mounted.

  }, []);
// Empty array as the second argument means this effect runs once on component mount and not on every re-render.

  // Handle printer selection
  const handleSelectPrinter = (id: string) => {
// `handleSelectPrinter` is a function that gets called when a printer is selected.
// It accepts the printer ID as a string parameter.

    setSelectedPrinterId(id);
// The selected printer ID is saved to the `selectedPrinterId` state.

    fetchEvents(id);
// Call `fetchEvents` to load the events for the selected printer.
  };

  // Fetch events for a selected printer
  const fetchEvents = async (printerId: string) => {
// This async function fetches events for a specific printer by its ID.

    try {
      setLoading(true);
// Start loading while the events are being fetched.

      const response = await axios.get(`${API_BASE_URL}/printers/${printerId}/events`);
// Use `axios` to make an HTTP GET request to the API to fetch events for the selected printer.

      setEvents(response.data);
// Set the fetched events data into the `events` state.

    } catch (err) {
      setError('Failed to fetch events');
// If an error occurs, set an error message in the `error` state.
    } finally {
      setLoading(false);
// Stop loading after the request completes.
    }
  };

  if (loading) return <div>Loading...</div>;
// If the app is currently fetching data, it shows a loading message instead of the UI.

  if (error) return <div>{error}</div>;
// If there's an error, it shows the error message in the UI.

  const selectedPrinter = printers.find(printer => printer.PrinterId === selectedPrinterId);
// This line finds the selected printer from the list of `printers` using its ID.
// If no printer is selected, `selectedPrinter` will be `undefined`.

  return (
    <div className="App">
  {/* Main container for the app's content. */}

  <h1>Printer Event Visualizer</h1>
  {/* A header for the app. */}

  <PrinterList printers={printers} onSelectPrinter={handleSelectPrinter} />
  {/* Render the `PrinterList` component, passing the list of printers and the `handleSelectPrinter` function as props.
      The `onSelectPrinter` prop will be triggered when a printer is clicked. */}

  {selectedPrinterId && selectedPrinter && (
    <>
      <EventList events={events} />
      {/* Render the `EventList` component to display the events for the selected printer. */}

      <EventChart
        eventCount={selectedPrinter.EventCount}
        outOfBoundsCount={selectedPrinter.OutOfBoundsCount || 0}
        thresholds={selectedPrinter.Thresholds 
            ? { lower: selectedPrinter.Thresholds.Lower, upper: selectedPrinter.Thresholds.Upper } 
            : { lower: 0, upper: 0 }}
    />
      {/* Render the `EventChart` component, passing the selected printer's event count, out-of-bounds count, and thresholds as props.
          The thresholds and out-of-bounds count default to `{ lower: 0, upper: 0 }` and `0` respectively, in case the data is missing. */}
    </>
  )}
</div>
  );
};

export default App;
// Exporting the `App` component as the default export of this file.