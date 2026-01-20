import React from "react";

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>

      <section className="bg-gradient-to-r from-cyan-50 to-white rounded-2xl p-6 mb-6 shadow-inner">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-800">Business Overview</h2>
            <p className="text-sm text-slate-500 mt-1">This month performance highlights</p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-500">Revenue</div>
              <div className="text-xl font-bold text-slate-800">$0</div>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-500">Invoices</div>
              <div className="text-xl font-bold text-slate-800">0</div>
            </div>
            <div className="px-4 py-2 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-500">New Customers</div>
              <div className="text-xl font-bold text-slate-800">0</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="text-4xl mr-5 bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-xl">👥</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Customers</h3>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="text-4xl mr-5 bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-xl">🔧</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Services</h3>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="text-4xl mr-5 bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-xl">📄</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Total Bills</h3>
            <p className="text-3xl font-bold text-slate-800">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="text-4xl mr-5 bg-gradient-to-br from-cyan-400 to-blue-600 p-4 rounded-xl">💰</div>
          <div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">Revenue</h3>
            <p className="text-3xl font-bold text-slate-800">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
