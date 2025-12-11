import React from "react";

export default function SummaryCards({ transactions = [], startDate, endDate }) {
  
  // ----------- SAFE DATE PARSER -----------
  const toDate = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const s = toDate(startDate);
  const e = toDate(endDate);

  // ----------- TOTAL DAYS -----------
  let totalDays = "—";
  if (s && e) {
    const diffMs = e.getTime() - s.getTime();
    const numDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    totalDays = numDays > 0 ? numDays : "—";
  }

  // ----------- INCOME / EXPENSE / COUNT -----------
  const income = transactions
    .filter((t) => (t.type || "").toLowerCase() === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const expense = transactions
    .filter((t) => (t.type || "").toLowerCase() === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const count = transactions.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

      <div className="bg-[#232529] border border-[#393B40] p-4 rounded-xl">
        <h3 className="text-xs font-semibold text-slate-300">Total Income</h3>
        <p className="text-xl font-bold text-green-400 mt-1">₹{income.toFixed(2)}</p>
      </div>

      <div className="bg-[#232529] border border-[#393B40] p-4 rounded-xl">
        <h3 className="text-xs font-semibold text-slate-300">Total Expense</h3>
        <p className="text-xl font-bold text-red-400 mt-1">₹{expense.toFixed(2)}</p>
      </div>

      <div className="bg-[#232529] border border-[#393B40] p-4 rounded-xl">
        <h3 className="text-xs font-semibold text-slate-300">Transactions</h3>
        <p className="text-xl font-bold text-slate-100 mt-1">{count}</p>
      </div>

      <div className="bg-[#232529] border border-[#393B40] p-4 rounded-xl">
        <h3 className="text-xs font-semibold text-slate-300">Total Days</h3>
        <p className="text-xl font-bold text-slate-100 mt-1">{totalDays}</p>
      </div>

    </div>
  );
}
