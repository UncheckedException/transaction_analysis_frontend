import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { CATEGORY_RULES } from "../utils/categoryMapper"; // if you have category map

export default function TransactionScatterPlot({ transactions = [], filter = {} }) {
  
  // Categorize narration
  const getCategory = (narration = "") => {
    const lower = narration.toLowerCase();
    for (const [cat, keys] of Object.entries(CATEGORY_RULES)) {
      for (const k of keys) {
        if (lower.includes(k)) return cat;
      }
    }
    return "Uncategorized";
  };

  const cleanData = transactions
    .filter(t => t.transaction_date && t.amount)
    .map(t => {
      const time = new Date(t.transaction_date).getTime();
      return {
        time,
        amount: t.amount,
        type: t.type?.toLowerCase(),
        narration: t.narration,
        bank: t.bank_name,
        category: getCategory(t.narration)
      };
    })
    .filter(d => !isNaN(d.time));

  if (cleanData.length === 0) {
    return (
      <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
        <h3 className="font-semibold mb-2">Transaction Scatter Plot</h3>
        <p className="text-slate-500">No transactions available.</p>
      </div>
    );
  }

  // Determine original domain
  const minTime = Math.min(...cleanData.map(d => d.time));
  const maxTime = Math.max(...cleanData.map(d => d.time));

  // Zoom factor state (1 means original, 2 means zoom 2x)
  const [zoomFactor, setZoomFactor] = useState(1);

  // Dynamic range calculation based on zoomFactor
  const [xMin, xMax] = useMemo(() => {
    if (zoomFactor === 1) return [minTime, maxTime];

    const mid = (minTime + maxTime) / 2;
    const range = (maxTime - minTime) / zoomFactor;

    return [mid - range / 2, mid + range / 2];
  }, [minTime, maxTime, zoomFactor]);

  const zoomIn = () => setZoomFactor((z) => Math.min(10, z * 1.5));
  const zoomOut = () => setZoomFactor((z) => Math.max(1, z / 1.5));

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold mb-2">Transaction Scatter Plot (Amount vs Time)</h3>

        {/* Zoom Controls */}
        <div className="flex gap-2">
          <button
            className="px-2 py-1 bg-slate-200 rounded"
            onClick={zoomIn}
          >
            Zoom +
          </button>
          <button
            className="px-2 py-1 bg-slate-200 rounded"
            onClick={zoomOut}
          >
            Zoom –
          </button>
        </div>
      </div>

      <div className="w-full h-72">
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

            {/* ⭐ Custom Tooltip with Category + Narration */}
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const p = payload[0].payload;
                return (
                  <div className="bg-white p-3 shadow rounded border">
                    <div><strong>Date:</strong> {new Date(p.time).toLocaleString()}</div>
                    <div><strong>Amount:</strong> ₹{p.amount}</div>
                    <div><strong>Type:</strong> {p.type}</div>
                    <div><strong>Category:</strong> {p.category}</div>
                    <div><strong>Narration:</strong> {p.narration}</div>
                  </div>
                );
              }}
            />

            {/* ⭐ Less clutter via small size + opacity */}
            <Scatter
              name="Credits"
              data={cleanData.filter(p => p.type === "credit")}
              fill="#22c55e"
              opacity={0.6}
              shape="circle"
              size={40 / zoomFactor}   // smaller dots when zoomed out
            />

            <Scatter
              name="Debits"
              data={cleanData.filter(p => p.type === "debit")}
              fill="#ef4444"
              opacity={0.6}
              shape="circle"
              size={40 / zoomFactor}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
