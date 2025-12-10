import React, { useState, useEffect } from "react";
import { fetchTransactions } from "../api/transactions";

import FiltersPanel from "../components/FiltersPanel";
import SummaryCards from "../components/SummaryCards";
import SpendingIncomeChart from "../components/SpendingIncomeChart";
import CategoryAnalysis from "../components/CategoryAnalysis";
import TransactionsTable from "../components/TransactionsTable";
import TransactionScatterPlot from "../components/TransactionScatterPlot";
import TransactionsPerDayChart from "../components/TransactionsPerDayChart";
import StatsPanel from "../components/StatsPanel";


export default function Dashboard() {

  const [filter, setFilter] = useState({
    bankName: "",
    narration: "",
    minAmount: null,
    maxAmount: null,
    startDate: null,
    endDate: null,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // THIS MUST TRIGGER WHEN APPLY IS CLICKED
  useEffect(() => {
    if (!filter.startDate || !filter.endDate) return;

    setLoading(true);

    console.log("Calling backend with filter: ", filter);

    fetchTransactions(filter)
      .then((rows) => {
        console.log("Fetched:", rows);
        setData(rows);
      })
      .catch((err) => {
        console.error("Error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="p-4 bg-slate-100 min-h-screen">

      {/* THIS MUST EXIST EXACTLY LIKE THIS */}
      <FiltersPanel onApply={setFilter} />

      <SummaryCards transactions={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <SpendingIncomeChart transactions={data} />
        <CategoryAnalysis transactions={data} />
      </div>

      <div className="mt-4">
        <TransactionScatterPlot transactions={data} filter={filter} />
      </div>
      <StatsPanel transactions={data} />
      <div className="mt-4">
        <TransactionsPerDayChart transactions={data} />
      </div>
      <div className="mt-4">
        <TransactionsTable transactions={data} loading={loading} />
      </div>
    </div>
  );
}
