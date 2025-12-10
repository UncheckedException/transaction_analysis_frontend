import React from "react";

export default function Timeline({ transactions = [] }) {
  const sorted = [...transactions].sort((a, b) =>
    (a.transaction_date || "").localeCompare(b.transaction_date)
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow min-h-[320px]">
      <h3 className="font-semibold mb-2">Timeline</h3>

      <div className="space-y-3 max-h-64 overflow-auto">

        {sorted.map(t => (
          <div key={t.id} className="border-l-4 border-blue-600 pl-3">
            <div className="text-sm text-slate-500">
              {new Date(t.transaction_date).toLocaleString()}
            </div>
            <div className="font-semibold">{t.narration}</div>
            <div className="text-sm text-slate-600">{t.bank_name}</div>
            <div
              className={`font-bold ${
                t.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{t.amount.toFixed(2)}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
