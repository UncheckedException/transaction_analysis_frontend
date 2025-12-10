import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from "recharts";

export default function TransactionsPerDayChart({ transactions = [] }) {

  // Aggregate transaction count per day
  const dailyMap = {};

  transactions.forEach(t => {
    if (!t.transaction_date) return;
    const d = new Date(t.transaction_date);
    const key = d.toISOString().slice(0, 10);

    if (!dailyMap[key]) {
      dailyMap[key] = { date: key, count: 0 };
    }
    dailyMap[key].count += 1;
  });

  const data = Object.values(dailyMap)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[300px]">
      <h3 className="font-semibold mb-2">Number of Transactions per Day</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            
            <XAxis dataKey="date" />
            <YAxis />
            
            <Tooltip formatter={(v) => `${v} transactions`} />
            <Legend />

            <Line
              type="monotone"
              dataKey="count"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
