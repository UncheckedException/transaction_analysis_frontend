import React, { useState } from "react";

export default function TransactionsTable({ transactions = [] }) {
  const pageSize = 50;
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(transactions.length / pageSize);

  const paginatedData = transactions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-4">
      <h3 className="font-semibold mb-2">Transactions</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-200">
              <th className="p-2">Date</th>
              <th className="p-2">Narration</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Type</th>
              <th className="p-2">Bank</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((t) => (
              <tr key={t.id} className="border-b">
                <td className="p-2">
                  {new Date(t.transaction_date).toLocaleString()}
                </td>
                <td className="p-2">{t.narration}</td>
                <td className="p-2">₹{t.amount}</td>
                <td className="p-2">{t.type}</td>
                <td className="p-2">{t.bank_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-3 flex justify-between items-center">
        <button
          className="px-3 py-1 bg-slate-200 rounded"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page <strong>{page}</strong> of <strong>{totalPages}</strong>
        </span>

        <button
          className="px-3 py-1 bg-slate-200 rounded"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
