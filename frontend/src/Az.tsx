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
  const [instance, setInstance] = useState('Fetching...')

  useEffect(() => {
    const getAZ = async () => {
      // let az = await fetchAvailabilityZone();

      // if(!(az === 'Unknown AZ')){
      //   setAvailabilityZone(az);
      // }

      const probTime = Math.random() * (3000 - 800) + 800;

      let az;

      const instanceList = ['i-04eccf60eacbd5467', 'i-02cd7f856f63fe63c']
      const azlist = ['us-east-1a', 'us-east-1b']
      const prob = Math.random();
      let instance;

      if (prob <= 0.5) {
        instance = instanceList[0]
        az = azlist[0]
      } else {
        instance = instanceList[1]
        az = azlist[1]
      }

      setTimeout(() => {
        setAvailabilityZone(az);
        setInstance(instance);
      }, probTime);
    };

    getAZ();
  }, []);

  return (
    <div className="centered-container">
      <header>
        <h1>EC2 instance - Availability Zone</h1>
      </header>
      <main>
        <p>Currently instance: {instance}</p>
        <p>Currently running in: {availabilityZone}</p>
      </main>
    </div>
  );
}
