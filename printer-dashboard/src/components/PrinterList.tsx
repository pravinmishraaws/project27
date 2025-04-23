import React from 'react';
import { Printer } from '../interfaces/Printer';
import EventChart from './EventChart';

interface PrinterListProps {
  printers: Printer[];
  onSelectPrinter: (id: string) => void;
}

const PrinterList: React.FC<PrinterListProps> = ({ printers, onSelectPrinter }) => {
  return (
    <div>
      <h2>Printers</h2>
      <ul className="printer-list">
        {printers.map(printer => (
          <li key={printer.PrinterId}>
            <div>
              Printer: {printer.PrinterId} - Events: {printer.EventCount} <br />
              {printer.Thresholds ? (
                <>
                  Thresholds: {printer.Thresholds.Lower} to {printer.Thresholds.Upper}
                </>
              ) : (
                <>No thresholds available</>
              )}
            </div>
            {/* Display the EventChart for each printer */}
            <EventChart
              eventCount={printer.EventCount}
              outOfBoundsCount={printer.OutOfBoundsCount || 0}
              thresholds={printer.Thresholds 
                ? { lower: printer.Thresholds.Lower, upper: printer.Thresholds.Upper } 
                : { lower: 0, upper: 0 }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PrinterList;
