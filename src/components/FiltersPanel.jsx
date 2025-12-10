import React, { useState } from "react";

export default function FiltersPanel({ onApply }) {
  const [local, setLocal] = useState({
    bankName: "",
    narration: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  // NEW: narration tag input
  const [narrationInput, setNarrationInput] = useState("");
  const [narrationTags, setNarrationTags] = useState([]);

  const update = (field, value) => {
    setLocal(prev => ({ ...prev, [field]: value }));
  };

  // Normalize date and append time if missing
  const normalizeDate = (dateStr, isEnd) => {
    if (!dateStr || dateStr.trim() === "") return null;

    if (dateStr.length === 10) {
      return isEnd ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`;
    }
    if (dateStr.length === 16) {
      return isEnd ? `${dateStr}:59` : `${dateStr}:00`;
    }

    return dateStr;
  };

  // -------------------------------
  // TAG HANDLING LOGIC
  // -------------------------------
  const addTag = () => {
    const value = narrationInput.trim().toLowerCase();

    if (value === "" || narrationTags.includes(value)) {
      setNarrationInput("");
      return;
    }

    setNarrationTags(prev => [...prev, value]);
    setNarrationInput("");
  };

  const removeTag = (tag) => {
    setNarrationTags(prev => prev.filter(t => t !== tag));
  };

  const handleNarrationKey = (e) => {
    if (["Enter", " ", ",", "Comma"].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  // Final payload merge
  const applyFilters = () => {
    const payload = {
      bankName: local.bankName.trim() === "" ? null : local.bankName.trim(),
      narration: local.narration.trim() === "" ? null : local.narration.trim(),

      narrationList:
        narrationTags.length > 0 ? narrationTags : null,

      minAmount: local.minAmount !== "" ? Number(local.minAmount) : null,
      maxAmount: local.maxAmount !== "" ? Number(local.maxAmount) : null,

      startDate: normalizeDate(local.startDate, false),
      endDate: normalizeDate(local.endDate, true),
    };

    console.log("Final Filter Payload:", payload);
    onApply(payload);
  };

  return (
    <div className="bg-white p-4 shadow rounded-xl mb-4">
      <h3 className="font-semibold mb-3">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <input
          className="border p-2 rounded"
          placeholder="Bank Name"
          value={local.bankName}
          onChange={(e) => update("bankName", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Narration (exact match)"
          value={local.narration}
          onChange={(e) => update("narration", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Min Amount"
          value={local.minAmount}
          onChange={(e) => update("minAmount", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="number"
          placeholder="Max Amount"
          value={local.maxAmount}
          onChange={(e) => update("maxAmount", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="date"
          value={local.startDate}
          onChange={(e) => update("startDate", e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="date"
          value={local.endDate}
          onChange={(e) => update("endDate", e.target.value)}
        />

      </div>

      {/* --------------------------------------------------
          NARRATION TAG INPUT UI
      -------------------------------------------------- */}
      <div className="mt-4">
        <label className="font-semibold">Narration Keywords (multiple)</label>

        <div className="border p-2 rounded w-full min-h-[48px] flex flex-wrap gap-2 items-center bg-white">

          {narrationTags.map((tag, idx) => (
            <div
              key={idx}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center"
            >
              {tag}
              <button
                className="ml-2 text-red-500 font-bold"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </div>
          ))}

          <input
            type="text"
            className="flex-grow outline-none p-1"
            placeholder="Type and press Enter…"
            value={narrationInput}
            onChange={(e) => setNarrationInput(e.target.value)}
            onKeyDown={handleNarrationKey}
          />
        </div>
      </div>

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={applyFilters}
      >
        Apply Filters
      </button>
    </div>
  );
}
