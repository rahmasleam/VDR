import React, { useState, useMemo } from 'react';
import { CompanyProfile, VdrData, VdrTab, FileData } from '../../types';
import { VDR_TABS } from '../../constants';
import TabContent from './VdrTabContent';
import ProgressRing from './ProgressRing';
import ReportGenerator from '../Report/ReportGenerator';

interface DashboardProps {
  company: CompanyProfile;
  vdrData: VdrData;
  onUpdateField: (tabId: string, fieldId: string, value: FileData) => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ company, vdrData, onUpdateField, onLogout }) => {
  const [activeTabId, setActiveTabId] = useState(VDR_TABS[0].id);
  const [showReport, setShowReport] = useState(false);

  const activeTab = useMemo(() => VDR_TABS.find(t => t.id === activeTabId)!, [activeTabId]);

  const overallProgress = useMemo(() => {
    let totalFields = 0;
    let completedFields = 0;
    VDR_TABS.forEach(tab => {
      tab.fields.forEach(field => {
        totalFields++;
        if (vdrData[tab.id]?.[field.id]) completedFields++;
      });
    });
    return Math.round((completedFields / totalFields) * 100);
  }, [vdrData]);

  const getTabProgress = (tab: VdrTab) => {
    const fields = tab.fields;
    if (fields.length === 0) return 0;
    const completed = fields.filter(f => vdrData[tab.id]?.[f.id]).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-900 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xl">
            V
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{company.companyName}</h1>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{company.industryType} | {company.organizationType}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">Total Completion</span>
            <ProgressRing progress={overallProgress} size={50} strokeWidth={4} />
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <button 
            onClick={() => setShowReport(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md transition transform active:scale-95"
          >
            Generate Report
          </button>
          <button 
            onClick={onLogout}
            className="text-slate-400 hover:text-red-500 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <nav className="w-80 bg-white border-r border-slate-200 overflow-y-auto">
          <div className="p-4 space-y-1">
            {VDR_TABS.map((tab, idx) => {
              const progress = getTabProgress(tab);
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`w-full group text-left px-4 py-3 rounded-xl transition flex items-center justify-between ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 group-hover:bg-blue-100 transition">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold truncate max-w-[160px]">{tab.title}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    progress === 100 ? 'bg-emerald-100 text-emerald-700' : progress > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {progress}%
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Tab Content Display */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <TabContent 
            tab={activeTab} 
            data={vdrData[activeTab.id] || {}} 
            company={company}
            onUpdate={(fieldId, val) => onUpdateField(activeTab.id, fieldId, val)}
          />
        </main>
      </div>

      {showReport && (
        <ReportGenerator 
          company={company} 
          vdrData={vdrData} 
          onClose={() => setShowReport(false)} 
        />
      )}
    </div>
  );
};

export default Dashboard;