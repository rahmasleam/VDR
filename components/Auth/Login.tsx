
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface LoginProps {
  onLogin: (email: string) => void;
  onGoToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onGoToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback for demo credentials
        if (email === 'edafaa@vc.sa' && password === 'Edafaa@2025' && authError.message.includes('Invalid login credentials')) {
           throw authError;
        }
        throw authError;
      }

      if (data.user?.email) {
        onLogin(data.user.email);
      }
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your business email address first.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
       setError(error.message);
    } else {
       alert('Reset link sent to ' + email);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Hero Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-16 text-white">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 opacity-80"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
            <span className="text-4xl font-black text-white">V</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
            Unlock Deal <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Intelligence.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-md">
            The standard for secure, AI-driven Virtual Data Room analysis and investment readiness.
          </p>
          
          <div className="mt-16 flex items-center gap-6 pt-8 border-t border-white/10">
             <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    U{i}
                 </div>
               ))}
             </div>
             <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted by 500+ VCs</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Header */}
          <div className="lg:hidden mb-12">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-2xl mb-4">V</div>
            <h2 className="text-3xl font-black text-slate-900">VDR Pro</h2>
          </div>
          
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Welcome back</h2>
            <p className="text-base text-slate-500 font-medium">
              Enter your credentials to access your secure vault.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-bold text-red-800">Authentication Failed</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Business Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-semibold placeholder:text-slate-400 hover:bg-white focus:bg-white"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Secure Access Password</label>
                <button 
                  type="button"
                  onClick={handleForgotPassword} 
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-semibold placeholder:text-slate-400 hover:bg-white focus:bg-white"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.742L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-6 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-slate-900 hover:bg-black focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-slate-900 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-widest mt-8"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500 font-bold">New Organization?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={onGoToSignup}
                className="w-full flex justify-center py-4 px-6 border-2 border-slate-100 hover:border-slate-300 rounded-2xl shadow-sm bg-white text-sm font-black text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all uppercase tracking-wide"
              >
                Initialize New VDR Setup
              </button>
            </div>
            
             <div className="mt-8 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-center backdrop-blur-sm">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                 For Demonstration
               </p>
               <p className="text-xs text-slate-600 font-mono">
                 edafaa@vc.sa <span className="mx-2 text-slate-300">|</span> Edafaa@2025
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
