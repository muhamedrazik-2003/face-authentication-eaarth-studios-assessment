import React from 'react';

function AccountVerificationPending() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-ingido-50 px-6 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Account Verification Pending
      </h1>
      <p className="text-gray-600 text-lg max-w-md">
        Your account is currently under review. An admin will verify your details, 
        and you will be notified once your account is approved.
      </p>
    </div>
  );
}

export default AccountVerificationPending;
