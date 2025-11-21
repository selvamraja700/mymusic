import React, { useState } from 'react';
import {
  Moon, Sun, Bell, Lock, Music, HelpCircle, X, Crown,
  AlertCircle, CheckCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

/** Settings Page with Professional Cancel Subscription UI */
const Settings = () => {
  const { theme, setTheme } = useTheme();

  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [cancellationStatus, setCancellationStatus] = useState(null);

  const [supportMessage, setSupportMessage] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [cancelMessage, setCancelMessage] = useState('');

  const [settings, setSettings] = useState({
    notifications: {
      appNotifications: true,
      emailNotifications: false,
    },
    privacy: {
      showActivity: true,
    },
    playback: {
      crossfade: false,
      autoplay: true,
    },
  });

  // Get user from localStorage
  const getUser = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  };

  const user = getUser();

  // Check if user has active premium
  const hasPremium = () => {
    if (!user?.isPremium) return false;
    if (!user?.premiumEndDate) return true;
    const endDate = new Date(user.premiumEndDate);
    const now = new Date();
    return endDate > now;
  };

  const isPremiumActive = hasPremium();

  // Get premium details
  const getPremiumDetails = () => {
    if (!isPremiumActive) return null;
    const startDate = user.premiumStartDate ? new Date(user.premiumStartDate) : new Date();
    const endDate = user.premiumEndDate ? new Date(user.premiumEndDate) : null;
    const now = new Date();

    if (!endDate) return null;

    const daysRemaining = Math.max(0, Math.ceil((endDate - now) / (1000 * 60 * 60 * 24)));
    return {
      plan: user.premiumPlan || 'Premium',
      startDate,
      endDate,
      daysRemaining,
      price: user.lastPaymentAmount || 119,
    };
  };

  const premiumDetails = getPremiumDetails();

  // Toggle handlers
  const handleToggle = (category, key) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
    toast.success('Settings updated');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }
    toast.success("Your message has been sent! We'll get back to you soon.");
    setSupportMessage('');
    setShowSupportModal(false);
  };

  const handleCancelClick = () => {
    setShowManageModal(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!cancelReason && !cancelMessage.trim()) {
      toast.error('Please select a reason or provide feedback');
      return;
    }
    setShowCancelModal(false);
    setShowConfirmModal(true);
  };

  const handleFinalCancel = async () => {
    setShowConfirmModal(false);
    setShowProcessingModal(true);
    setCancellationStatus('processing');
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.isPremium = false;
      currentUser.subscriptionCancelled = true;
      currentUser.cancellationDate = new Date().toISOString();
      currentUser.cancelReason = cancelReason;
      currentUser.cancelMessage = cancelMessage;
      delete currentUser.premiumPlan;
      delete currentUser.premiumStartDate;
      delete currentUser.premiumEndDate;
      delete currentUser.premiumPlanId;
      delete currentUser.lastPaymentAmount;
      localStorage.setItem('user', JSON.stringify(currentUser));
      window.dispatchEvent(new Event('userUpdated'));
      setCancellationStatus('success');
      setTimeout(() => { window.location.reload(); }, 1500);
    } catch (error) {
      toast.error('Failed to cancel subscription');
      setShowProcessingModal(false);
      setCancellationStatus(null);
    }
    setCancelReason('');
    setCancelMessage('');
  };

  const cancelReasons = [
    'Too expensive',
    'Not using enough',
    'Missing features',
    'Found better alternative',
    'Technical issues',
    'Other',
  ];

  const formatDate = (date) => date && new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  // Main settings layout
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-gray-900'} font-sans`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Settings</h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Manage your preferences</p>
        </div>
        <div className="space-y-6">
          {/* Appearance */}
          <SettingsSection title="Appearance" icon={<Sun className="w-5 h-5" />} theme={theme}>
            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all
                ${theme === 'light' ? 'bg-green-500 text-white shadow-lg' : theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Sun className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Light Theme</p>
                    <p className={`text-sm ${theme === 'light' ? 'text-white/80' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Clean and bright interface</p>
                  </div>
                </div>
                <input type="radio" name="theme" checked={theme === 'light'} onChange={() => setTheme('light')} className="w-5 h-5 accent-green-500" />
              </label>
              <label className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all
                ${theme === 'dark' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Dark Theme</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white/80' : 'text-gray-600'}`}>Easy on the eyes</p>
                  </div>
                </div>
                <input type="radio" name="theme" checked={theme === 'dark'} onChange={() => setTheme('dark')} className="w-5 h-5 accent-green-500" />
              </label>
            </div>
          </SettingsSection>
          {/* Notifications */}
          <SettingsSection title="Notifications" icon={<Bell className="w-5 h-5" />} theme={theme}>
            <div className="space-y-4">
              <ToggleItem label="App Notifications" description="Show in-app notification alerts" checked={settings.notifications.appNotifications} onChange={() => handleToggle('notifications', 'appNotifications')} theme={theme} />
              <ToggleItem label="Email Notifications" description="Receive updates via email" checked={settings.notifications.emailNotifications} onChange={() => handleToggle('notifications', 'emailNotifications')} theme={theme} />
            </div>
          </SettingsSection>
          {/* Privacy */}
          <SettingsSection title="Privacy" icon={<Lock className="w-5 h-5" />} theme={theme}>
            <div className="space-y-4">
              <ToggleItem label="Show Activity" description="Let others see what you're listening to" checked={settings.privacy.showActivity} onChange={() => handleToggle('privacy', 'showActivity')} theme={theme} />
            </div>
          </SettingsSection>
          {/* Playback */}
          <SettingsSection title="Playback" icon={<Music className="w-5 h-5" />} theme={theme}>
            <div className="space-y-4">
              <ToggleItem label="Crossfade" description="Smooth transitions between songs" checked={settings.playback.crossfade} onChange={() => handleToggle('playback', 'crossfade')} theme={theme} />
              <ToggleItem label="Autoplay" description="Continue playing similar songs when your music ends" checked={settings.playback.autoplay} onChange={() => handleToggle('playback', 'autoplay')} theme={theme} />
            </div>
          </SettingsSection>
          {/* Subscription */}
          {isPremiumActive && premiumDetails && (
            <SettingsSection title="Subscription" icon={<Crown className="w-5 h-5 text-yellow-500" />} theme={theme}>
              <button
                onClick={() => setShowManageModal(true)}
                className={`w-full p-4 rounded-lg font-medium transition-all ${
                  theme === 'dark'
                    ? 'bg-gray-900 hover:bg-gray-800'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="font-medium">Manage Subscription</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>View your subscription details</p>
                  </div>
                  <Crown className="w-5 h-5 text-yellow-500" />
                </div>
              </button>
            </SettingsSection>
          )}
          {/* Support */}
          <SettingsSection title="Support" icon={<HelpCircle className="w-5 h-5" />} theme={theme}>
            <button
              onClick={() => setShowSupportModal(true)}
              className={`w-full p-4 rounded-lg font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-gray-900 hover:bg-gray-800'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="font-medium">Contact Support</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Send us a message for help</p>
                </div>
                <HelpCircle className="w-5 h-5 text-green-500" />
              </div>
            </button>
          </SettingsSection>
        </div>
      </div>
      {/* Modals below---unchanged except theme-safe classes. */}
      {showProcessingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
          <div className="text-center">
            {cancellationStatus === 'processing' && (
              <>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-red-500/20"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-red-500 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertCircle className="w-12 h-12 text-red-500 animate-pulse" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Processing Cancellation</h3>
                <p className="text-gray-400">Please wait while we process your request...</p>
              </>
            )}
            {cancellationStatus === 'success' && (
              <>
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                  <div className="relative w-32 h-32 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-white animate-bounce" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-green-500 mb-2">Subscription Cancelled</h3>
                <p className="text-gray-400 mb-2">Your subscription has been cancelled successfully</p>
                <p className="text-sm text-yellow-500">⏱️ Refund will be processed within 48 hours</p>
              </>
            )}
          </div>
        </div>
      )}
      {showManageModal && premiumDetails && (
        <Modal
          title="Subscription Details"
          icon={<Crown className="w-6 h-6 text-yellow-500" />}
          onClose={() => setShowManageModal(false)}
          theme={theme}
        >
          <div className={`p-6 rounded-xl mb-4 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30'
              : 'bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200'
          }`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">{premiumDetails.plan}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Active Premium Membership</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Start Date</span>
                <span className="font-semibold">{formatDate(premiumDetails.startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>End Date</span>
                <span className="font-semibold">{formatDate(premiumDetails.endDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Days Remaining</span>
                <span className="font-bold text-green-500 text-lg">{premiumDetails.daysRemaining} days</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Last Payment</span>
                <span className="font-semibold">₹{premiumDetails.price}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleCancelClick}
            className={`w-full py-3 rounded-lg font-medium transition-colors text-sm ${
              theme === 'dark'
                ? 'text-gray-500 hover:text-red-500 hover:bg-red-500/10'
                : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            Cancel Subscription
          </button>
        </Modal>
      )}
      {showSupportModal && (
        <Modal
          title="Contact Support"
          icon={<HelpCircle className="w-6 h-6 text-green-500" />}
          onClose={() => setShowSupportModal(false)}
          theme={theme}
        >
          <form onSubmit={handleSupportSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Your Message</label>
              <textarea
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                rows="6"
                className={`w-full p-4 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  theme === 'dark' ? 'bg-black border border-gray-800 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'
                }`}
                required
              />
              <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                We typically respond within 24 hours
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </Modal>
      )}
      {showCancelModal && (
        <Modal
          title="Cancel Subscription"
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          onClose={() => setShowCancelModal(false)}
          theme={theme}
        >
          <div className="mb-6">
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We're sorry to see you go. Please help us improve by sharing why you're cancelling.
            </p>
            <div className="space-y-2 mb-4">
              {cancelReasons.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    cancelReason === reason
                      ? theme === 'dark' ? 'bg-red-500/20 border border-red-500' : 'bg-red-50 border border-red-500'
                      : theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-4 h-4 accent-red-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Additional Feedback (Optional)
              </label>
              <textarea
                value={cancelMessage}
                onChange={(e) => setCancelMessage(e.target.value)}
                placeholder="Tell us more about your experience..."
                rows="4"
                className={`w-full p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  theme === 'dark' ? 'bg-black border border-gray-800 text-white' : 'bg-gray-50 border border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Keep Subscription
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              className="flex-1 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Continue
            </button>
          </div>
        </Modal>
      )}
      {showConfirmModal && (
        <Modal
          title="Are you sure?"
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          onClose={() => setShowConfirmModal(false)}
          theme={theme}
        >
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Your subscription will be cancelled immediately. You can request a refund within 48 hours.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmModal(false)}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              No, Keep It
            </button>
            <button
              type="button"
              onClick={handleFinalCancel}
              className="flex-1 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Reusable components
const SettingsSection = ({ title, icon, children, theme }) => (
  <div className={`rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
    <div className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-green-500">{icon}</div>
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      </div>
      {children}
    </div>
  </div>
);

const ToggleItem = ({ label, description, checked, onChange, theme }) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex-1 pr-4">
      <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{label}</p>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{description}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? 'bg-green-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-6' : ''
        }`}
      />
    </button>
  </div>
);

const Modal = ({ title, icon, children, onClose, theme }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

export default Settings;
