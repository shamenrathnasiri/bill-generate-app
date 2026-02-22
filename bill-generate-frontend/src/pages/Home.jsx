import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboardService from "../controller/dashboardService";

/* ─── tiny helper ─── */
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ─── Animated counter ─── */
const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1200 }) => {
  const end = Number(value) || 0;
  const [display, setDisplay] = useState(end);
  useEffect(() => {
    if (end === 0) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return (
    <span>
      {prefix}
      {Number.isInteger(value) ? Math.round(display) : fmt(display)}
      {suffix}
    </span>
  );
};

/* ─── Mini bar chart (pure CSS) ─── */
const MiniBarChart = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <div className="flex items-end gap-2 h-36">
      {data.map((d, i) => {
        const pct = (d.revenue / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold text-gray-500">
              {d.revenue > 0 ? `Rs. ${fmt(d.revenue)}` : ""}
            </span>
            <div className="w-full relative group" style={{ height: "110px" }}>
              <div
                className="absolute bottom-0 w-full rounded-t-lg bg-linear-to-t from-amber-500 to-amber-300 transition-all duration-700 ease-out group-hover:from-amber-600 group-hover:to-amber-400 animate-bar-rise"
                style={{
                  height: `${Math.max(pct, 4)}%`,
                  minHeight: "6px",
                  animationDelay: `${i * 120}ms`,
                }}
              />
            </div>
            <span className="text-[11px] font-semibold text-gray-500">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Donut chart (SVG) ─── */
const DonutChart = ({ paid, unpaid }) => {
  const total = paid + unpaid || 1;
  const paidPct = (paid / total) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const paidDash = (paidPct / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="12" />
        <circle
          cx="50" cy="50" r={radius} fill="none" stroke="#f59e0b" strokeWidth="12"
          strokeDasharray={`${paidDash} ${circumference}`}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold text-gray-900">{Math.round(paidPct)}%</span>
        <span className="text-[10px] text-gray-500 font-medium">Paid</span>
      </div>
    </div>
  );
};

/* ─── Sparkline (SVG) ─── */
const Sparkline = ({ data, color = "#f59e0b" }) => {
  if (!data || data.length === 0) return null;
  const values = data.map((d) => d.revenue);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const w = 120, h = 40;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {values.map((v, i) => (
        <circle key={i} cx={(i / (values.length - 1)) * w} cy={h - ((v - min) / range) * h} r="3"
          fill="white" stroke={color} strokeWidth="2" />
      ))}
    </svg>
  );
};

/* ════════════════════════════════ MAIN DASHBOARD ═══════════════════════════════ */
const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService
      .getStats()
      .then((data) => setStats(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-md">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-bold text-red-800 mb-2">Unable to load dashboard</h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const s = stats || {};

  /* ─── Stat cards config ─── */
  const statCards = [
    {
      label: "Total Revenue",
      value: s.total_revenue,
      prefix: "Rs. ",
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-amber-400 to-orange-500",
      bgGlow: "shadow-amber-200/50",
      sparkData: s.monthly_revenue,
    },
    {
      label: "Total Customers",
      value: s.total_customers,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-blue-400 to-indigo-500",
      bgGlow: "shadow-blue-200/50",
    },
    {
      label: "Total Services",
      value: s.total_services,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: "from-emerald-400 to-teal-500",
      bgGlow: "shadow-emerald-200/50",
    },
    {
      label: "Total Bills",
      value: s.total_bills,
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-purple-400 to-fuchsia-500",
      bgGlow: "shadow-purple-200/50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ───── Title Row ───── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between animate-slide-down">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back — here's what's happening today</p>
        </div>
        <div className="flex gap-2 mt-3 sm:mt-0">
          <button onClick={() => navigate("/bills")}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-linear-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Bill
          </button>
          <button onClick={() => navigate("/customers")}
            className="px-4 py-2 text-sm font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Customer
          </button>
        </div>
      </div>

      {/* ───── Stat Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`relative overflow-hidden bg-white rounded-2xl p-5 shadow-lg ${card.bgGlow} border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group animate-fade-in`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Background decorative blob */}
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-linear-to-br ${card.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">{card.label}</p>
                <p className="text-3xl font-extrabold text-gray-900">
                  <AnimatedNumber value={card.value} prefix={card.prefix || ""} />
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-linear-to-br ${card.gradient} text-white shadow-lg`}>
                {card.icon}
              </div>
            </div>

            {card.sparkData && (
              <div className="mt-3 relative z-10">
                <Sparkline data={card.sparkData} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ───── Month Highlights ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <div className="bg-linear-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-100">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-amber-800">This Month Revenue</span>
          </div>
          <p className="text-2xl font-extrabold text-amber-900">Rs. {fmt(s.month_revenue)}</p>
        </div>
        <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-100">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-blue-800">Bills This Month</span>
          </div>
          <p className="text-2xl font-extrabold text-blue-900">{s.month_bills}</p>
        </div>
        <div className="bg-linear-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-emerald-100">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-emerald-800">New Customers</span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-900">{s.new_customers_month}</p>
        </div>
      </div>

      {/* ───── Charts Row ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Trend</h3>
              <p className="text-xs text-gray-500 font-medium">Last 6 months overview</p>
            </div>
            <div className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
              Rs. {fmt(s.total_revenue)} total
            </div>
          </div>
          <MiniBarChart data={s.monthly_revenue || []} />
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Payment Status</h3>
          <p className="text-xs text-gray-500 font-medium mb-4">Paid vs Unpaid Bills</p>
          <DonutChart paid={s.paid_bills} unpaid={s.unpaid_bills} />
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="font-medium text-gray-700">Paid ({s.paid_bills})</span>
              </div>
              <span className="font-bold text-gray-900">Rs. {fmt(s.paid_amount)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="font-medium text-gray-700">Unpaid ({s.unpaid_bills})</span>
              </div>
              <span className="font-bold text-gray-900">Rs. {fmt(s.unpaid_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Tables Row ───── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Bills */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Bills</h3>
            <button onClick={() => navigate("/bills")} className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              View All →
            </button>
          </div>
          {s.recent_bills && s.recent_bills.length > 0 ? (
            <div className="space-y-3">
              {s.recent_bills.map((bill, i) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                  style={{ animationDelay: `${0.8 + i * 0.08}s` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${bill.is_paid ? "bg-linear-to-br from-emerald-400 to-emerald-600" : "bg-linear-to-br from-red-400 to-red-600"}`}>
                      {bill.customer_name ? bill.customer_name[0].toUpperCase() : "#"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{bill.bill_number}</p>
                      <p className="text-xs text-gray-500">{bill.customer_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">Rs. {fmt(bill.total)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bill.is_paid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {bill.is_paid ? "PAID" : "UNPAID"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📄</div>
              <p className="text-sm font-medium">No bills yet</p>
            </div>
          )}
        </div>

        {/* Top Customers */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Top Customers</h3>
            <button onClick={() => navigate("/customers")} className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
              View All →
            </button>
          </div>
          {s.top_customers && s.top_customers.length > 0 ? (
            <div className="space-y-3">
              {s.top_customers.map((customer, i) => {
                const maxBilled = s.top_customers[0]?.total_billed || 1;
                const pct = (customer.total_billed / maxBilled) * 100;
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={customer.id}
                    className="relative p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${0.9 + i * 0.08}s` }}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{medals[i] || `#${i + 1}`}</span>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{customer.name}</p>
                          <p className="text-xs text-gray-500">{customer.bill_count} bill{customer.bill_count !== 1 ? "s" : ""}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 text-sm">Rs. {fmt(customer.total_billed)}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-amber-400 to-orange-500 transition-all duration-1000 ease-out"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">👥</div>
              <p className="text-sm font-medium">No customer data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* ───── Top Services ───── */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-fade-in" style={{ animationDelay: "0.9s" }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Popular Services</h3>
            <p className="text-xs text-gray-500 font-medium">Most used services by bill count</p>
          </div>
          <button onClick={() => navigate("/services")} className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            View All →
          </button>
        </div>
        {s.top_services && s.top_services.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {s.top_services.map((svc, i) => {
              const colors = [
                "from-amber-400 to-orange-500",
                "from-blue-400 to-indigo-500",
                "from-emerald-400 to-teal-500",
                "from-purple-400 to-fuchsia-500",
                "from-pink-400 to-rose-500",
              ];
              return (
                <div
                  key={svc.id}
                  className="relative overflow-hidden bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-200 group animate-fade-in"
                  style={{ animationDelay: `${1.0 + i * 0.08}s` }}
                >
                  <div className={`absolute -top-3 -right-3 w-16 h-16 rounded-full bg-linear-to-br ${colors[i % colors.length]} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative z-10">
                    <div className={`inline-block text-xs font-bold text-white px-2 py-0.5 rounded-md bg-linear-to-r ${colors[i % colors.length]} mb-2`}>
                      #{i + 1}
                    </div>
                    <p className="font-bold text-gray-900 text-sm truncate">{svc.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Used {svc.usage_count} time{svc.usage_count !== 1 ? "s" : ""}</p>
                    <p className="text-sm font-bold text-gray-700 mt-1">Rs. {fmt(svc.total_earned)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">🔧</div>
            <p className="text-sm font-medium">No service data yet</p>
          </div>
        )}
      </div>

      {/* ───── Quick Actions Footer ───── */}
      <div className="bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl animate-fade-in" style={{ animationDelay: "1s" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">Quick Actions</h3>
            <p className="text-sm text-gray-400">Jump to common tasks</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Create Bill", path: "/bills", icon: "📄" },
              { label: "Add Customer", path: "/customers", icon: "👤" },
              { label: "Add Service", path: "/services", icon: "🔧" },
              { label: "View Reports", path: "/reports", icon: "📊" },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-semibold backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
