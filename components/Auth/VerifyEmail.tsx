
import React, { useState } from 'react';

interface VerifyEmailProps {
  email: string;
  onVerified: () => void;
  onBack: () => void; // Keeping prop definition for compatibility, but not using it for "Back" button
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ email, onVerified }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckVerification = () => {
    setLoading(true);
    // In a real flow with deep links, the link in email would open the app.
    // Here we simulate the user confirming they clicked the link.
    setTimeout(() => {
      onVerified();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-slate-100 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Verify your email</h2>
        <p className="text-slate-500 mt-4 mb-8 leading-relaxed">
          We've sent a secure verification link to:<br/>
          <span className="font-bold text-slate-900 block mt-2 text-lg">{email}</span>
        </p>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-8 text-sm text-slate-600">
          <p>Please check your inbox and click the link to activate your account.</p>
        </div>

        <button 
          onClick={handleCheckVerification}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking Status...
            </>
          ) : 'I have verified my email'}
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
