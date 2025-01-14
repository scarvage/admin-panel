import React, { useState, useEffect } from 'react';

const CallbackTab = () => {
  const [callbackData, setCallbackData] = useState(null);

  useEffect(() => {
    // Simulate the data you would receive in the callback POST request
    const fetchCallbackData = async () => {
      const response = await fetch('/api/kyc/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          decentroTxnId: 'exampleTransactionId',
          status: 'SUCCESS',
          responseCode: 'S00000',
          message: 'KYC process completed successfully',
          data: {
            url: 'https://example.com/kyc-result',
            initial_transaction_id: 'exampleTransactionId',
            flow_name: 'DIGILOCKER',
            callback_url: 'http://localhost:3000/api/kyc/callback',
            redirect_url: 'https://example.com/redirect',
            purpose: 'To perform KYC of the individual',
            digilocker_fetch: 'eaadhaar,issued_files,pan',
            company_name: 'coinwise research private limited',
            mobile: '9001447798',
          },
          responseKey: 'success_uistream_session_generation',
        }),
      });

      const data = await response.json();
      setCallbackData(data);
    };

    fetchCallbackData();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Callback Data</h2>
      {callbackData ? (
        <pre>{JSON.stringify(callbackData, null, 2)}</pre>
      ) : (
        <p>Waiting for callback data...</p>
      )}
    </div>
  );
};

export default CallbackTab;
