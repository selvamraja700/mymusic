import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, Music } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

/**
 * Login Page - Theme-aware with designer credit
 */
const Login = () => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Call login from useAuth hook
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        toast.success('Login successful!');
        navigate('/home');
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Google login coming soon!');
  };

  const handleFacebookLogin = () => {
    toast.info('Facebook login coming soon!');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-green-50 to-blue-50'
    }`}>
      {/* Login Card */}
      <div className={`w-full max-w-md rounded-3xl shadow-2xl p-8 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <Music className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className={`text-center text-2xl font-bold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          Login to continue to your music
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-8">
          {/* Email */}
          <div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
              errors.email
                ? 'border-red-500'
                : theme === 'dark'
                ? 'bg-gray-800 border-gray-700 focus-within:border-green-500'
                : 'bg-gray-50 border-gray-200 focus-within:border-green-500'
            }`}>
              <Mail className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`flex-1 bg-transparent outline-none ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
              errors.password
                ? 'border-red-500'
                : theme === 'dark'
                ? 'bg-gray-800 border-gray-700 focus-within:border-green-500'
                : 'bg-gray-50 border-gray-200 focus-within:border-green-500'
            }`}>
              <Lock className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`flex-1 bg-transparent outline-none ${
                  theme === 'dark' ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`p-1 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-green-500"
              />
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className={`absolute inset-0 flex items-center ${theme === 'dark' ? '' : ''}`}>
            <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className={`px-4 ${theme === 'dark' ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}>
              Or continue with
            </span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <button
            type="button"
            onClick={handleFacebookLogin}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              theme === 'dark'
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        {/* Sign Up Link */}
        <p className={`text-center mt-6 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 hover:text-green-400 font-semibold transition-colors">
            Sign up for free
          </Link>
        </p>

        {/* Designer Credit */}
        <div className={`text-center mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
            Designed by <span className="font-semibold text-green-500">Selvam</span> • <span className="font-semibold text-green-500">TrackTechBytezz</span>
          </p>
        </div>
      </div>

      {/* Terms Footer */}
      <div className={`fixed bottom-4 left-0 right-0 text-center text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-500'}`}>
        By continuing, you agree to TBytez's{' '}
        <Link to="/terms" className="text-green-500 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to="/privacy" className="text-green-500 hover:underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};

export default Login;
