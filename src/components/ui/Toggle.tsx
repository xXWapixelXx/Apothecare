import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  activeColor?: string;
  inactiveColor?: string;
}

export function Toggle({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  description,
  size = "md",
  activeColor = "bg-emerald-600",
  inactiveColor = "bg-gray-200",
  className,
  ...props
}: ToggleProps) {
  const toggleSizes = {
    sm: {
      container: "w-8 h-4",
      circle: "w-3 h-3",
      translate: "translate-x-4"
    },
    md: {
      container: "w-10 h-5",
      circle: "w-4 h-4",
      translate: "translate-x-5"
    },
    lg: {
      container: "w-12 h-6",
      circle: "w-5 h-5",
      translate: "translate-x-6"
    }
  };

  const { container, circle, translate } = toggleSizes[size];

  return (
    <div className={cn("flex items-center", className)}>
      {(label || description) && (
        <div className="mr-2 flex-1">
          {label && <div className="text-sm font-medium">{label}</div>}
          {description && <div className="text-xs text-gray-500">{description}</div>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
          container,
          checked ? activeColor : inactiveColor,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        {...props}
      >
        <motion.span
          animate={{
            x: checked ? parseInt(translate.split("-x-")[1]) : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0",
            circle,
            "ml-0.5 mt-0.5"
          )}
        />
      </button>
    </div>
  );
} 