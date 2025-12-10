import React from 'react'
import Dashboard from './components/Dashboard'


export default function App() {
  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-800">
      <h1 className="text-2xl font-semibold mb-4">Transaction Dashboard</h1>
      <Dashboard />
    </div>
  );
}
