import { Search } from "lucide-react";
import React from "react";

const SearchComponent = () => {
  return (
    <div className="flex items-center gap-2 justify-start border border-lightGrey rounded-[5px] h-[36px] relative max-w-max px-3">
      <Search className="w-6 h-6 mt-1.5 text-gray-600" />
      <input
        type="text"
        className={`border-transparent bg-transparent text-brandBlack h-full py-0 mb-0 placeholder:text-12px focus:focus-visible:none`}
        placeholder={`Search here...`}
      />
    </div>
  );
};

export default SearchComponent;
