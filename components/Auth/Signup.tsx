
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface SignupProps {
  onSignup: (name: string, email: string) => void;
  onGoToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup, onGoToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (authError) throw authError;

      if (data.user) {
        onSignup(name, email);
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Visuals (Same as Login for consistency) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative overflow-hidden items-center justify-center p-16 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900 opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-10 border border-white/10 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1]">
            Join the <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Elite Circle.</span>
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-md">
            Create your account to start evaluating deals with AI-powered precision.
          </p>
          
           <div className="mt-12 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Bank-Grade Security</h3>
                  <p className="text-slate-400 text-sm mt-1">Your data is encrypted and protected by enterprise standards.</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 xl:px-32 bg-white">
        <div className="w-full max-w-md mx-auto">
          <button 
            onClick={onGoToLogin}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition font-bold text-xs uppercase tracking-widest mb-8"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </button>

          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Create Account</h2>
            <p className="text-base text-slate-500 font-medium">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-bold text-red-800 mt-0.5">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-semibold placeholder:text-slate-400 hover:bg-white focus:bg-white"
                placeholder="e.g. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-semibold placeholder:text-slate-400 hover:bg-white focus:bg-white"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-semibold placeholder:text-slate-400 hover:bg-white focus:bg-white"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
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
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-xl shadow-xl transition transform active:scale-95 mt-4 disabled:opacity-70 uppercase tracking-widest text-sm"
            >
              {loading ? 'Creating Profile...' : 'Create Account'}
            </button>
          </form>
          
          <p className="text-center mt-8 text-sm text-slate-400 font-medium">
            Already have an account? 
            <button onClick={onGoToLogin} className="ml-1 text-slate-900 font-black hover:underline">
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
