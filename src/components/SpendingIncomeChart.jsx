import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

function prepareData(transactions) {
  const map = {};

  transactions.forEach((t) => {
    if (!t.transaction_date) return;

    const d = new Date(t.transaction_date);
    if (isNaN(d)) return;

    const key = d.toISOString().slice(0, 10);

    if (!map[key]) map[key] = { date: key, income: 0, expense: 0 };

    if (t.type === "credit") map[key].income += t.amount;
    else map[key].expense += t.amount;
  });

  return Object.values(map).sort((a, b) =>
    a.date.localeCompare(b.date)
  );
}

export default function SpendingIncomeChart({ transactions = [] }) {
  const data = prepareData(transactions);

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
      <h3 className="font-semibold mb-2">Spending vs Income</h3>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="income" stackId="1" fillOpacity={0.4} />
            <Area type="monotone" dataKey="expense" stackId="1" fillOpacity={0.4} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
