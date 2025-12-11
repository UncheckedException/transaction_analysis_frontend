import React, { useState, useMemo } from "react";
import { CATEGORY_RULES } from "../utils/categoryMapper";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

/* Unified FilterPanel color theme */
const COLOR = {
  bg: "#1A1C20",
  panelBg: "#222428",
  cardBg: "#26282C",
  border: "#3A3D44",
  textPrimary: "#F2F2F3",
  textSecondary: "#CACACC",
  accent: "#2ECCB0",
};

/* Vibrant Pie Colors */
const PIE_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#0EA5E9",
  "#84CC16",
];

export default function CategoryAnalysis({ transactions = [] }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const toggleCategory = (cat) =>
    setSelectedCategory((prev) => (prev === cat ? null : cat));

  /* CATEGORY MAPPING */
  const categorized = useMemo(() => {
  return transactions.map((t) => {
    const raw = (t.narration || "");
    const n = raw.toLowerCase().replace(/\s+/g, " ").trim();

    let category = "Uncategorized";

    outer: for (const [cat, keys] of Object.entries(CATEGORY_RULES)) {
      for (const key of keys) {
        const cleanKey = key.toLowerCase().replace(/\s+/g, " ").trim();

        // Robust multi-word matching
        if (cleanKey && n.includes(cleanKey)) {
          category = cat;
          break outer; // stop at first matching category
        }
      }
    }

    return { ...t, category };
  });
}, [transactions]);

  /* CATEGORY STATS */
  const categoryStats = {};
  categorized.forEach((t) => {
    if (!categoryStats[t.category]) {
      categoryStats[t.category] = { count: 0, amount: 0 };
    }
    categoryStats[t.category].count += 1;
    categoryStats[t.category].amount += Number(t.amount || 0);
  });

  const chartData = Object.entries(categoryStats).map(([name, stats]) => ({
    name,
    value: stats.count,
    totalAmount: stats.amount,
  }));

  const sortedCategories = chartData.sort((a, b) => b.value - a.value);

  /* Filtered Txns */
  let filteredTxns = selectedCategory
    ? categorized.filter((t) => t.category === selectedCategory)
    : [];

  /* Sorting */
  if (sortConfig.key) {
    filteredTxns = filteredTxns.sort((a, b) => {
      const x = a[sortConfig.key];
      const y = b[sortConfig.key];
      return sortConfig.direction === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
    });
  }

  const handleSort = (key) =>
    setSortConfig((prev) => ({
      key,
      direction: prev.direction === "asc" ? "desc" : "asc",
    }));

  return (
    <div
      className="p-6 rounded-xl mb-6"
      style={{
        background: COLOR.panelBg,
        border: `1px solid ${COLOR.border}`,
      }}
    >
      <h3
        className="text-xl font-semibold mb-4"
        style={{ color: COLOR.textPrimary }}
      >
        Category Breakdown
      </h3>

      <div className="flex gap-6">
        {/* PIE SECTION */}
        <div
          className="rounded-xl p-4"
          style={{
            flexBasis: "70%",
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <ResponsiveContainer width="100%" height={380}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                outerRadius={140}
                onClick={(e) => toggleCategory(e.name)}
              >
                {chartData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke="#1A1A1A"
                    strokeWidth={1}
                  />
                ))}
              </Pie>

              <Tooltip
                wrapperStyle={{ zIndex: 1000 }}
                contentStyle={{
                  background: "#FFFFFF",
                  borderRadius: 10,
                  border: `1px solid ${COLOR.border}`,
                  color: "#000",
                }}
                formatter={(value, name, props) => [
                  `${value} transactions`,
                  `₹${props.payload.totalAmount.toFixed(2)}`,
                ]}
              />

              <Legend verticalAlign="bottom" wrapperStyle={{ color: COLOR.textSecondary }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY LIST */}
        <div
          className="rounded-xl p-4"
          style={{
            flexBasis: "30%",
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
            paddingRight: "10px",
          }}
        >
          <h4 className="font-semibold mb-3" style={{ color: COLOR.textPrimary }}>
            Categories
          </h4>

          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "260px", paddingRight: 6 }}
          >
            {sortedCategories.map((cat, i) => {
              const active = selectedCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => toggleCategory(cat.name)}
                  className="px-3 py-2 rounded-lg cursor-pointer flex justify-between items-center"
                  style={{
                    background: COLOR.panelBg,
                    border: `1px solid ${
                      active ? PIE_COLORS[i % PIE_COLORS.length] : COLOR.border
                    }`,
                  }}
                >
                  <span
                    className="flex items-center gap-2"
                    style={{ color: COLOR.textPrimary }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    {cat.name}
                  </span>

                  <span style={{ color: COLOR.textSecondary }}>{cat.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SUMMARY PANEL */}
      {selectedCategory && (
        <div
          className="mt-6 p-4 rounded-xl"
          style={{
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <h4 className="font-semibold mb-4" style={{ color: COLOR.textPrimary }}>
            {selectedCategory} Summary
          </h4>

          {/* SUMMARY CARDS */}
          <div className="flex gap-4 mb-4">
            <div
              className="p-4 rounded-lg text-center flex-1"
              style={{
                background: COLOR.panelBg,
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div style={{ color: COLOR.textSecondary }}>Total Txns</div>
              <div className="text-2xl font-bold" style={{ color: COLOR.accent }}>
                {categoryStats[selectedCategory].count}
              </div>
            </div>

            <div
              className="p-4 rounded-lg text-center flex-1"
              style={{
                background: COLOR.panelBg,
                border: `1px solid ${COLOR.border}`,
              }}
            >
              <div style={{ color: COLOR.textSecondary }}>Total Amount</div>
              <div className="text-2xl font-bold" style={{ color: COLOR.accent }}>
                ₹{categoryStats[selectedCategory].amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div
            className="overflow-y-auto rounded-lg"
            style={{
              maxHeight: "260px",
              border: `1px solid ${COLOR.border}`,
            }}
          >
            <table className="min-w-full text-sm">
              <thead style={{ background: "#333748" }}>
                <tr>
                  {["transactionDate", "narration", "amount", "type"].map((key) => (
                    <th
                      key={key}
                      className="p-2 text-left cursor-pointer"
                      onClick={() => handleSort(key)}
                      style={{ color: COLOR.textPrimary }}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredTxns.map((t) => (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${COLOR.border}` }}>
                    <td className="p-2" style={{ color: COLOR.textSecondary }}>
                      {new Date(
                        t.transaction_date || t.transactionDate
                      ).toLocaleString()}
                    </td>
                    <td className="p-2" style={{ color: COLOR.textPrimary }}>
                      {t.narration}
                    </td>
                    <td
                      className="p-2 font-semibold"
                      style={{
                        color: t.type?.toLowerCase() === "debit" ? "#EF4444" : "#10B981",
                      }}
                    >
                      ₹{t.amount}
                    </td>
                    <td className="p-2" style={{ color: COLOR.textSecondary }}>
                      {t.type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
