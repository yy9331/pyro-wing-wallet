import React from "react"

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "password" | "number"
  label?: string
  error?: string
  className?: string
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = "text",
  label,
  error,
  className = ""
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-gray-700 border border-gray-500/40 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-200 ${
          error ? "border-red-500 focus:ring-red-500" : ""
        }`}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}