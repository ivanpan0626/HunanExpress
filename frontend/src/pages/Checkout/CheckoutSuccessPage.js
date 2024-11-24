import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [customData, setCustomData] = useState(null);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) return;

      try {
        const response = await axios.get(`http://localhost:5000/api/stripe/checkout-session/${sessionId}`);
        console.log('Checkout Session:', response.data);

        // Retrieve the custom data from metadata
        const metadata = JSON.parse(response.data.metadata.custom_data);
        setCustomData(metadata); // Store custom data in state

      } catch (error) {
        console.error('Error fetching session details:', error);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  return (
    <div>
      <h1>Checkout Success</h1>
      {customData ? (
        <div>
          <h2>Custom Data</h2>
          <pre>{JSON.stringify(customData, null, 2)}</pre>
        </div>
      ) : (
        <p>Loading custom data...</p>
      )}
    </div>
  );
};

export default CheckoutSuccess;
