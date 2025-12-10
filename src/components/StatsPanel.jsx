import React from "react";

export default function StatsPanel({ transactions = [] }) {
  if (transactions.length === 0) return null;

  // Avg amount
  const avgAmount =
    transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0) /
    transactions.length;

  // Date-based stats
  const dates = transactions.map(t => new Date(t.transaction_date).toISOString().slice(0,10));
  const uniqueDates = [...new Set(dates)];

  const avgTransactionsPerDay = transactions.length / uniqueDates.length;

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-semibold mb-2">Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="p-2 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Total Transactions</div>
          <div className="text-xl font-bold">{transactions.length}</div>
        </div>

        <div className="p-2 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Avg Amount</div>
          <div className="text-xl font-bold">₹{avgAmount.toFixed(2)}</div>
        </div>

        <div className="p-2 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Days Active</div>
          <div className="text-xl font-bold">{uniqueDates.length}</div>
        </div>

        <div className="p-2 bg-slate-100 rounded">
          <div className="text-sm text-slate-500">Avg Txns/Day</div>
          <div className="text-xl font-bold">{avgTransactionsPerDay.toFixed(2)}</div>
        </div>

      </div>
    </div>
  );
}
