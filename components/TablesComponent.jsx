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

  const toggleSelectAll = () => {
    const isAllSelected = selectedRows.length === data.length;
    if (typeof toggleSelectAllFunction === "function") {
      toggleSelectAllFunction(!isAllSelected);
    }
    if (typeof setSelectedRows === "function") {
      setSelectedRows(isAllSelected ? [] : data.map((_, index) => index));
    }
  };

  const toggleRow = (index, val) => {
    if (typeof toggleRowFunction === "function") {
      toggleRowFunction(index, val);
    }
    if (typeof setSelectedRows === "function") {
      setSelectedRows(
        selectedRows.includes(index)
          ? selectedRows.filter((i) => i !== index)
          : [...selectedRows, index]
      );
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <img src={emptyState.src} className="w-32" alt="No data" />
        <span className="text-lg font-medium text-brandGreen mt-4">
          No Data
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop View */}
      <div className="hidden lg:flex flex-col flex-1 min-h-0">
        <div className="bg-[#F0F2F5]">
          <table className="w-full">
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={i}
                    className="py-3.5 px-4 text-left font-medium text-black text-sm"
                  >
                    <div className="flex gap-3 items-center">
                      {i === 0 && showCheckBox && (
                        <CustomCheckBox
                          checked={
                            data.length > 0 &&
                            selectedRows.length === data.length
                          }
                          onChange={toggleSelectAll}
                          indeterminate={
                            selectedRows.length > 0 &&
                            selectedRows.length < data.length
                          }
                        />
                      )}
                      {header}
                    </div>
                  </th>
                ))}
                {!hideActionButton && <th className="py-3.5 px-4"></th>}
              </tr>
            </thead>
          </table>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <tbody>
              {data.map((eachRow, index) => {
                const formatedValue = getFormattedValue(eachRow, index);
                return (
                  <tr
                    key={index}
                    className={`${index % 2 ? "bg-white" : "bg-[#fafafa]"}`}
                  >
                    {formatedValue.map((item, i) => (
                      <td
                        key={i}
                        className="px-4 py-5 text-sm text-gray-900 whitespace-nowrap"
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
                    {!hideActionButton && (
                      <td className="whitespace-nowrap px-4">
                        <ActionButtons
                          eachRow={eachRow}
                          index={index}
                          currentIndex={currentIndex}
                          showOptions={showOptions}
                          options={options}
                          setSelected={setSelected}
                          setShowOptions={setShowOptions}
                          setCurrentIndex={setCurrentIndex}
                          buttonFunction={buttonFunction}
                          popUpFunction={popUpFunction}
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex-1 flex flex-col min-h-0">
        <div className="bg-[#F0F2F5] px-4 py-3 flex items-center gap-3">
          {showCheckBox && (
            <>
              <CustomCheckBox
                checked={data.length > 0 && selectedRows.length === data.length}
                onChange={toggleSelectAll}
                indeterminate={
                  selectedRows.length > 0 && selectedRows.length < data.length
                }
              />
              <span className="font-medium text-sm">Select All</span>
            </>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          <div className="divide-y">
            {data.map((eachRow, index) => {
              const formatedValue = getFormattedValue(eachRow, index);
              return (
                <div
                  key={index}
                  className={`p-4 ${index % 2 ? "bg-white" : "bg-[#fafafa]"}`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      {showCheckBox && (
                        <div className="pt-1">
                          <CustomCheckBox
                            onChange={() => toggleRow(index, eachRow)}
                            checked={selectedRows.includes(index)}
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-wrap gap-4">
                          {formatedValue.map((item, i) => (
                            <div key={i} className="text-sm text-gray-900">
                              {renderData(item)}
                            </div>
                          ))}
                        </div>
                        {!hideActionButton && options.length === 0 && (
                          <div className="w-full">
                            <ActionButtons
                              eachRow={eachRow}
                              index={index}
                              currentIndex={currentIndex}
                              showOptions={showOptions}
                              options={options}
                              setSelected={setSelected}
                              setShowOptions={setShowOptions}
                              setCurrentIndex={setCurrentIndex}
                              buttonFunction={buttonFunction}
                              popUpFunction={popUpFunction}
                            />
                          </div>
                        )}
                      </div>
                      {!hideActionButton && options.length > 0 && (
                        <div className="flex-shrink-0">
                          <ActionButtons
                            eachRow={eachRow}
                            index={index}
                            currentIndex={currentIndex}
                            showOptions={showOptions}
                            options={options}
                            setSelected={setSelected}
                            setShowOptions={setShowOptions}
                            setCurrentIndex={setCurrentIndex}
                            buttonFunction={buttonFunction}
                            popUpFunction={popUpFunction}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButtons = ({
  eachRow,
  index,
  currentIndex,
  showOptions,
  options,
  setSelected,
  setShowOptions,
  setCurrentIndex,
  buttonFunction,
  popUpFunction,
}) => (
  <div className="flex items-center space-x-4">
    <div
      className={options.length === 0 ? "w-full" : ""}
      onClick={() => {
        setSelected(eachRow);
        if (options.length > 0) {
          setShowOptions(index === currentIndex ? !showOptions : true);
        } else {
          buttonFunction?.(eachRow);
        }
        setCurrentIndex(index);
      }}
    >
      {options.length > 0 ? (
        <img src={moreMore.src} alt="More options" className="cursor-pointer" />
      ) : (
        <CustomButton
          buttonText="View"
          radius="rounded-full"
          className="w-full p-1"
        />
      )}
    </div>
    <div className="relative">
      {currentIndex === index && showOptions && (
        <OptionsPopup
          options={options}
          popUpFunction={(option, inx) => {
            setShowOptions(false);
            popUpFunction(option, inx, eachRow);
          }}
        />
      )}
    </div>
  </div>
);

export default TablesComponent;
