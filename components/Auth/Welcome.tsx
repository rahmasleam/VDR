
import React from 'react';

interface WelcomeProps {
  userName: string;
  onNext: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ userName, onNext }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl p-12 md:p-16 border border-slate-100 animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-6xl mb-8 animate-bounce bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">🚀</div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Welcome, <span className="text-blue-600">{userName}</span>!
        </h1>
        
        <p className="text-lg text-slate-500 mb-12 leading-relaxed font-medium max-w-lg mx-auto">
          You have successfully authenticated. To customize your Virtual Data Room analysis, we need to calibrate your company profile.
        </p>

        <div className="space-y-4">
          <button 
            onClick={onNext}
            className="w-full md:w-auto bg-slate-900 hover:bg-black text-white font-black px-12 py-6 rounded-2xl text-lg shadow-xl shadow-slate-200 transition transform hover:-translate-y-1 active:translate-y-0 active:scale-95"
          >
            Start Company Intelligence
          </button>
          
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold pt-4">
            Estimated time: 2 Minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
