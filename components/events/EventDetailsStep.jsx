import React, { useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import Dropdown from "../Dropdown";
import { timezones } from "../../utils/timezones";

export const EventDetailsStep = ({
  formData,
  uiState,
  onFormDataChange,
  isEditMode,
}) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const today = new Date().toISOString().split("T")[0]; 
  const imagePreviewer = (file) => { 
      return URL.createObjectURL(file)
  }
  const handleImageUpload = (e, type = "image") => {
    const file = e.target.files[0];
    if (file) {
      // Use the centralized form handler
      onFormDataChange(type, file);
      
      // Handle preview generation
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "logo") {
          setLogoPreview(reader.result);
        } else if (type === "banner_image") {
          setBannerPreview(reader.result);
        } else {
          setImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    onFormDataChange(field, value);
  };

  const formattedDate = uiState.date
    ? new Date(uiState.date).toISOString().split("T")[0]
    : "";
  const formattedTime = uiState.time ? uiState.time.substring(0, 5) : "";

  // Helper function to format date display (handles event_days array)
  const formatDateDisplay = (date, endDate, eventDays) => {
    // If event_days array exists, use that for date display
    if (eventDays && Array.isArray(eventDays) && eventDays.length > 0) {
      const validDays = eventDays.filter((day) => day.date);

      if (validDays.length === 0) return "Not set";

      if (validDays.length === 1) {
        const startDate = new Date(validDays[0].date);
        return startDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      // Multiple days - show range
      const startDate = new Date(validDays[0].date);
      const endDate = new Date(validDays[validDays.length - 1].date);

      const formattedStart = startDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedEnd = endDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return validDays.length > 2
        ? `${formattedStart} - ${formattedEnd} (${validDays.length} days)`
        : `${formattedStart} - ${formattedEnd}`;
    }

    // Fallback to single date/endDate
    if (!date) return "Not set";

    const startDate = new Date(date);
    const formattedStart = startDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    if (endDate && endDate !== date) {
      const endDateObj = new Date(endDate);
      const formattedEnd = endDateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return `${formattedStart} - ${formattedEnd}`;
    }

    return formattedStart;
  };

  // Helper function to format time display (handles event_days array)
  const formatTimeDisplay = (time, endTime, eventDays) => {
    // If event_days array exists, use that for time display
    if (eventDays && Array.isArray(eventDays) && eventDays.length > 0) {
      const validDays = eventDays.filter((day) => day.time);

      if (validDays.length === 0) return "Not set";

      const formatTime = (timeStr) => {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      if (validDays.length === 1) {
        return formatTime(validDays[0].time);
      }

      // Multiple days - show time range if different, or single time if same
      const times = [...new Set(validDays.map((day) => day.time))];
      if (times.length === 1) {
        return formatTime(times[0]);
      }

      // Different times - show range
      const startTime = formatTime(validDays[0].time);
      const endTime = formatTime(validDays[validDays.length - 1].time);
      return `${startTime} - ${endTime}`;
    }

    // Fallback to single time/endTime
    if (!time) return "Not set";

    const formatTime = (timeStr) => {
      const [hours, minutes] = timeStr.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const formattedStart = formatTime(time);

    if (endTime && endTime !== time) {
      const formattedEnd = formatTime(endTime);
      return `${formattedStart} - ${formattedEnd}`;
    }

    return formattedStart;
  };  
  return (
    <div className="flex flex-col w-full text-brandBlack">
      <p className="text-16px leading-[28px] mb-5 text-textGrey2">
        Kindly provide the details for your event
      </p>

      <div className="w-full flex flex-col md:flex-row gap-8 bg-whiteColor p-3 md:p-10">
        {/* EXISTING IMAGE UPLOAD SECTION - UNCHANGED */}
        <div className="w-full md:w-1/2">
          <p className="text-14px leading-[22px] mb-1">Upload main image</p>
          <div
            className="flex flex-col items-center justify-center w-full h-96 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => document.getElementById("imageInput").click()}
          >
            {imagePreview || formData.image ? (
              <div className="relative w-full h-full group">
                <img
                  src={imagePreview || (formData.image instanceof File ? imagePreviewer(formData.image) : formData.image)}
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
              onChange={(e) => handleImageUpload(e, "image")}
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-4">
          {/* EXISTING FORM FIELDS - UNCHANGED */}
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
                value={formattedDate || uiState.date}
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
                value={formattedTime || uiState.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>

          {/* NEW: Multi-day Event Section */}
          <div className="w-full border-t pt-4 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="is_multi_day"
                checked={uiState.is_multi_day || false}
                onChange={(e) =>
                  handleInputChange("is_multi_day", e.target.checked)
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="is_multi_day"
                className="text-sm font-medium text-gray-700"
              >
                This is a multi-day event
              </label>
            </div>

            {uiState.is_multi_day && (
              <div className="grid grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="End Date"
                  id="end_date"
                  type="date"
                  value={uiState.end_date || ""}
                  onChange={(e) =>
                    handleInputChange("end_date", e.target.value)
                  }
                  min={uiState.date || today}
                />
                <InputWithFullBoarder
                  label="End Time"
                  id="end_time"
                  type="time"
                  value={uiState.end_time || ""}
                  onChange={(e) =>
                    handleInputChange("end_time", e.target.value)
                  }
                />
              </div>
            )}
          </div>

          {/* Venue/Virtual Meeting Section */}
          {formData.event_format === "virtual" ? (
            <InputWithFullBoarder
              label="Virtual Meeting Link"
              id="venue"
              isRequired={true}
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              placeholder={"Enter the meeting link (Zoom, Teams, etc.)"}
            />
          ) : formData.event_format === "hybrid" ? (
            <div className="space-y-4">
              <InputWithFullBoarder
                label="Physical Venue Address"
                id="venue"
                isRequired={true}
                value={formData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
                placeholder={"Enter the physical location of your event"}
              />
              <InputWithFullBoarder
                label="Virtual Meeting Link"
                id="virtual_link"
                isRequired={true}
                value={formData.virtual_link}
                onChange={(e) =>
                  handleInputChange("virtual_link", e.target.value)
                }
                placeholder={"Enter the meeting link for virtual attendees"}
              />
            </div>
          ) : (
            <InputWithFullBoarder
              label="Venue Address"
              id="venue"
              isRequired={true}
              value={formData.venue}
              onChange={(e) => handleInputChange("venue", e.target.value)}
              placeholder={"Enter the location of your event"}
            />
          )}

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
            <div className="w-1/2">
              <Dropdown
                label="Event Format"
                id="event_format"
                isRequired={true}
                type="select"
                value={formData.event_format}
                options={[
                  { value: "physical", label: "Physical" },
                  { value: "virtual", label: "Virtual" },
                  { value: "hybrid", label: "Hybrid" },
                ]}
                onChange={(e) => {
                  handleInputChange("event_format", e.target.value);
                  // Update isVirtual based on format
                  handleInputChange(
                    "isVirtual",
                    e.target.value === "virtual" || e.target.value === "hybrid"
                  );
                }}
                placeholder="Select event format..."
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <Dropdown
                label="Timezone"
                id="timezone"
                isRequired={true}
                type="select"
                value={formData.timezone || "Africa/Lagos"}
                options={timezones.map((tz) => ({
                  value: tz.value,
                  label: tz.label,
                }))}
                onChange={(e) => handleInputChange("timezone", e.target.value)}
                placeholder="Select timezone..."
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

          {/* NEW: Additional Media Section */}
          <div className="border-t pt-4 mt-4 space-y-4">
            <h3 className="text-lg font-medium">Additional Media (Optional)</h3>

            {/* Video URL */}
            <InputWithFullBoarder
              label="Event Video URL"
              id="video_url"
              value={formData.video || ""}
              onChange={(e) => handleInputChange("video", e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />

            {/* Logo Upload */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-14px leading-[22px] mb-1">Event Logo</p>
                <div
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => document.getElementById("logoInput").click()}
                >
                  {logoPreview || formData.logo ? (
                    <img
                      src={logoPreview || (formData.logo instanceof File ? imagePreviewer(formData.logo) : formData.logo)}
                      alt="Logo Preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-6 h-6 mx-auto mb-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Upload Logo</p>
                    </div>
                  )}
                  <input
                    id="logoInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "logo")}
                  />
                </div>
              </div>

              {/* Banner Upload */}
              <div>
                <p className="text-14px leading-[22px] mb-1">Banner Image</p>
                <div
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => document.getElementById("bannerInput").click()}
                >
                  {bannerPreview || formData.banner_image ? (
                    <img
                      src={bannerPreview || (formData.banner_image instanceof File ? imagePreviewer(formData.banner_image) : formData.banner_image)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <svg
                        className="w-6 h-6 mx-auto mb-2 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Upload Banner</p>
                    </div>
                  )}
                  <input
                    id="bannerInput"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "banner_image")}
                  />
                </div>
              </div>
            </div>

            {/* Branding Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={uiState.primary_color || "#6366f1"}
                    onChange={(e) =>
                      handleInputChange("primary_color", e.target.value)
                    }
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={uiState.primary_color || "#6366f1"}
                    onChange={(e) =>
                      handleInputChange("primary_color", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#6366f1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={uiState.secondary_color || "#8b5cf6"}
                    onChange={(e) =>
                      handleInputChange("secondary_color", e.target.value)
                    }
                    className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={uiState.secondary_color || "#8b5cf6"}
                    onChange={(e) =>
                      handleInputChange("secondary_color", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    placeholder="#8b5cf6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
