
import React from 'react';

interface VerificationSuccessProps {
  onGoToLogin: () => void;
}

const VerificationSuccess: React.FC<VerificationSuccessProps> = ({ onGoToLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-12 border border-slate-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Confetti Background Effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner ring-4 ring-emerald-50 relative z-10 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Verification Complete!</h2>
        
        <div className="bg-emerald-50/50 rounded-xl p-4 mb-8 border border-emerald-100">
           <p className="text-emerald-800 text-sm font-bold">
             Your email has been successfully verified.
           </p>
        </div>

        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Your secure vault has been initialized and is ready for access. You may now sign in to your account.
        </p>

        <button 
          onClick={onGoToLogin}
          className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-2xl shadow-xl shadow-slate-200 transition transform active:scale-95 uppercase tracking-widest text-sm"
        >
          Proceed to Login
        </button>
      </div>
    </div>
  );
};

export default VerificationSuccess;
