import React, { useState, useEffect, useRef } from 'react';
import { VdrTab, CompanyProfile, AiTabFeedback, FileData } from '../../types';
import { getTabAnalysis } from '../../services/geminiService';
import { uploadVdrFile } from '../../services/supabaseClient';

interface TabContentProps {
  tab: VdrTab;
  data: Record<string, FileData>;
  company: CompanyProfile;
  onUpdate: (fieldId: string, value: FileData) => void;
}

const TabContent: React.FC<TabContentProps> = ({ tab, data, company, onUpdate }) => {
  const [feedback, setFeedback] = useState<AiTabFeedback | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getAiFeedback = async () => {
    setLoadingFeedback(true);
    // Convert file metadata to a string representation for analysis
    const simulatedData: Record<string, string> = {};
    Object.entries(data).forEach(([k, v]) => {
      // Use explicit casting to FileData to ensure properties like name and size are accessible
      const file = v as FileData;
      simulatedData[k] = `File: ${file.name} (${Math.round(file.size / 1024)}KB)`;
    });
    
    const result = await getTabAnalysis(tab.title, simulatedData, company);
    setFeedback(result);
    setLoadingFeedback(false);
  };

  useEffect(() => {
    setFeedback(null);
  }, [tab.id]);

  const handleFileChange = async (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingField(fieldId);
      try {
        const { path, error } = await uploadVdrFile(file, `vdr/${tab.id}`);
        if (error) throw new Error("Upload failed");

        onUpdate(fieldId, {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          path: path
        });
      } catch (error) {
        console.error(error);
        alert("Upload failed. Please try again.");
      } finally {
        setUploadingField(null);
      }
    }
  };

  const progress = Math.round((Object.keys(data).length / tab.fields.length) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">VDR Section</span>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{tab.title}</h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">{tab.description}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Readiness Score</p>
            <p className="text-3xl font-black text-blue-600">{progress}%</p>
          </div>
          <div className="h-10 w-px bg-slate-100"></div>
          <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center font-bold">
            <span className="text-xl leading-none">{Object.keys(data).length}</span>
            <span className="text-[8px] uppercase tracking-tighter opacity-60">FILES</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-700">Document Repository</h3>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Required: {tab.fields.length}</span>
            </div>
            <div className="p-8 space-y-6">
              {tab.fields.map(field => {
                const file = data[field.id];
                const isUploading = uploadingField === field.id;
                
                return (
                  <div key={field.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        {field.label}
                        {file && (
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        )}
                      </label>
                    </div>
                    
                    <div 
                      onClick={() => !isUploading && fileInputRefs.current[field.id]?.click()}
                      className={`relative border-2 border-dashed rounded-2xl p-5 transition-all cursor-pointer flex items-center gap-4 ${
                        file 
                        ? 'bg-emerald-50/30 border-emerald-200 hover:bg-emerald-50/50' 
                        : isUploading 
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-slate-50/50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'
                      }`}
                    >
                      <input
                        type="file"
                        ref={(el) => { fileInputRefs.current[field.id] = el; }}
                        className="hidden"
                        onChange={(e) => handleFileChange(field.id, e)}
                        disabled={isUploading}
                      />
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        file ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-slate-400 border border-slate-100'
                      }`}>
                        {isUploading ? (
                           <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        ) : file ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        {isUploading ? (
                          <div>
                            <p className="text-sm font-bold text-blue-600">Uploading securely...</p>
                            <p className="text-[10px] text-blue-400">Encrypting and storing</p>
                          </div>
                        ) : file ? (
                          <div className="truncate">
                            <p className="text-sm font-bold text-slate-900 truncate">{file.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{(file.size / 1024 / 1024).toFixed(2)} MB • Uploaded</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-semibold text-slate-600">Click or drag to upload</p>
                            <p className="text-[10px] text-slate-400">{field.description || 'Support for PDF, Excel, Word'}</p>
                          </div>
                        )}
                      </div>

                      {file && !isUploading && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            // Logic to clear file would go here
                          }}
                          className="p-2 hover:bg-emerald-100 rounded-lg transition text-emerald-600"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
          <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden">
             {/* Abstract background element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
            
            <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              VDR Intelligence
            </h3>
            
            {!feedback ? (
              <div className="text-center py-6 space-y-6">
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Upload your documents to trigger a deep-dive AI evaluation of your investment readiness.
                  </p>
                </div>
                <button 
                  onClick={getAiFeedback}
                  disabled={loadingFeedback || Object.keys(data).length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition transform active:scale-95 disabled:opacity-30 disabled:grayscale"
                >
                  {loadingFeedback ? (
                    <span className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       Auditing Files...
                    </span>
                  ) : 'Start Deep Evaluation'}
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-1">Section Risk</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 w-32 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${feedback.riskScore > 7 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${feedback.riskScore * 10}%` }}></div>
                      </div>
                      <span className="text-sm font-bold">{feedback.riskScore}/10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Compliance Review</h4>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                      {feedback.complianceNotes}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2">Critical Next Step</h4>
                    <p className="text-white font-bold italic border-l-4 border-blue-500 pl-4 py-1">
                      "{feedback.nextStep}"
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={getAiFeedback}
                  className="w-full text-blue-400 hover:text-white text-xs font-bold py-3 rounded-xl border border-slate-800 hover:bg-slate-800 transition"
                >
                  Recalculate Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabContent;