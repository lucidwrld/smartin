import React from "react";

const ResponseComponent = ({ isSuccess, successMessage, error }) => {
  return !isSuccess
    ? error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )
    : isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      );
};

export default ResponseComponent;
