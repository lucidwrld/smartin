import React, { useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import Dropdown from "../Dropdown";

export const EventDetailsStep = ({
  formData,
  onFormDataChange,
  isEditMode,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFormDataChange("image", file);
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

  const formattedDate = formData.date
    ? new Date(formData.date).toISOString().split("T")[0]
    : "";
  const formattedTime = formData.time ? formData.time.substring(0, 5) : "";
  return (
    <div className="flex flex-col w-full text-brandBlack">
      <p className="text-16px leading-[28px] mb-5 text-textGrey2">
        Kindly provide the details for your event
      </p>
      <div className="w-full flex flex-col md:flex-row gap-8 bg-whiteColor p-10">
        <div className="w-full md:w-1/2">
          <p className="text-14px leading-[22px] mb-1">Upload image</p>
          <div
            className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => document.getElementById("imageInput").click()}
          >
            {imagePreview || formData.image ? (
              <div className="relative w-full h-full group">
                <img
                  src={imagePreview || formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {formData.image && !imagePreview && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="text-white">Click to replace image</p>
                  </div>
                )}
                {imagePreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      handleInputChange("image", null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : (
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
            )}
            <input
              id="imageInput"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          <InputWithFullBoarder
            label="Event Title"
            id="name"
            isRequired={true}
            placeholder={"Event name"}
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />

          <InputWithFullBoarder
            label="Description"
            id="description"
            isRequired={true}
            value={formData.description}
            placeholder={"Write your description"}
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
                value={formattedDate || formData.date}
                placeholder={"Select the date"}
                onChange={(e) => handleInputChange("date", e.target.value)}
                min={today}
              />
            </div>
            <div className="w-1/2">
              <InputWithFullBoarder
                label="Time"
                id="time"
                type="time"
                placeholder={"Select the time"}
                isRequired={true}
                value={formattedTime || formData.time}
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
            placeholder={"Enter the location of your event"}
          />

          <div className="flex gap-4">
            <div className="w-1/2">
              <Dropdown
                label="Event Type"
                id="event_type"
                isRequired={true}
                type="select"
                value={formData.event_type}
                options={[
                  { value: "private", label: "Private" },
                  { value: "public", label: "Public" },
                ]}
                onChange={(e) =>
                  handleInputChange("event_type", e.target.value)
                }
                placeholder="Select an option..."
              />
            </div>
            {!isEditMode && (
              <div className="w-1/2">
                <InputWithFullBoarder
                  label="Expected Guests"
                  placeholder={"eg. 200"}
                  id="no_of_invitees"
                  type="number"
                  isRequired={true}
                  value={Number(formData.no_of_invitees)}
                  onChange={(e) =>
                    handleInputChange("no_of_invitees", e.target.value)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
