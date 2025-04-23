// Import necessary libraries from Chart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the required components from Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Define the interface for the EventChart props
interface EventChartProps {
  eventCount: number;
  outOfBoundsCount: number;
  thresholds: { lower: number; upper: number };
}

// Create the EventChart component
const EventChart: React.FC<EventChartProps> = ({ eventCount, outOfBoundsCount, thresholds }) => {
  const data = {
    labels: ['Event Count', 'Out of Bounds Count', 'Threshold Lower', 'Threshold Upper'],
    datasets: [
      {
        label: 'Device Metrics',
        data: [eventCount, outOfBoundsCount, thresholds.lower, thresholds.upper],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Device Event Metrics',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default EventChart;
