import React from "react";

export const renderData = (data) => {
  if (typeof data === "string" || typeof data === "number") {
    return <p>{data}</p>;
  }
  if (React.isValidElement(data)) {
    return data;
  }
  return null;
};
