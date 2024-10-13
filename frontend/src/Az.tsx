import { useState, useEffect } from 'react';
import './Az.css'; // Make sure the CSS file is in the same directory or adjust the path accordingly

// Function to fetch the Availability Zone from a server's response header
const fetchAvailabilityZone = async () => {
  try {
    // Make a request to your backend or an API behind the load balancer
    const response = await fetch('/api/health'); // Replace with your actual API endpoint

    // Fetch from response header
    const azHeader = response.headers.get('X-Availability-Zone');

    // Fetch from response body as fallback
    const responseBody = await response.json();
    const azBody = responseBody.availabilityZone || 'Unknown AZ';

    // Return AZ from header if available, otherwise fallback to body
    return azHeader || azBody;
  } catch (error) {
    console.error('Error fetching AZ:', error);
    return 'Unknown AZ';
  }
};


export default function Az() {
  const [availabilityZone, setAvailabilityZone] = useState('Fetching...');

  useEffect(() => {
    const getAZ = async () => {
      const az = await fetchAvailabilityZone();
      setAvailabilityZone(az);
    };
    getAZ();
  }, []);

  return (
    <div className="centered-container">
      <header>
        <h1>EC2 instance - Availability Zone</h1>
      </header>
      <main>
        <p>Currently running in: {availabilityZone}</p>
      </main>
    </div>
  );
}
