import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Crown, Music, Download, Zap, Shield, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatters';

/**
 * Premium Page Component
 * Showcases premium features and pricing
 */
const Premium = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'monthly',
      name: 'Premium Monthly',
      price: 119,
      duration: 'month',
      description: 'Perfect for trying out Premium',
      popular: false,
    },
    {
      id: 'quarterly',
      name: 'Premium Quarterly',
      price: 299,
      duration: '3 months',
      pricePerMonth: 99,
      description: 'Save 17% with quarterly billing',
      popular: true,
      badge: 'BEST VALUE',
    },
    {
      id: 'annual',
      name: 'Premium Annual',
      price: 999,
      duration: 'year',
      pricePerMonth: 83,
      description: 'Save 30% with annual billing',
      popular: false,
    },
  ];

  const features = [
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Ad-Free Music',
      description: 'Enjoy uninterrupted music without any advertisements',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'High Quality Audio',
      description: 'Stream in up to 320kbps for crystal clear sound',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Offline Downloads',
      description: 'Download your favorite songs and listen offline',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Unlimited Skips',
      description: 'Skip as many songs as you want, anytime',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Premium Support',
      description: 'Get priority customer support 24/7',
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: 'Exclusive Content',
      description: 'Access to exclusive releases and early content',
    },
  ];

  const faqs = [
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes! You can cancel your Premium subscription at any time. Your benefits will continue until the end of your billing period.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets.',
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! New users get a 7-day free trial of Premium. Cancel anytime during the trial period.',
    },
    {
      question: 'Can I use Premium on multiple devices?',
      answer: 'Yes, you can use your Premium account on unlimited devices, but can only stream on one device at a time.',
    },
  ];

  const handleSubscribe = (planId) => {
    navigate(`/subscribe?plan=${planId}`);
  };

  if (user?.isPremium) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">You're Already Premium!</h1>
          <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Enjoy all the benefits of TBytez Premium
          </p>
          <button
            onClick={() => navigate('/settings')}
            className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
          <Crown className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Upgrade to Premium
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Unlock the full power of music with ad-free listening, offline downloads, and more
          </p>
          <button
            onClick={() => document.getElementById('plans').scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full font-bold bg-white text-black hover:scale-105 transition-transform text-lg"
          >
            See Plans
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Premium Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl transition-all hover:scale-105 ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div id="plans" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">Choose Your Plan</h2>
        <p className={`text-center text-xl mb-16 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          All plans include all Premium features
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 transition-all hover:scale-105 ${
                plan.popular
                  ? 'bg-gradient-to-br from-green-500 to-green-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-900 border-2 border-gray-800'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-yellow-400 text-black text-sm font-bold">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`mb-6 ${plan.popular ? 'text-white/90' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{formatCurrency(plan.price)}</span>
                  <span className={plan.popular ? 'text-white/90' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                    / {plan.duration}
                  </span>
                </div>
                {plan.pricePerMonth && (
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-white/90' : theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatCurrency(plan.pricePerMonth)}/month
                  </p>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 rounded-full font-bold transition-all ${
                  plan.popular
                    ? 'bg-white text-green-600 hover:bg-gray-100'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                Get Premium
              </button>

              <ul className="mt-8 space-y-3">
                {[
                  'Ad-free music',
                  'Download songs',
                  'High quality audio',
                  'Unlimited skips',
                  'Play any song',
                  'Premium support',
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}
            >
              <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to upgrade?</h2>
          <p className="text-xl mb-8">Start your 7-day free trial today</p>
          <button
            onClick={() => handleSubscribe('monthly')}
            className="px-8 py-4 rounded-full font-bold bg-white text-green-600 hover:scale-105 transition-transform text-lg"
          >
            Try Premium Free
          </button>
          <p className="mt-4 text-sm text-white/80">Cancel anytime during the trial period</p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
