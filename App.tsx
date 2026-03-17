
import React, { useState, useEffect, useRef } from 'react';
import { AppStep, CompanyProfile, VdrData, UserProfile, FileData } from './types';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import VerifyEmail from './components/Auth/VerifyEmail';
import VerificationSuccess from './components/Auth/VerificationSuccess';
import Welcome from './components/Auth/Welcome';
import Onboarding from './components/Onboarding/Onboarding';
import Dashboard from './components/Dashboard/Dashboard';
import { supabase } from './services/supabaseClient';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.LOGIN);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [vdrData, setVdrData] = useState<VdrData>({});
  const [loading, setLoading] = useState(true);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.warn("Loading timed out. Forcing UI render.");
        setLoading(false);
        // If we are still at initial state, ensure we show Login
        if (step === AppStep.LOGIN) {
            setStep(AppStep.LOGIN);
        }
      }
    }, 5000); // 5 seconds max wait

    return () => clearTimeout(safetyTimer);
  }, [loading, step]);

  // Initialize Auth Listener and fetch data
  useEffect(() => {
    let mounted = true;

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      if (session) {
        checkUserStatus(session.user.id, session.user.email!);
      } else {
        setStep(AppStep.LOGIN);
        setLoading(false);
      }
    }).catch(err => {
      console.error("Session check failed:", err);
      if (mounted) {
        setStep(AppStep.LOGIN);
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session) {
        if (event === 'SIGNED_IN') {
           await checkUserStatus(session.user.id, session.user.email!);
        }
      } else {
        setUserProfile(null);
        setCompany(null);
        setVdrData({});
        if (step !== AppStep.SIGNUP && step !== AppStep.VERIFY_EMAIL && step !== AppStep.VERIFICATION_SUCCESS) {
           setStep(AppStep.LOGIN);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); 

  const checkUserStatus = async (userId: string, email: string) => {
    // Only set loading true if we aren't already loading to avoid flicker resets
    // But for initial load it is true by default.
    setLoading(true);
    
    const minLoadTime = 600; 
    const start = Date.now();

    try {
      // 1. Fetch User Profile
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile", error);
      }

      // 2. Fetch Company Data
      const { data: companyData, error: companyError } = await supabase
        .from('company_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (companyError && companyError.code !== 'PGRST116') {
         console.error("Error fetching company profile", companyError);
      }

      // 3. Hydrate State
      const mappedCompany: CompanyProfile | null = companyData ? {
        completeName: companyData.complete_name,
        phoneNumber: companyData.phone_number,
        companyName: companyData.company_name,
        industryType: companyData.primary_sector,
        website: companyData.website,
        organizationType: (['Startup', 'Company'].includes(companyData.organization_type) ? companyData.organization_type : 'Startup') as 'Startup' | 'Company',
        pitchDeckFile: companyData.public_pitch_files ? companyData.public_pitch_files[0] : null,
        socialMediaLinks: companyData.social_links || []
      } : null;

      setCompany(mappedCompany);

      if (profile) {
        setUserProfile({
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          onboarding_completed: profile.onboarding_completed
        });

        // 4. ROUTING LOGIC
        if (profile.onboarding_completed) {
           setStep(AppStep.DASHBOARD);
        } else {
           if (mappedCompany) {
             setStep(AppStep.ONBOARDING);
           } else {
             setStep(AppStep.WELCOME);
           }
        }
      } else {
        // Fallback: If no profile exists, assume new user flow
        setStep(AppStep.WELCOME);
      }
    } catch (err) {
      console.error('Unexpected error in checkUserStatus:', err);
      // Even if error, if we have a user ID, we might want to let them try Onboarding or fallback to Login
      // Fallback to Login to be safe
      setStep(AppStep.LOGIN);
    } finally {
      const duration = Date.now() - start;
      const delay = Math.max(0, minLoadTime - duration);
      
      setTimeout(() => {
        setLoading(false);
      }, delay);
    }
  };

  // --- Handlers ---

  const handleSignup = (name: string, email: string) => {
    setStep(AppStep.VERIFY_EMAIL);
  };

  const handleVerified = () => {
    setStep(AppStep.VERIFICATION_SUCCESS);
  };

  const handleGoToLogin = () => {
    setStep(AppStep.LOGIN);
  };

  const handleLogin = (email: string) => {
    // Auth state change will handle routing
  };

  const handleStartOnboarding = () => {
    setStep(AppStep.ONBOARDING);
  };

  const handleCompleteOnboarding = async (profile: CompanyProfile) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Insert Company Profile
      const { error: companyError } = await supabase.from('company_profiles').upsert({
        user_id: session.user.id,
        complete_name: profile.completeName,
        phone_number: profile.phoneNumber,
        company_name: profile.companyName,
        organization_type: profile.organizationType,
        primary_sector: profile.industryType,
        website: profile.website,
        public_pitch_files: profile.pitchDeckFile ? [profile.pitchDeckFile] : [],
        social_links: profile.socialMediaLinks
      });

      if (companyError) throw companyError;

      // 2. MARK USER AS ONBOARDED
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({ 
           id: session.user.id,
           email: session.user.email,
           onboarding_completed: true 
        }, { onConflict: 'id' });

      if (profileError) throw profileError;

      setCompany(profile);
      setStep(AppStep.DASHBOARD);
      
    } catch (e: any) {
      console.error("Error saving onboarding:", e);
      alert("There was an error saving your profile. Please try again.");
    }
  };

  const updateVdrData = async (tabId: string, fieldId: string, value: FileData) => {
    // Local Update
    const newData = {
      ...vdrData,
      [tabId]: {
        ...(vdrData[tabId] || {}),
        [fieldId]: value
      }
    };
    setVdrData(newData);

    // Database Update (vdr_documents)
    const { data: { session } } = await supabase.auth.getSession();
    if(session) {
      const { error } = await supabase.from('vdr_documents').insert({
        user_id: session.user.id,
        tab_id: tabId,
        field_id: fieldId,
        document_name: value.name,
        file_path: value.path,
        file_size: value.size,
        file_type: value.type
      });
      if (error) console.error("Error saving document metadata:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setStep(AppStep.LOGIN);
  };

  // --- Render ---

  // Simplified loading condition to prevent Flash of Unauthenticated Content (FOUC)
  if (loading) {
      return (
        <div className="flex flex-col h-screen items-center justify-center bg-slate-50 relative overflow-hidden">
          {/* Enhanced Background Effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-20 h-20 bg-white shadow-2xl rounded-2xl flex items-center justify-center mb-8 animate-bounce">
              <span className="text-3xl font-black text-slate-900">V</span>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
               <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
               <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
               <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
            
            <p className="text-slate-500 font-bold text-sm tracking-[0.2em] uppercase animate-pulse">
              Initializing Secure Vault...
            </p>
          </div>
        </div>
      );
   }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {step === AppStep.LOGIN && <Login onLogin={handleLogin} onGoToSignup={() => setStep(AppStep.SIGNUP)} />}
      {step === AppStep.SIGNUP && <Signup onSignup={handleSignup} onGoToLogin={() => setStep(AppStep.LOGIN)} />}
      {step === AppStep.VERIFY_EMAIL && <VerifyEmail email={userProfile?.email || ''} onVerified={handleVerified} onBack={() => {}} />}
      {step === AppStep.VERIFICATION_SUCCESS && <VerificationSuccess onGoToLogin={handleGoToLogin} />}
      
      {step === AppStep.WELCOME && <Welcome userName={userProfile?.name || 'User'} onNext={handleStartOnboarding} />}
      
      {step === AppStep.ONBOARDING && (
        <Onboarding 
          onComplete={handleCompleteOnboarding} 
          initialData={company || undefined}
        />
      )}
      
      {step === AppStep.DASHBOARD && company && (
        <Dashboard 
          company={company} 
          vdrData={vdrData} 
          onUpdateField={updateVdrData} 
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
