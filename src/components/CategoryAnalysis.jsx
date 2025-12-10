import React from "react";
import { CATEGORY_RULES } from "../utils/categoryMapper";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"];

export default function CategoryBreakdown({ transactions = [] }) {

  // Categorize based on rules
  const categoryCount = {};

  transactions.forEach(t => {
    const narration = t.narration?.toLowerCase() || "";
    let category = "Uncategorized";

    Object.entries(CATEGORY_RULES).forEach(([cat, keys]) => {
      keys.forEach(k => {
        if (narration.includes(k)) {
          category = cat;
        }
      });
    });

    if (!categoryCount[category]) categoryCount[category] = 0;
    categoryCount[category] += 1;
  });

  const data = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[300px]">
      <h3 className="font-semibold mb-2">Category Breakdown</h3>
      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              labelLine={false}
              outerRadius={100}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(v) => `${v} transactions`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
