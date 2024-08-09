import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"
        role="status"
      ></div>
    </div>
  );
};

export default Loader;
