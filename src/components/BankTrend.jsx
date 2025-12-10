import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BankTrend({ transactions = [] }) {
  const map = {};

  transactions.forEach(t => {
    const bank = t.bank_name || "Unknown";
    if (!map[bank]) map[bank] = 0;
    map[bank] += t.amount;
  });

  const data = Object.entries(map).map(([name, value]) => ({
    bank: name,
    amount: value
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
      <h3 className="font-semibold mb-2">Bank-wise Trend</h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="bank" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
