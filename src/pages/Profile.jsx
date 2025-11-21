import React, { useState } from 'react';
import { Edit, Mail, Calendar, Crown, User as UserIcon, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

// For demo: use API/hook later
const useDemoUser = () => JSON.parse(localStorage.getItem('user') || '{}');

const Profile = () => {
  const { theme } = useTheme();
  const user = useDemoUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  // --- PREMIUM LOGIC ---
  const premium = (() => {
    if (!user?.isPremium) return null;
    const start = user.premiumStartDate ? new Date(user.premiumStartDate) : null;
    const end = user.premiumEndDate ? new Date(user.premiumEndDate) : null;
    const days = end && start ? Math.max(0, Math.ceil((end - new Date()) / 86400000)) : 0;
    return { plan: user.premiumPlan || 'Premium', start, end, days };
  })();

  // Save action (later swap for backend call)
  const saveEdit = () => {
    localStorage.setItem('user', JSON.stringify({ ...user, ...editData }));
    toast.success('Profile updated!');
    setIsEditing(false);
    window.location.reload();
  };

  // Responsive, modern, elegant
  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#090d18]' : 'bg-gray-50'} font-sans flex flex-col`}>
      {/* ========== HEADER ========== */}
      <section className="w-full pt-10 pb-2 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-green-400 to-green-700 shadow-lg flex items-center justify-center text-white text-4xl sm:text-5xl font-bold">
            {(user?.username || user?.email || 'U')[0].toUpperCase()}
          </div>
          {premium && (
            <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-white shadow">
              <Crown className="w-5 h-5 text-white" />
            </span>
          )}
        </div>
        <h1 className="mt-3 text-2xl sm:text-3xl font-black flex items-center justify-center gap-2">
          {user?.username || 'User'}
          {premium ? <CheckCircle className="text-green-500 w-5 h-5" /> : null}
        </h1>
        {user?.email && (
          <span className="text-base flex items-center gap-2 mt-1 text-gray-500 dark:text-gray-300">
            <Mail className="w-4 h-4" /> {user.email}
          </span>
        )}
        <button
          className="mt-3 px-5 py-2 rounded-full bg-white/20 dark:bg-gray-800/40 font-semibold shadow text-sm hover:bg-white/40 dark:hover:bg-gray-800/60 transition"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="inline w-4 h-4 mr-1" />
          Edit Profile
        </button>
      </section>

      {/* ========== EDIT MODAL ========== */}
      {isEditing &&
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full max-w-md border dark:border-gray-800">
            <h2 className="text-xl font-bold mb-3">Edit Profile</h2>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="block w-full mb-2 px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
              type="text"
              value={editData.username}
              onChange={e => setEditData(prev => ({ ...prev, username: e.target.value }))}
            />
            <label className="block text-sm mb-1">Email</label>
            <input
              className="block w-full mb-4 px-3 py-2 rounded border border-gray-300 dark:border-gray-700"
              type="email"
              value={editData.email}
              onChange={e => setEditData(prev => ({ ...prev, email: e.target.value }))}
            />
            <div className="flex gap-3">
              <button className="flex-1 py-2 rounded bg-green-500 text-white font-semibold" onClick={saveEdit}>Save</button>
              <button className="flex-1 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-semibold" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        </div>
      }

      {/* ========== CONTENT CARDS ========== */}
      <main className="w-full flex-1 flex flex-col items-center justify-start py-6">
        <div className="w-full max-w-lg lg:max-w-3xl flex flex-col gap-5">
          {/* PROFILE */}
          <Card theme={theme} title="Profile Information">
            <div className="text-xs text-gray-500 dark:text-gray-400">Username</div>
            <div className="font-bold mb-1">{user?.username || <span className="text-gray-400">Not set</span>}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
            <div className="font-bold">{user?.email || <span className="text-gray-400">Not set</span>}</div>
          </Card>
          {/* PREMIUM */}
          {premium && (
            <Card theme={theme} title={<span className="flex items-center gap-2 text-yellow-700 font-bold"><Crown className="w-5 h-5" />Premium Member</span>} customBg="bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-400/30">
              <div className="flex justify-between text-sm mt-1 mb-2">
                <span className="font-semibold text-yellow-800 dark:text-yellow-300">Plan</span>
                <span className="font-semibold text-yellow-700 dark:text-yellow-100 text-right">{premium.plan}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Start</span>
                <span>{premium.start && premium.start.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Ends</span>
                <span>{premium.end && premium.end.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-green-600 dark:text-green-300">Days left</span>
                <span className="font-extrabold">{premium.days}</span>
              </div>
              <button className="mt-3 w-full py-2 rounded bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold shadow-sm text-sm" onClick={()=>window.location.href='/settings'}>
                Manage Subscription
              </button>
            </Card>
          )}
          {/* STATISTICS */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoStat icon={<UserIcon className="w-6 h-6" />} label="Premium" value={premium ? "Active" : "Free"} theme={theme} />
            <InfoStat icon={<Calendar className="w-6 h-6" />} value={user?.createdAt ? new Date(user.createdAt).getFullYear() : '2025'} label="Member Since" theme={theme} />
            <InfoStat icon={<CheckCircle className="w-6 h-6" />} value="Active" label="Account Status" theme={theme} />
          </div>
          {/* RECENT ACTIVITY */}
          <Card theme={theme} title="Recent Activity">
            <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Your recent listening activity will appear here
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

// Card layout for each section, takes optional override for premium
function Card({ theme, title, children, customBg }) {
  return (
    <div className={`rounded-xl p-4 shadow-sm mb-1 ${customBg || (theme === 'dark' ? 'bg-[#121a2c] text-white' : 'bg-white text-gray-900')}`}>
      <div className="font-bold text-base mb-2">{title}</div>
      {children}
    </div>
  );
}

// Small stat chips
function InfoStat({ icon, value, label, theme }) {
  return (
    <div className={`flex flex-col items-center rounded-lg p-4 ${theme === 'dark' ? 'bg-black/40 text-white' : 'bg-white text-gray-900'} shadow-sm`}>
      <span>{icon}</span>
      <span className="font-bold">{value}</span>
      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
}

export default Profile;
