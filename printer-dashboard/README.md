# Printer Dashboard

## Project Overview

The **Printer Dashboard Visualizer** is a web application that displays data from Printer IoT devices, including event counts, thresholds, and other metrics. The application uses a React front-end and visualizes the data using charts powered by Chart.js. The Printer data is fetched from an AWS backend, with the ability to monitor device-specific events and metrics.

### Features:
- Lists Printer with their event counts and thresholds.
- Visualizes Printer metrics using charts.
- Fetches real-time Printer data and events from an AWS backend.

## Technologies Used

- **React.js**: Front-end library for building the user interface.
- **TypeScript**: For type safety and better development experience.
- **Chart.js (react-chartjs-2)**: Library for rendering device metric charts.
- **AWS Lambda**: Backend functions for fetching device data and events.
- **AWS API Gateway**: To expose the Lambda functions as API endpoints.
- **AWS DynamoDB**: To store device data, events, and thresholds.
- **AWS S3**: For hosting the React application as a static website.

---

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/device-event-visualizer.git
   cd printer-dashboard
   ```

2. **Install dependencies**:
   Run the following command to install the required npm packages:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:3000`.

4. **Build the production version**:
   To create a production build, use:
   ```bash
   npm run build
   ```
   This will generate the optimized static files in the `build` directory.

---

## Deployment to AWS S3

### Step 1: Build the Application
- Run the following command to build your React app for production:
  ```bash
  npm run build
  ```
  This generates a `build` folder with the production-ready files.

### Step 2: Create an S3 Bucket
1. Go to the **AWS Management Console** and open **S3**.
2. Click on **Create Bucket**.
   - Provide a unique bucket name (e.g., `printer-dashboard-visualizer`).
   - Choose the appropriate region.
3. Enable **Static Website Hosting** under the **Properties** tab:
   - Set **Index document** to `index.html`.
   - Set **Error document** to `index.html`.

### Step 3: Set Permissions
1. Go to the **Permissions** tab of the bucket.
2. Add the following bucket policy to make the contents publicly accessible:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
   Replace `your-bucket-name` with the actual name of your bucket.

### Step 4: Upload Files
1. Go to the **Objects** section of your S3 bucket and click **Upload**.
2. Upload all the files from the `build` folder.
3. After uploading, you can access your website using the S3 website URL:
   ```
   http://your-bucket-name.s3-website-region.amazonaws.com
   ```

---

## API Architecture Overview

- **AWS Lambda Functions**: These functions fetch the device data and events from DynamoDB. The data is processed and returned to the React app via API Gateway.
  
- **AWS API Gateway**: Exposes the Lambda functions as API endpoints:
  - `/printers`: Fetches the list of devices.
  - `/printers/{PrinterId}/events`: Fetches events for a specific device.

- **AWS DynamoDB**: The data store for printer profiles, event counts, and threshold values.

---

## Additional Features

### Device Data Structure (DynamoDB):
- **PrinterId**: Partition key (string).
- **EventCount**: Number of events triggered by the device (number).
- **OutOfBoundsCount**: Count of how many times the device exceeded thresholds (number).
- **Thresholds**: An object containing upper and lower thresholds for the device.
- **TimeWindow**: Time window for anomaly detection (number).

---

## Conclusion

This project demonstrates a complete serverless architecture using AWS services like Lambda, API Gateway, DynamoDB, and S3. The front-end application uses React and Chart.js to visualize device metrics. The deployment process is straightforward, using AWS S3 to host the static assets and AWS services for the backend API.