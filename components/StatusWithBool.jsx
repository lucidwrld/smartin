import React from "react";
import { Check } from "lucide-react";

const StatusButtonWithBool = ({ isActive = false, text = "Status" }) => {
  const styles = isActive
    ? {
        backgroundColor: "#ECFDF3",
        color: "#358619",
      }
    : {
        backgroundColor: "#E2E3E5",
        color: "#383D41",
      };

  return (
    <button
      className="text-10px rounded-[20px] px-5 py-1 flex items-center gap-1"
      style={{ backgroundColor: styles.backgroundColor, color: styles.color }}
    >
      {isActive && <Check size={14} />}
      {text}
    </button>
  );
};

export default StatusButtonWithBool;
