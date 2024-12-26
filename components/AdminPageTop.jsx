import { exportSVG, filter, searchComponent } from "@/public/icons";
import React from "react";

const AdminPageTop = ({ showFilter = true }) => {
  return (
    <div className="flex items-center justify-between my-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 justify-start border border-lightGrey rounded-[5px] h-[36px] relative max-w-max px-3">
          <img src={searchComponent.src} alt="" className="mt-0.5" />
          <input
            type="text"
            className={`border-transparent bg-transparent text-brandBlack h-full py-0 mb-0 placeholder:text-12px focus:focus-visible:none`}
            placeholder={`Search here...`}
          />
        </div>
        {showFilter && <img src={filter.src} alt="" className="mt-1.5" />}
      </div>
      <img src={exportSVG.src} alt="" className="mt-0.5 h-[41.5px] ml-2" />
    </div>
  );
};

export default AdminPageTop;
