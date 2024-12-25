import React from "react";
import { Edit } from "lucide-react";

const EditButton = ({ onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 border border-grey3 bg-whiteColor hover:bg-gray-100 rounded-md transition-colors ${className}`}
  >
    <Edit size={16} />
    <span>Edit</span>
  </button>
);

export default EditButton;
