"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown, Check, X, Loader2 } from "lucide-react";

interface OptionItem {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  id: string;
  label: string;
  value: string;
  options: (string | OptionItem)[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  loading?: boolean;
  emptyMessage?: string;
}

export default function SearchableSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option...",
  disabled = false,
  required = false,
  error,
  loading = false,
  emptyMessage = "No matching items found",
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options
  const normalizedOptions: OptionItem[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <label htmlFor={id} className="form-label">
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>

      {/* Main Select Button */}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.625rem 0.875rem",
          background: disabled ? "var(--color-neutral-100)" : "#ffffff",
          border: error
            ? "1.5px solid #dc2626"
            : isOpen
            ? "1.5px solid var(--color-primary)"
            : "1px solid var(--color-border)",
          borderRadius: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: "0.9375rem",
          color: selectedOption
            ? "var(--color-neutral-900)"
            : "var(--color-neutral-400)",
          boxShadow: isOpen
            ? "0 0 0 3px rgba(34, 197, 94, 0.15)"
            : "0 1px 2px rgba(0, 0, 0, 0.05)",
          transition: "all 0.15s ease",
          userSelect: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {loading ? (
            <span style={{ color: "var(--color-neutral-500)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Loader2 size={16} className="spinner" /> Loading options...
            </span>
          ) : selectedOption ? (
            selectedOption.label
          ) : (
            placeholder
          )}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {selectedOption && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                color: "var(--color-neutral-400)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={18}
            style={{
              color: "var(--color-neutral-500)",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
            }}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="form-error">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            zIndex: 999,
            background: "#ffffff",
            border: "1px solid var(--color-border)",
            borderRadius: "8px",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
            overflow: "hidden",
            maxHeight: "320px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Box */}
          <div
            style={{
              padding: "0.5rem 0.625rem",
              borderBottom: "1px solid var(--color-neutral-200)",
              background: "var(--color-neutral-50)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Search size={16} style={{ color: "var(--color-neutral-400)", flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type to search..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.875rem",
                color: "var(--color-neutral-900)",
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-neutral-400)",
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div
            role="listbox"
            style={{
              overflowY: "auto",
              maxHeight: "260px",
              padding: "0.25rem 0",
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: "0.625rem 0.875rem",
                      fontSize: "0.875rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: isSelected
                        ? "var(--color-green-50)"
                        : "transparent",
                      color: isSelected
                        ? "var(--color-primary-dark)"
                        : "var(--color-neutral-800)",
                      fontWeight: isSelected ? 600 : 400,
                      transition: "background 0.1s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background =
                          "var(--color-neutral-100)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <Check size={16} style={{ color: "var(--color-primary)" }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  color: "var(--color-neutral-500)",
                }}
              >
                {emptyMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
