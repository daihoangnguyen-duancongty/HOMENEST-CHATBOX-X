"use client";
interface ToggleProps {
  checked: boolean;
  loading?: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ checked, loading, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      disabled={loading}
      className={`relative w-12 h-6 rounded-full transition ${
        checked ? "bg-green-500" : "bg-gray-400"
      } ${loading ? "opacity-50" : ""}`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
}
