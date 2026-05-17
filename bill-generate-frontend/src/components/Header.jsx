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

    </header>
  );
};

export default Header;
