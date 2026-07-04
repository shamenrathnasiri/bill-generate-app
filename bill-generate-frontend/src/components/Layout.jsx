import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <Sidebar isOpen={true} onClose={() => {}} />

      <main className="flex-1 p-8 min-h-screen ml-64">
        <div className="max-w-7xl mx-auto">
          <Header />
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
