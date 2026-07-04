import React from "react";

const Header = () => {
  return (
    <header className="flex items-center bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-sm px-6 py-4 rounded-xl shadow-md border border-gray-200 mb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">ABC Graphics</h2>
          <p className="text-sm text-gray-600 font-medium">Manage your billing & clients</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
