import React from "react";
import { Puff } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      <Puff
        height="80"
        width="80"
        radius={1}
        color="#101010"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </div>
  );
};

export default Loader;
