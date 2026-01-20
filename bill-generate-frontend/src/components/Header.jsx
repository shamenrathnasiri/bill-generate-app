import React from "react";

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-white/70 backdrop-blur-md px-6 py-4 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white rounded-lg shadow hover:scale-105 transition">☰</button>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Welcome back, Admin</h2>
          <p className="text-sm text-slate-500">Here's what's happening with your business today</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="search"
            placeholder="Search customers, services..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 text-white rounded-lg shadow">New Bill</button>
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">A</div>
      </div>
    </header>
  );
};

export default Header;
