import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "/assets/LOGO.png";

const Sidebar = ({ isOpen = false }) => {
  return (
    <div className={`fixed z-40 left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col shadow-2xl border-r border-gray-700/50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
      <div className="p-6 border-b border-gray-700 bg-gradient-to-r from-gray-900 to-gray-800 flex flex-col items-center text-center gap-2">
        <img src={Logo} alt="ABC Graphics Logo" className="h-20 md:h-28 w-auto drop-shadow-[0_0_25px_rgba(0,0,0,0.6)]" />
        <h2 className="text-2xl -mt-5 font-bold text-white tracking-wider drop-shadow-lg">ABC Graphics</h2>
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
              <div className="mr-4 p-2 rounded-xl bg-gradient-to-br from-[#FD7600] via-[#EB9402] to-[#E5BF00] shadow-[0_0_15px_rgba(253,118,0,0.3)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                </svg>
              </div>
              <span className="font-semibold tracking-wide">Dashboard</span>
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
              <div className="mr-4 p-2 rounded-xl bg-gradient-to-br from-[#EB9402] to-[#E5BF00] shadow-[0_0_15px_rgba(235,148,2,0.3)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="font-semibold tracking-wide">Customers</span>
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
              <div className="mr-4 p-2 rounded-xl bg-gradient-to-br from-[#FD7600] to-[#E5BF00] shadow-[0_0_15px_rgba(253,118,0,0.3)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <span className="font-semibold tracking-wide">Services</span>
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
              <div className="mr-4 p-2 rounded-xl bg-gradient-to-br from-[#FD7600] via-[#EB9402] to-[#E5BF00] shadow-[0_0_15px_rgba(253,118,0,0.3)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className="font-semibold tracking-wide">Bills</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `flex items-center px-5 py-3 border-l-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 text-white border-white shadow-lg"
                    : "text-gray-300 border-transparent hover:bg-white/10 hover:text-white hover:border-gray-500 hover:translate-x-1"
                }`
              }
            >
              <div className="mr-4 p-2 rounded-xl bg-gradient-to-br from-[#FD7600] via-[#EB9402] to-[#E5BF00] shadow-[0_0_15px_rgba(253,118,0,0.3)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
              </div>
              <span className="font-semibold tracking-wide">Reports</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
