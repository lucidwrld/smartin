// EventDetailsStep.js
import React, { useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";

export const EventDetailsStep = ({ formData, onFormDataChange }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFormDataChange("eventImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full text-brandBlack">
      {/* Left side - Image Upload */}
      <div className="w-full md:w-1/2">
        <div className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          {imagePreview ? (
            <div className="relative w-full h-full">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  handleInputChange("eventImage", null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Right side - Event Details Form */}
      <div className="w-full md:w-1/2 space-y-4">
        <InputWithFullBoarder
          label="Event Title"
          id="eventTitle"
          isRequired={true}
          value={formData.eventTitle}
          onChange={(e) => handleInputChange("eventTitle", e.target.value)}
        />

        <InputWithFullBoarder
          label="Description"
          id="description"
          isRequired={true}
          value={formData.description}
          className={"h-40"}
          isTextArea={true}
          rows={4}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />

        <div className="flex gap-4">
          <div className="w-1/2">
            <InputWithFullBoarder
              label="Date"
              id="date"
              type="date"
              isRequired={true}
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <InputWithFullBoarder
              label="Time"
              id="time"
              type="time"
              isRequired={true}
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
            />
          </div>
        </div>

        <InputWithFullBoarder
          label="Venue Address"
          id="venue"
          isRequired={true}
          value={formData.venue}
          onChange={(e) => handleInputChange("venue", e.target.value)}
        />

        <div className="flex gap-4">
          <div className="w-1/2">
            <InputWithFullBoarder
              label="Event Type"
              id="eventType"
              isRequired={true}
              type="select"
              value={formData.eventType}
              options={[
                { value: "private", label: "Private" },
                { value: "public", label: "Public" },
              ]}
              onChange={(e) => handleInputChange("eventType", e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <InputWithFullBoarder
              label="Expected Guests"
              id="expectedGuests"
              type="number"
              isRequired={true}
              value={formData.expectedGuests}
              onChange={(e) =>
                handleInputChange("expectedGuests", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
