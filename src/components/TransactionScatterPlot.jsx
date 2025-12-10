import React from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TransactionScatterPlot({ transactions = [], filter = {} }) {
  
  // Build clean scatter data
  const cleanData = transactions
    .filter(t => t.transaction_date && t.amount)
    .map(t => ({
      time: new Date(t.transaction_date).getTime(),
      amount: t.amount,
      type: t.type,
      narration: t.narration,
      bank: t.bank_name,
    }))
    .filter(d => !isNaN(d.time)); // remove invalid dates

  if (cleanData.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
        <h3 className="font-semibold mb-2">Transaction Scatter Plot</h3>
        <p className="text-slate-500">No transactions available.</p>
      </div>
    );
  }

  // Determine domain
  const hasFilterRange =
    filter.startDate && filter.endDate &&
    filter.startDate !== "" && filter.endDate !== "";

  let xMin, xMax;

  if (hasFilterRange) {
    // Use filter’s dates (corrected to timestamps)
    xMin = new Date(filter.startDate).getTime();
    xMax = new Date(filter.endDate).getTime();
  } else {
    // Auto domain from data
    xMin = Math.min(...cleanData.map(d => d.time));
    xMax = Math.max(...cleanData.map(d => d.time));
  }

  // Ensure domain makes sense
  if (!xMin || !xMax || isNaN(xMin) || isNaN(xMax)) {
    xMin = Math.min(...cleanData.map(d => d.time));
    xMax = Math.max(...cleanData.map(d => d.time));
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
      <h3 className="font-semibold mb-2">Transaction Scatter Plot (Amount vs Time)</h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="time"
              type="number"
              domain={[xMin, xMax]}
              tickFormatter={(ts) => new Date(ts).toLocaleDateString()}
              name="Date"
            />

            <YAxis
              dataKey="amount"
              type="number"
              name="Amount"
              tickFormatter={(v) => `₹${v}`}
            />

            <Tooltip
              formatter={(value, name) => {
                if (name === "time") return new Date(value).toLocaleString();
                if (name === "amount") return `₹${value}`;
                return value;
              }}
              labelFormatter={() => ""}
            />

            <Scatter
              name="Credits"
              data={cleanData.filter(p => p.type === "credit")}
              fill="#22c55e"
            />

            <Scatter
              name="Debits"
              data={cleanData.filter(p => p.type === "debit")}
              fill="#ef4444"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
