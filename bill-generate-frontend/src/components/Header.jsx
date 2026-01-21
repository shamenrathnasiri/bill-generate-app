import React from "react";

const Header = ({ onMenuClick }) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm px-4 sm:px-6 py-4 rounded-xl shadow-md border border-gray-200 mb-6 animate-fade-in">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <button onClick={onMenuClick} className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-sm hover:shadow-md hover:scale-110 transition-all duration-300 ease-out md:hidden">
          ☰
        </button>
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">ABC Graphics</h2>
          <p className="text-sm text-gray-600 font-medium">Manage your billing & clients</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 sm:mt-0">
        <div className="relative group hidden sm:block">
          <input
            type="search"
            placeholder="Search customers, services..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors">🔍</span>
        </div>

        <div className="w-9 h-9 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">A</div>
      </div>
    </header>
  );
};

export default Header;
