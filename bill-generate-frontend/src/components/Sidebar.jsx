import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed left-0 top-0 flex flex-col shadow-xl">
      <div className="p-5 border-b border-white/10">
        <h2 className="text-xl font-semibold text-cyan-400">Bill Generator</h2>
      </div>
      <nav className="flex-1 py-5">
        <ul className="space-y-1">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                    : "text-gray-400 border-transparent hover:bg-white/10 hover:text-white hover:border-cyan-400"
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
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                    : "text-gray-400 border-transparent hover:bg-white/10 hover:text-white hover:border-cyan-400"
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
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                    : "text-gray-400 border-transparent hover:bg-white/10 hover:text-white hover:border-cyan-400"
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
                    ? "bg-cyan-500/15 text-cyan-400 border-cyan-400"
                    : "text-gray-400 border-transparent hover:bg-white/10 hover:text-white hover:border-cyan-400"
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
