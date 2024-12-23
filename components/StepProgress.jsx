import React from "react";

const StepProgress = ({ steps, currentStep = 0, onStepClick }) => {
  return (
    <div className="w-full">
      <h2 className="sr-only">Steps</h2>
      <div className="w-full">
        <ol className="flex w-full divide-x divide-gray-100 overflow-hidden rounded-lg border border-gray-100 text-sm text-gray-500">
          {steps.map((step, index) => {
            const isActive = index === currentStep;

            return (
              <li
                key={step}
                onClick={() => onStepClick?.(index)}
                className={`relative flex flex-1 items-center justify-center gap-2 p-4 ${
                  isActive ? "bg-gray-50" : ""
                } cursor-pointer hover:bg-gray-50 transition-colors`}
              >
                {/* Arrow for active step */}
                {isActive && (
                  <>
                    <span className="absolute -left-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-b-0 ltr:border-s-0 ltr:bg-white rtl:border-e-0 rtl:border-t-0 rtl:bg-gray-50" />
                    <span className="absolute -right-2 top-1/2 hidden h-4 w-4 -translate-y-1/2 rotate-45 border border-gray-100 sm:block ltr:border-b-0 ltr:border-s-0 ltr:bg-gray-50 rtl:border-e-0 rtl:border-t-0 rtl:bg-white" />
                  </>
                )}

                {/* Number Circle */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${
                    isActive
                      ? "border-blue-500 bg-blue-500 text-white"
                      : index < currentStep
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>

                {/* Step Text */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{step}</p>
                  <p className="truncate text-xs">
                    {index < currentStep
                      ? "Completed"
                      : index === currentStep
                      ? "In Progress"
                      : "Pending"}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

export default StepProgress;
