import React, { useState } from "react";

import Loader from "./Loader";
import OptionsPopup from "./PopupOptions";
import { renderData } from "../utils/renderData";

import CustomCheckBox from "./CustomCheckBox";
import CustomButton from "./Button";
import { emptyState, moreMore } from "@/public/icons";

const TablesComponent = ({
  data,
  isLoading,
  hideActionButton = false,
  headers,
  options = [],
  popUpFunction,
  showCheckBox = true,
  buttonFunction,
  getFormattedValue,
  toggleRowFunction,
  toggleSelectAllFunction,
  setSelectedRows,
  selectedRows = [],
}) => {
  const [selected, setSelected] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  // const [selectedRows, setSelectedRows] = useState([]);

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((_, i) => i));
    }
    toggleSelectAllFunction();
  };

  const toggleRow = (index, val) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
    toggleRowFunction(index, val);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className=" bg-white  w-full relative h-full overflow-y-auto scrollbar-hide">
      <div className="w-full relative h-full">
        <table className="w-full">
          <thead className=" lg:table-header-group sticky top-0 bg-[#F0F2F5]  z-10">
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="py-3.5 px-4 text-left font-medium text-black text-[10px]"
                >
                  <div className="flex gap-3 items-center">
                    {i === 0 && showCheckBox && (
                      <CustomCheckBox
                        // checked={selectedRows.length === data.length}
                        onChange={toggleSelectAll}
                      />
                    )}
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((eachRow, index) => {
                const formatedValue = getFormattedValue(eachRow, index);
                return (
                  // In your table row, rearrange the cells like this:
                  <tr
                    key={index}
                    className={`${index % 2 ? "bg-white" : "bg-[#fafafa]"} `}
                  >
                    {/* First render all data columns */}
                    {formatedValue.map((item, i) => (
                      <td
                        key={i}
                        className="px-4 py-5 text-[10px] text-gray-900 align-top whitespace-nowrap lg:align-middle"
                      >
                        <div className="flex items-center gap-3">
                          {i === 0 && showCheckBox && (
                            <CustomCheckBox
                              onChange={() => toggleRow(index, eachRow)}
                              checked={selectedRows.includes(index)}
                            />
                          )}
                          {renderData(item)}
                        </div>
                      </td>
                    ))}

                    {/* Then render the action button column at the end */}
                    {!hideActionButton && (
                      <td className="lg:table-cell whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              setSelected(eachRow);
                              if (options.length > 0) {
                                setShowOptions(
                                  index === currentIndex ? !showOptions : true
                                );
                              } else {
                                buttonFunction(eachRow);
                              }
                              setCurrentIndex(index);
                            }}
                          >
                            {options.length > 0 ? (
                              <img src={moreMore.src} alt="" />
                            ) : (
                              <CustomButton
                                className="p-1"
                                buttonText={"View"}
                              />
                            )}
                          </button>
                          <div className="relative">
                            {currentIndex === index && showOptions && (
                              <OptionsPopup
                                options={options}
                                popUpFunction={(option, inx) => {
                                  setShowOptions(false);
                                  popUpFunction(option, inx, selected);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={headers.length} className="py-6">
                  <div className="flex flex-col items-center justify-center h-full mt-6">
                    <img src={emptyState.src} width={"120px"} />
                    <span className="text-20px font-medium text-brandGreen">
                      No Data
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesComponent;
