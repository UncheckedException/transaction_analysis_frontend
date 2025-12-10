import React from "react";

export default function SummaryCards({ transactions = [] }) {

  const income = transactions
    .filter(t => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const count = transactions.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      
      <div className="bg-white p-4 shadow rounded-xl">
        <h3 className="text-sm text-slate-500">Total Income</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹{income.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h3 className="text-sm text-slate-500">Total Expense</h3>
        <p className="text-2xl font-bold text-red-600">
          ₹{expense.toFixed(2)}
        </p>
      </div>

      <div className="bg-white p-4 shadow rounded-xl">
        <h3 className="text-sm text-slate-500">Transactions Count</h3>
        <p className="text-2xl font-bold">{count}</p>
      </div>

    </div>
  );
}
