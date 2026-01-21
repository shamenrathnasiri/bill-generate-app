import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white fixed left-0 top-0 flex flex-col shadow-2xl border-r border-gray-700/50">
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800">
        <h2 className="text-2xl font-bold text-white tracking-wider drop-shadow-lg">ABC Graphics</h2>
        <p className="text-xs text-gray-400 mt-1 font-medium">Billing Management System</p>
      </div>
      <nav className="flex-1 py-5">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white border-white shadow-lg"
                    : "text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-gray-500 hover:translate-x-1"
                }`
              }
            >
              <span className="mr-3 text-lg">📊</span>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white border-white shadow-lg"
                    : "text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-gray-500 hover:translate-x-1"
                }`
              }
            >
              <span className="mr-3 text-lg">👥</span>
              Customers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white border-white shadow-lg"
                    : "text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-gray-500 hover:translate-x-1"
                }`
              }
            >
              <span className="mr-3 text-lg">🔧</span>
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bills"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white border-white shadow-lg"
                    : "text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-gray-500 hover:translate-x-1"
                }`
              }
            >
              <span className="mr-3 text-lg">📄</span>
              Bills
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
