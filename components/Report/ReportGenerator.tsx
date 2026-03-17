
import React, { useState, useEffect } from 'react';
import { CompanyProfile, VdrData } from '../../types';
import { getFullReport } from '../../services/geminiService';

interface ReportGeneratorProps {
  company: CompanyProfile;
  vdrData: VdrData;
  onClose: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ company, vdrData, onClose }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const generate = async () => {
      const result = await getFullReport(vdrData, company);
      setReport(result);
      setLoading(false);
    };
    generate();
  }, [company, vdrData]);

  const handleBook = () => {
    if (selectedDate && selectedTime) {
      setBooked(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">VDR Analysis Report</h2>
            <p className="text-sm text-slate-500">Prepared for {company.companyName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium">Gemini AI is analyzing your data room...</p>
              <div className="flex gap-2">
                {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>)}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Strategic Summary
                  </h3>
                  <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-li:text-slate-700">
                    {report?.split('\n').map((para, i) => para ? <p key={i} className="mb-4 text-slate-700">{para}</p> : <br key={i}/>)}
                  </div>
                </section>

                <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Overall Rating</p>
                    <p className="text-3xl font-black text-emerald-400">INVESTMENT READY</p>
                  </div>
                  <div className="bg-slate-800 px-4 py-2 rounded-lg text-sm border border-slate-700">
                    Score: <span className="text-emerald-400 font-bold text-lg">8.4/10</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sticky top-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Schedule Consultation
                  </h3>
                  
                  {booked ? (
                    <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-center animate-in zoom-in-95 duration-300">
                      <div className="text-3xl mb-2">🎉</div>
                      <p className="font-bold">Consultation Booked!</p>
                      <p className="text-xs mt-1">Check your email for the Zoom link.</p>
                      <p className="text-xs mt-2 font-black">{selectedDate} @ {selectedTime}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 leading-relaxed">
                        Book a 30-min deep dive session with our investment experts to review this report.
                      </p>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Date</label>
                        <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={selectedDate}
                          onChange={e => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Time</label>
                        <select 
                          className="w-full p-3 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={selectedTime}
                          onChange={e => setSelectedTime(e.target.value)}
                        >
                          <option value="">Choose a slot</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="04:30 PM">04:30 PM</option>
                        </select>
                      </div>
                      <button 
                        onClick={handleBook}
                        disabled={!selectedDate || !selectedTime}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg transition disabled:opacity-50 mt-2"
                      >
                        Confirm Appointment
                      </button>
                    </div>
                  )}
                </section>
                
                <div className="bg-slate-100 rounded-2xl p-6">
                  <h4 className="text-xs font-black text-slate-400 uppercase mb-3">Next Step</h4>
                  <p className="text-sm text-slate-700 font-medium italic">"Share this report with your lead investors to demonstrate transparency and readiness."</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
