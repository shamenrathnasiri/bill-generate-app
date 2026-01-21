import React from "react";

const Home = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8 animate-slide-down tracking-tight">Dashboard</h1>

      <section className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 mb-8 shadow-md border border-gray-200 animate-fade-in" style={{animationDelay: '0.1s'}}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Overview</h2>
            <p className="text-sm text-gray-600 mt-2 font-medium">This month performance highlights</p>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm text-gray-600 font-semibold">Revenue</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">$0</div>
            </div>
            <div className="px-5 py-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm text-gray-600 font-semibold">Invoices</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">0</div>
            </div>
            <div className="px-5 py-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="text-sm text-gray-600 font-semibold">New Customers</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">0</div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 flex items-center shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.2s'}}>
          <div className="text-4xl mr-5 bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">👥</div>
          <div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total Customers</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.3s'}}>
          <div className="text-4xl mr-5 bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">🔧</div>
          <div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total Services</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.4s'}}>
          <div className="text-4xl mr-5 bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">📄</div>
          <div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Total Bills</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 flex items-center shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in" style={{animationDelay: '0.5s'}}>
          <div className="text-4xl mr-5 bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">💰</div>
          <div>
            <h3 className="text-gray-600 text-sm font-semibold mb-1">Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">$0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
