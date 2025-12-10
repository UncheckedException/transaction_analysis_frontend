import axios from "axios";

// Set backend URL (from env or fallback)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

/**
 * Convert backend camelCase → frontend snake_case uniformly
 */
function normalizeTx(t) {
  return {
    id: t.id,
    bank_name: t.bankName,
    transaction_date: t.transactionDate,
    narration: t.narration,
    amount: Number(t.amount || 0),
    type: t.type?.toLowerCase(),
    category: t.category,
    reference_number: t.referenceNumber,
    created_at: t.createdAt,
  };
}

export async function fetchTransactions(filter) {
  const url = `${API_BASE}/api/transactions/filter`;

  const response = await axios.post(url, filter);
  const rows = response.data || [];

  return rows.map(normalizeTx);
}
