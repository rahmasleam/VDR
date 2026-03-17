
import React, { useState, useRef, useEffect } from 'react';
import { CompanyProfile } from '../../types';
import { uploadVdrFile } from '../../services/supabaseClient';

interface OnboardingProps {
  onComplete: (profile: CompanyProfile) => void;
  initialData?: CompanyProfile;
}

const SECTORS = [
  "FinTech", "HealthTech", "E-commerce", "SaaS (B2B)", "SaaS (B2C)", "EdTech",
  "PropTech", "CleanTech / Energy", "BioTech", "Logistics / Supply Chain",
  "DeepTech / AI", "Cybersecurity", "Gaming / Entertainment", "Web3 / Crypto",
  "Marketplace", "Manufacturing", "Consulting / Services", "AgriTech", "FoodTech",
  "Media & Telecommunications", "Construction / Infrastructure", "Automotive / Mobility",
  "Fashion & Lifestyle", "Retail", "LegalTech", "InsureTech", "GovTech",
  "Travel & Hospitality", "Real Estate", "Aerospace & Defense", "Chemicals",
  "Non-Profit / Social Impact", "Other"
];

const ORG_TYPES = ['Startup', 'Company'];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState<CompanyProfile>({
    completeName: '',
    phoneNumber: '',
    companyName: '',
    industryType: '',
    organizationType: 'Startup',
    pitchDeckFile: null,
    website: '',
    socialMediaLinks: [''],
    ...initialData
  });

  const [selectedSector, setSelectedSector] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from DB data if present
  useEffect(() => {
    if (initialData) {
      setForm(prev => ({ ...prev, ...initialData }));
      if (initialData.industryType) {
        if (SECTORS.includes(initialData.industryType)) {
          setSelectedSector(initialData.industryType);
        } else {
          setSelectedSector('Other');
        }
      }
    }
  }, [initialData]);

  const updateField = (field: keyof CompanyProfile, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and the + symbol at the start
    if (/^[0-9+]*$/.test(value)) {
      updateField('phoneNumber', value);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finalize and submit
      const validLinks = form.socialMediaLinks.filter(link => link.trim() !== '');
      const finalProfile = { ...form, socialMediaLinks: validLinks };
      onComplete(finalProfile);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
    }
  };

  const isStepValid = () => {
    if (currentStep === 1) return form.completeName && form.phoneNumber.length > 5; // Basic length check
    if (currentStep === 2) return form.companyName && form.industryType;
    if (currentStep === 3) return true; // Optional uploads
    return false;
  };

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSector(val);
    if (val !== 'Other') {
      updateField('industryType', val);
    } else {
      updateField('industryType', '');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload to Supabase Storage 'vdr-documents' bucket
        const { path, error } = await uploadVdrFile(file, 'pitch_decks');
        
        if (error) throw error;

        updateField('pitchDeckFile', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          path: path // Store the bucket path
        });
      } catch (error) {
        console.error(error);
        alert("Failed to upload file. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const addSocialLink = () => updateField('socialMediaLinks', [...form.socialMediaLinks, '']);
  const updateSocialLink = (index: number, value: string) => {
    const newLinks = [...form.socialMediaLinks];
    newLinks[index] = value;
    updateField('socialMediaLinks', newLinks);
  };
  const removeSocialLink = (index: number) => {
    if (form.socialMediaLinks.length > 1) {
      const newLinks = form.socialMediaLinks.filter((_, i) => i !== index);
      updateField('socialMediaLinks', newLinks);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 overflow-hidden">
      {/* Sidebar / Progress Section */}
      <div className="hidden lg:flex w-1/3 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center font-black text-xl mb-8 border border-white/10">V</div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Setup Profile</h2>
          <p className="text-slate-400 font-medium">Complete your entity configuration.</p>
        </div>

        <div className="relative z-10 space-y-8">
          {[
            { step: 1, title: "Primary Contact", desc: "Your details" },
            { step: 2, title: "Entity Profile", desc: "Company information" },
            { step: 3, title: "Assets", desc: "Pitch deck & links" }
          ].map((item) => (
            <div key={item.step} className={`flex items-start gap-4 transition-opacity duration-500 ${currentStep === item.step ? 'opacity-100' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${currentStep >= item.step ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-600 text-slate-400'}`}>
                {currentStep > item.step ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : item.step}
              </div>
              <div>
                <h4 className="font-bold text-lg leading-none mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Completion</div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-700 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
         {/* Mobile Header */}
        <div className="lg:hidden p-6 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-20">
          <span className="font-bold text-slate-900">Step {currentStep} of {totalSteps}</span>
          <div className="w-1/3 h-1 bg-slate-100 rounded-full overflow-hidden">
             <div className="h-full bg-blue-600 transition-all" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-12 lg:p-20 max-w-3xl mx-auto w-full flex flex-col justify-center">
          
          {/* Step 1: Identity */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Who is leading?</h1>
                <p className="text-lg text-slate-500 font-medium">Let's start with your details as the primary contact.</p>
              </div>
              
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">Full Legal Name</label>
                  <input 
                    autoFocus
                    required
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg placeholder:font-normal placeholder:text-slate-300"
                    placeholder="e.g. Sarah Smith"
                    value={form.completeName}
                    onChange={e => updateField('completeName', e.target.value)}
                  />
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">Phone Number</label>
                  <input 
                    required
                    type="tel"
                    inputMode="tel"
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg placeholder:font-normal placeholder:text-slate-300"
                    placeholder="+966 5X XXX XXXX"
                    value={form.phoneNumber}
                    onChange={handlePhoneChange}
                  />
                  <p className="text-xs text-slate-400 mt-1 ml-1">Numbers only (e.g. +966551234567)</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Entity */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
               <div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Company Profile</h1>
                <p className="text-lg text-slate-500 font-medium">Tell us about the entity being analyzed.</p>
              </div>

              <div className="space-y-6">
                
                {/* Organization Type */}
                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Organization Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {ORG_TYPES.map((type) => (
                      <label key={type} className={`flex items-center justify-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        form.organizationType === type 
                          ? 'border-blue-600 bg-blue-50 shadow-md transform scale-[1.02]' 
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}>
                        <input 
                          type="radio" 
                          name="orgType"
                          className="hidden"
                          checked={form.organizationType === type}
                          onChange={() => updateField('organizationType', type)}
                        />
                        <span className={`font-bold text-lg ${form.organizationType === type ? 'text-blue-900' : 'text-slate-500'}`}>
                          {type}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">Official Name</label>
                  <input 
                    required
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg placeholder:font-normal placeholder:text-slate-300"
                    placeholder="Registered Entity Name"
                    value={form.companyName}
                    onChange={e => updateField('companyName', e.target.value)}
                  />
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">Industry Sector</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <select
                        required
                        className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg appearance-none cursor-pointer"
                        value={selectedSector}
                        onChange={handleSectorChange}
                      >
                        <option value="" disabled>Select Industry</option>
                        {SECTORS.map(sector => (
                          <option key={sector} value={sector}>{sector}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-400">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    
                    {selectedSector === 'Other' && (
                       <input 
                        required
                        autoFocus
                        className="w-full p-5 rounded-2xl border-2 border-blue-200 bg-blue-50 text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg animate-in fade-in slide-in-from-top-2"
                        placeholder="Specific Industry..."
                        value={form.industryType}
                        onChange={e => updateField('industryType', e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Assets */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Digital Presence</h1>
                <p className="text-lg text-slate-500 font-medium">Upload assets to kickstart the AI evaluation.</p>
              </div>

              <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1">Pitch Deck</label>
                   <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center gap-4 group ${
                      form.pitchDeckFile 
                      ? 'border-emerald-400 bg-emerald-50/50' 
                      : isUploading 
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-400 hover:shadow-lg'
                    }`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,.ppt,.pptx" disabled={isUploading} />
                    
                    {isUploading ? (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    ) : (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                        form.pitchDeckFile ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-white text-slate-400 shadow-sm group-hover:text-blue-500 group-hover:scale-110 duration-300'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           {form.pitchDeckFile ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />}
                        </svg>
                      </div>
                    )}
                    
                    <div>
                       <p className="font-bold text-slate-900 text-lg">{form.pitchDeckFile ? form.pitchDeckFile.name : (isUploading ? 'Uploading...' : 'Upload Pitch Deck')}</p>
                       <p className="text-sm text-slate-500 mt-1">{form.pitchDeckFile ? 'File uploaded securely' : 'Drag & drop or click to browse (PDF, PPTX)'}</p>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 group-focus-within:text-blue-600 transition-colors">Website URL</label>
                  <input 
                    type="url"
                    className="w-full p-5 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 focus:ring-0 outline-none transition-all font-bold text-lg placeholder:font-normal placeholder:text-slate-300"
                    placeholder="https://yourcompany.com"
                    value={form.website}
                    onChange={e => updateField('website', e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 ml-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Social Links</label>
                    <button onClick={addSocialLink} className="text-xs font-black text-blue-600 uppercase hover:text-blue-800 transition">+ Add Link</button>
                  </div>
                  <div className="space-y-3">
                    {form.socialMediaLinks.map((link, index) => (
                      <div key={index} className="flex gap-3 animate-in fade-in slide-in-from-top-1">
                        <input 
                          className="flex-1 p-4 rounded-xl border-2 border-slate-100 bg-white text-slate-900 focus:border-blue-600 outline-none text-base font-medium transition-colors placeholder:text-slate-300"
                          placeholder="LinkedIn, Crunchbase, or X profile"
                          value={link}
                          onChange={e => updateSocialLink(index, e.target.value)}
                        />
                        {form.socialMediaLinks.length > 1 && (
                          <button onClick={() => removeSocialLink(index)} className="p-4 rounded-xl bg-slate-50 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors border-2 border-transparent hover:border-red-100">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                             </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Footer */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
             <div>
                {currentStep > 1 && (
                  <button 
                    onClick={handleBack}
                    className="text-slate-500 font-bold uppercase tracking-widest text-xs hover:text-slate-800 transition px-6 py-4 rounded-xl hover:bg-slate-50"
                  >
                    Go Back
                  </button>
                )}
             </div>
             <button
               onClick={handleNext}
               disabled={!isStepValid() || isUploading}
               className="bg-slate-900 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-slate-200 transition transform active:scale-95 text-sm uppercase tracking-widest flex items-center gap-2"
             >
               {currentStep === totalSteps ? 'Complete Profile' : 'Next Step'}
               {currentStep !== totalSteps && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
