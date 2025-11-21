import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

/**
 * CancelSubscriptionModal Component
 * Modal for cancelling premium subscription
 * 
 * Features:
 * - Reason selection
 * - Immediate or end-of-period cancellation
 * - Confirmation step
 * - Loading states
 */
const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(1); // 1: reasons, 2: confirmation
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalFeedback, setAdditionalFeedback] = useState('');
  const [cancelImmediate, setCancelImmediate] = useState(false);
  const [loading, setLoading] = useState(false);

  const cancellationReasons = [
    'Too expensive',
    'Not using enough',
    'Missing features',
    'Poor audio quality',
    'Technical issues',
    'Found better alternative',
    'Temporary break',
    'Other',
  ];

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);
  };

  const handleContinue = () => {
    if (!selectedReason) {
      toast.error('Please select a reason');
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    
    try {
      await onConfirm({
        reason: selectedReason,
        feedback: additionalFeedback,
        immediate: cancelImmediate,
      });
      
      toast.success('Subscription cancelled successfully');
      handleClose();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedReason('');
    setAdditionalFeedback('');
    setCancelImmediate(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        } transform transition-all`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
          disabled={loading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <>
              {/* Step 1: Select Reason */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  We're sorry to see you go
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Help us improve by telling us why you're cancelling
                </p>
              </div>

              {/* Reasons */}
              <div className="space-y-2 mb-6">
                {cancellationReasons.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => handleReasonSelect(reason)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedReason === reason
                        ? theme === 'dark'
                          ? 'bg-white/10 border-2 border-white'
                          : 'bg-gray-100 border-2 border-gray-900'
                        : theme === 'dark'
                        ? 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reason}</span>
                      {selectedReason === reason && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Additional Feedback */}
              <div className="mb-6">
                <label className="block mb-2 font-medium">
                  Additional feedback (optional)
                </label>
                <textarea
                  value={additionalFeedback}
                  onChange={(e) => setAdditionalFeedback(e.target.value)}
                  placeholder="Tell us more..."
                  rows="3"
                  className={`w-full p-3 rounded-lg resize-none ${
                    theme === 'dark'
                      ? 'bg-white/5 border border-gray-700 focus:border-white'
                      : 'bg-gray-50 border border-gray-300 focus:border-gray-900'
                  } focus:outline-none transition-colors`}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Keep Premium
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!selectedReason}
                  className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                    selectedReason
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Confirmation */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Confirm Cancellation
                </h2>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Choose when to end your subscription
                </p>
              </div>

              {/* Cancellation Options */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setCancelImmediate(false)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    !cancelImmediate
                      ? theme === 'dark'
                        ? 'bg-white/10 border-2 border-white'
                        : 'bg-gray-100 border-2 border-gray-900'
                      : theme === 'dark'
                      ? 'bg-white/5 border-2 border-transparent'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    Cancel at end of billing period
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Keep Premium until Dec 31, 2025. No refund.
                  </div>
                </button>

                <button
                  onClick={() => setCancelImmediate(true)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    cancelImmediate
                      ? theme === 'dark'
                        ? 'bg-white/10 border-2 border-white'
                        : 'bg-gray-100 border-2 border-gray-900'
                      : theme === 'dark'
                      ? 'bg-white/5 border-2 border-transparent'
                      : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    Cancel immediately
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Lose Premium access now. Prorated refund available.
                  </div>
                </button>
              </div>

              {/* Warning */}
              <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
                <p className="text-sm text-red-500">
                  <strong>You will lose:</strong> Ad-free listening, offline downloads, 
                  high quality audio, and unlimited skips.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={loading}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 hover:bg-white/20'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;
