import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, Smartphone, ArrowLeft, Shield, Check, X, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { validateCardNumber, validateCardExpiry, validateCVV, validateUPI } from '../utils/validators';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

/**
 * Subscribe Page with Professional Payment Processing UI
 * Features: Loading states, success/error animations, multiple payment methods
 */
const Subscribe = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan') || 'monthly';

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [loading, setLoading] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'error' | null
  
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [upiId, setUpiId] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [errors, setErrors] = useState({});

  const plans = {
    monthly: { 
      price: 119, 
      duration: 'month',
      name: 'Premium Monthly',
      durationMonths: 1,
      features: ['Ad-free music', 'Download songs', 'High quality audio', 'Unlimited skips']
    },
    quarterly: { 
      price: 299, 
      duration: '3 months',
      name: 'Premium Quarterly',
      durationMonths: 3,
      pricePerMonth: 99,
      features: ['Ad-free music', 'Download songs', 'High quality audio', 'Unlimited skips', 'Save 17%']
    },
    annual: { 
      price: 999, 
      duration: 'year',
      name: 'Premium Annual',
      durationMonths: 12,
      pricePerMonth: 83,
      features: ['Ad-free music', 'Download songs', 'High quality audio', 'Unlimited skips', 'Save 30%']
    },
  };

  const selectedPlan = plans[planId] || plans.monthly;

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }

    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substr(0, 5);
    }

    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePayment = () => {
    const newErrors = {};

    if (paymentMethod === 'credit-card' || paymentMethod === 'debit-card') {
      const cardValidation = validateCardNumber(cardData.cardNumber.replace(/\s/g, ''));
      if (!cardValidation.isValid) newErrors.cardNumber = cardValidation.error;

      const expiryValidation = validateCardExpiry(cardData.expiryDate);
      if (!expiryValidation.isValid) newErrors.expiryDate = expiryValidation.error;

      const cvvValidation = validateCVV(cardData.cvv);
      if (!cvvValidation.isValid) newErrors.cvv = cvvValidation.error;

      if (!cardData.cardName) newErrors.cardName = 'Name on card is required';
    } else if (paymentMethod === 'upi') {
      const upiValidation = validateUPI(upiId);
      if (!upiValidation.isValid) newErrors.upiId = upiValidation.error;
    } else if (paymentMethod === 'redeem-code') {
      if (!redeemCode || redeemCode.length < 10) {
        newErrors.redeemCode = 'Invalid redeem code';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePayment()) {
      toast.error('Please check your payment details');
      return;
    }

    setLoading(true);
    setShowProcessing(true);
    setPaymentStatus(null);

    try {
      // Simulate payment processing (5 seconds)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Simulate success (90% success rate)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentStatus('success');
        
        // Update user with premium
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.isPremium = true;
        currentUser.premiumPlan = selectedPlan.name;
        currentUser.premiumPlanId = planId;
        
        const startDate = new Date();
        currentUser.premiumStartDate = startDate.toISOString();
        
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + selectedPlan.durationMonths);
        currentUser.premiumEndDate = endDate.toISOString();
        
        currentUser.lastPaymentDate = startDate.toISOString();
        currentUser.lastPaymentAmount = selectedPlan.price;
        currentUser.paymentMethod = paymentMethod;
        
        localStorage.setItem('user', JSON.stringify(currentUser));
        window.dispatchEvent(new Event('userUpdated'));
        
        // Wait 1.5 seconds then redirect
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setPaymentStatus('error');
        setTimeout(() => {
          setShowProcessing(false);
          setLoading(false);
          setPaymentStatus(null);
        }, 2000);
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setTimeout(() => {
        setShowProcessing(false);
        setLoading(false);
        setPaymentStatus(null);
      }, 2000);
    }
  };

  // Payment Processing Modal
  if (showProcessing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="text-center">
          {paymentStatus === null && (
            <>
              {/* Loading State */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <CreditCard className="w-12 h-12 text-green-500 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Processing Payment</h3>
              <p className="text-gray-400">Please wait while we process your payment...</p>
            </>
          )}

          {paymentStatus === 'success' && (
            <>
              {/* Success State */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                <div className="relative w-32 h-32 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-green-500 mb-2">Payment Successful!</h3>
              <p className="text-gray-400">Redirecting to home...</p>
            </>
          )}

          {paymentStatus === 'error' && (
            <>
              {/* Error State */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                <div className="relative w-32 h-32 rounded-full bg-red-500 flex items-center justify-center">
                  <X className="w-16 h-16 text-white animate-bounce" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-red-500 mb-2">Payment Failed</h3>
              <p className="text-gray-400">Please try again or use a different payment method</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/premium')}
          className="flex items-center gap-2 mb-6 text-green-500 hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Plans</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Subscribe to {selectedPlan.name}
            </p>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { id: 'credit-card', label: 'Credit Card', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'debit-card', label: 'Debit Card', icon: <CreditCard className="w-5 h-5" /> },
                { id: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" /> },
                { id: 'redeem-code', label: 'Redeem Code', icon: <Shield className="w-5 h-5" /> },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-xl font-medium transition-all ${
                    paymentMethod === method.id
                      ? 'bg-green-500 text-white transform scale-105 shadow-lg'
                      : theme === 'dark'
                      ? 'bg-gray-900 hover:bg-gray-800 text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    {method.icon}
                    <span className="text-sm">{method.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {(paymentMethod === 'credit-card' || paymentMethod === 'debit-card') && (
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    {paymentMethod === 'credit-card' ? 'Credit Card Details' : 'Debit Card Details'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className={`w-full p-3 rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-black border-gray-700' 
                            : 'bg-white border-gray-300'
                        } border focus:outline-none focus:border-green-500 transition-colors ${
                          errors.cardNumber ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Name on Card</label>
                      <input
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        placeholder="JOHN DOE"
                        className={`w-full p-3 rounded-lg ${
                          theme === 'dark' 
                            ? 'bg-black border-gray-700' 
                            : 'bg-white border-gray-300'
                        } border focus:outline-none focus:border-green-500 transition-colors ${
                          errors.cardName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.cardName && (
                        <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleCardChange}
                          placeholder="MM/YY"
                          maxLength="5"
                          className={`w-full p-3 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-black border-gray-700' 
                              : 'bg-white border-gray-300'
                          } border focus:outline-none focus:border-green-500 transition-colors ${
                            errors.expiryDate ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-500 mt-1">{errors.expiryDate}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={cardData.cvv}
                          onChange={handleCardChange}
                          placeholder="123"
                          maxLength="4"
                          className={`w-full p-3 rounded-lg ${
                            theme === 'dark' 
                              ? 'bg-black border-gray-700' 
                              : 'bg-white border-gray-300'
                          } border focus:outline-none focus:border-green-500 transition-colors ${
                            errors.cvv ? 'border-red-500' : ''
                          }`}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    UPI Payment
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        if (errors.upiId) {
                          setErrors(prev => ({ ...prev, upiId: '' }));
                        }
                      }}
                      placeholder="username@upi"
                      className={`w-full p-3 rounded-lg ${
                        theme === 'dark' 
                          ? 'bg-black border-gray-700' 
                          : 'bg-white border-gray-300'
                      } border focus:outline-none focus:border-green-500 transition-colors ${
                        errors.upiId ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.upiId && (
                      <p className="text-sm text-red-500 mt-1">{errors.upiId}</p>
                    )}
                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      Enter your UPI ID (e.g., yourname@paytm, yourname@googlepay)
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === 'redeem-code' && (
                <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Redeem Code
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Enter Code</label>
                    <input
                      type="text"
                      value={redeemCode}
                      onChange={(e) => {
                        setRedeemCode(e.target.value.toUpperCase());
                        if (errors.redeemCode) {
                          setErrors(prev => ({ ...prev, redeemCode: '' }));
                        }
                      }}
                      placeholder="XXXX-XXXX-XXXX"
                      className={`w-full p-3 rounded-lg font-mono ${
                        theme === 'dark' 
                          ? 'bg-black border-gray-700' 
                          : 'bg-white border-gray-300'
                      } border focus:outline-none focus:border-green-500 transition-colors ${
                        errors.redeemCode ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.redeemCode && (
                      <p className="text-sm text-red-500 mt-1">{errors.redeemCode}</p>
                    )}
                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}>
                      Enter your premium redeem code
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(selectedPlan.price)}`
                )}
              </button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <Shield className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`} />
                <span className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
                  Secured by 256-bit SSL encryption
                </span>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-xl sticky top-8 ${
              theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-200'
            }`}>
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{selectedPlan.name}</span>
                </div>
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Billed {selectedPlan.duration}
                  {selectedPlan.pricePerMonth && (
                    <span> ({formatCurrency(selectedPlan.pricePerMonth)}/month)</span>
                  )}
                </div>
              </div>

              <div className="mb-6 space-y-2">
                {selectedPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className={`border-t pt-4 space-y-3 ${
                theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
              }`}>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedPlan.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{formatCurrency(0)}</span>
                </div>
                <div className={`border-t pt-3 ${
                  theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-green-500">
                      {formatCurrency(selectedPlan.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscribe;
