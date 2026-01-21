import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* mobile backdrop when sidebar is open */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <main className={`flex-1 p-4 md:p-8 min-h-screen md:ml-64`}>
        <div className="max-w-7xl mx-auto">
          <Header onMenuClick={toggleSidebar} />
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
