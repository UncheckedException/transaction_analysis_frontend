import React, { useState } from "react";

// Soft-dark + aqua neon theme
const COLOR = {
  accent: "#2ECCB0",
  bg: "#1A1C20",
  panelBg: "#222428",
  cardBg: "#26282C",
  border: "#3A3D44",
  textPrimary: "#F2F2F3",
  textSecondary: "#CACACC",
};

const BANKS = ["HDFC", "phone_pay", "paytm"];
const TYPES = ["DEBIT", "CREDIT"];

export default function FiltersPanel({ onApply }) {
  const [local, setLocal] = useState({
    bankName: "",
    type: "",
    minAmount: "",
    maxAmount: "",
    startDate: "",
    endDate: "",
  });

  const [mode, setMode] = useState("exact"); // exact | multiple
  const [singleNarration, setSingleNarration] = useState("");
  const [narrationInput, setNarrationInput] = useState("");
  const [narrationTags, setNarrationTags] = useState([]);

  const update = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const normalizeDate = (date, isEnd) => {
    if (!date) return null;
    return date.length === 10
      ? isEnd
        ? `${date}T23:59:59`
        : `${date}T00:00:00`
      : date;
  };

  const addTag = () => {
    const v = narrationInput.trim().toLowerCase();
    if (!v || narrationTags.includes(v)) return setNarrationInput("");
    setNarrationTags((p) => [...p, v]);
    setNarrationInput("");
  };

  const handleTagKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addTag();
    }
  };

  const applyFilters = () => {
    onApply({
      bankName: local.bankName || null,
      type: local.type || null,
      minAmount: local.minAmount || null,
      maxAmount: local.maxAmount || null,
      startDate: normalizeDate(local.startDate, false),
      endDate: normalizeDate(local.endDate, true),
      narration: mode === "exact" ? singleNarration.trim() || null : null,
      narrationList: mode === "multiple" ? narrationTags : null,
    });
  };

  return (
    <div
      className="p-4 rounded-xl mb-4"
      style={{
        background: COLOR.bg,
        border: `1px solid ${COLOR.border}`,
      }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <h3
          className="text-lg font-semibold"
          style={{ color: COLOR.textPrimary }}
        >
          Filters
        </h3>

        {/* Toggle (exact / multiple) */}
        <div className="flex items-center gap-3">
          <span
            style={{
              color:
                mode === "exact" ? COLOR.textPrimary : COLOR.textSecondary,
            }}
          >
            Exact
          </span>

          <div
            onClick={() =>
              setMode((m) => (m === "exact" ? "multiple" : "exact"))
            }
            className="w-12 h-6 rounded-full cursor-pointer relative"
            style={{ background: COLOR.cardBg, border: `1px solid ${COLOR.border}` }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#fff",
                position: "absolute",
                top: 3,
                left: mode === "exact" ? 3 : 33,
                transition: "all 200ms ease",
                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          <span
            style={{
              color:
                mode === "multiple" ? COLOR.textPrimary : COLOR.textSecondary,
            }}
          >
            Multiple
          </span>
        </div>
      </div>

      {/* ROW 1 */}
      <div className="flex gap-3 mb-2">
        {/* Bank */}
        <select
          value={local.bankName}
          onChange={(e) => update("bankName", e.target.value)}
          className="p-2 rounded flex-[0_0_150px]"
          style={{
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
            color: COLOR.textPrimary,
          }}
        >
          <option value="">Bank</option>
          {BANKS.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>

        {/* Type */}
        <select
          value={local.type}
          onChange={(e) => update("type", e.target.value)}
          className="p-2 rounded flex-[0_0_140px]"
          style={{
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
            color: COLOR.textPrimary,
          }}
        >
          <option value="">Type</option>
          {TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>

        {/* Narration */}
        {mode === "exact" ? (
          <input
            value={singleNarration}
            onChange={(e) => setSingleNarration(e.target.value)}
            placeholder="Narration (exact)"
            className="p-2 rounded flex-1"
            style={{
              background: COLOR.cardBg,
              border: `1px solid ${COLOR.border}`,
              color: COLOR.textPrimary,
            }}
          />
        ) : (
          <div
            className="flex-1 p-2 rounded"
            style={{
              background: COLOR.cardBg,
              border: `1px solid ${COLOR.border}`,
            }}
          >
            <div className="flex flex-wrap gap-2 mb-1">
              {narrationTags.map((t) => (
                <div
                  key={t}
                  className="px-3 py-1 rounded-full flex items-center gap-2"
                  style={{
                    background: "#1F2A28",
                    color: COLOR.accent,
                    border: `1px solid ${COLOR.accent}55`,
                  }}
                >
                  <span>{t}</span>
                  <button
                    onClick={() =>
                      setNarrationTags((p) => p.filter((x) => x !== t))
                    }
                    style={{ color: "#FF6B6B" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              value={narrationInput}
              placeholder="Add keyword and press Enter"
              onChange={(e) => setNarrationInput(e.target.value)}
              onKeyDown={handleTagKey}
              className="p-1 w-full rounded"
              style={{
                background: "transparent",
                border: "none",
                color: COLOR.textPrimary,
              }}
            />
          </div>
        )}
      </div>

      {/* ROW 2 — Grouped Filters */}
      <div className="flex gap-3 mb-4">
        {/* Amount */}
        <div
          className="p-2 rounded flex gap-2 items-center flex-1"
          style={{
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <input
            placeholder="Min Amount"
            value={local.minAmount}
            onChange={(e) => update("minAmount", e.target.value)}
            className="p-2 rounded flex-1"
            style={{
              background: "#1A1C20",
              color: COLOR.textPrimary,
              border: `1px solid ${COLOR.border}`,
            }}
          />
          <input
            placeholder="Max Amount"
            value={local.maxAmount}
            onChange={(e) => update("maxAmount", e.target.value)}
            className="p-2 rounded flex-1"
            style={{
              background: "#1A1C20",
              color: COLOR.textPrimary,
              border: `1px solid ${COLOR.border}`,
            }}
          />
        </div>

        {/* Date */}
        <div
          className="p-2 rounded flex gap-2 items-center flex-1"
          style={{
            background: COLOR.cardBg,
            border: `1px solid ${COLOR.border}`,
          }}
        >
          <input
            type="date"
            value={local.startDate}
            onChange={(e) => update("startDate", e.target.value)}
            className="p-2 rounded flex-1"
            style={{
              background: "#1A1C20",
              color: COLOR.textPrimary,
              border: `1px solid ${COLOR.border}`,
            }}
          />
          <input
            type="date"
            value={local.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            className="p-2 rounded flex-1"
            style={{
              background: "#1A1C20",
              color: COLOR.textPrimary,
              border: `1px solid ${COLOR.border}`,
            }}
          />
        </div>
      </div>

      {/* APPLY BUTTON */}
      <div className="flex justify-center mt-2">
        <button
          onClick={applyFilters}
          className="px-6 py-2 rounded-lg font-semibold transition-all"
          style={{
            background: COLOR.accent,
            color: "#1A1C20",
            border: `1px solid ${COLOR.accent}`,
            boxShadow: `0 4px 12px ${COLOR.accent}55`,
            transform: "translateY(0px)",
          }}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
