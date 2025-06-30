import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  User,
} from "lucide-react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";

export const ProgramStep = ({ formData, onFormDataChange }) => {
  const [showAddDay, setShowAddDay] = useState(false);
  const [showAddItem, setShowAddItem] = useState(null);
  const [showAddSpeaker, setShowAddSpeaker] = useState(false);
  const [newProgramItem, setNewProgramItem] = useState({
    start_time: "",
    end_time: "",
    title: "",
    description: "",
    location: "",
    speakers: [],
  });
  const [newSpeaker, setNewSpeaker] = useState({
    name: "",
    title: "",
    bio: "",
    company: "",
    image: "",
  });

  const program = formData.program || {
    enabled: false,
    is_public: true,
    schedule: [],
    speakers: [],
  };

  const getEventDates = () => {
    const dates = [];
    if (formData.date) {
      dates.push(formData.date);
    }
    if (formData.is_multi_day && formData.end_date) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.end_date);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return [...new Set(dates)];
  };

  const availableDates = getEventDates();

  const handleProgramToggle = (enabled) => {
    onFormDataChange("program", {
      ...program,
      enabled,
    });
  };

  const handleAddDay = (date) => {
    const newDay = {
      id: `program_day_${Date.now()}`,
      date,
      items: [],
    };

    const updatedProgram = {
      ...program,
      schedule: [...program.schedule, newDay],
    };

    onFormDataChange("program", updatedProgram);
    setShowAddDay(false);
  };

  const handleAddProgramItem = (dayId) => {
    if (!newProgramItem.title.trim() || !newProgramItem.start_time) {
      alert("Please fill in required fields: title and start time");
      return;
    }

    const itemToAdd = {
      id: `item_${Date.now()}`,
      ...newProgramItem,
    };

    const updatedSchedule = program.schedule.map((day) =>
      day.id === dayId ? { ...day, items: [...day.items, itemToAdd] } : day
    );

    const updatedProgram = {
      ...program,
      schedule: updatedSchedule,
    };

    onFormDataChange("program", updatedProgram);
    setNewProgramItem({
      start_time: "",
      end_time: "",
      title: "",
      description: "",
      location: "",
      speakers: [],
    });
    setShowAddItem(null);
  };

  const handleRemoveProgramItem = (dayId, itemId) => {
    const updatedSchedule = program.schedule.map((day) =>
      day.id === dayId
        ? { ...day, items: day.items.filter((item) => item.id !== itemId) }
        : day
    );

    const updatedProgram = {
      ...program,
      schedule: updatedSchedule,
    };

    onFormDataChange("program", updatedProgram);
  };

  const handleAddSpeaker = () => {
    if (!newSpeaker.name.trim()) {
      alert("Please enter speaker name");
      return;
    }

    const speakerToAdd = {
      id: `speaker_${Date.now()}`,
      ...newSpeaker,
    };

    const updatedProgram = {
      ...program,
      speakers: [...program.speakers, speakerToAdd],
    };

    onFormDataChange("program", updatedProgram);
    setNewSpeaker({
      name: "",
      title: "",
      bio: "",
      company: "",
      image: "",
    });
    setShowAddSpeaker(false);
  };

  const handleRemoveSpeaker = (speakerId) => {
    const updatedProgram = {
      ...program,
      speakers: program.speakers.filter((speaker) => speaker.id !== speakerId),
    };

    onFormDataChange("program", updatedProgram);
  };

  const getSpeakerName = (speakerId) => {
    const speaker = program.speakers.find((s) => s.id === speakerId);
    return speaker ? speaker.name : "Unknown Speaker";
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Program & Agenda</h2>
        <p className="text-gray-600">
          Create a detailed schedule for your event including sessions,
          speakers, and activities. This helps guests plan their time and
          understand what to expect.
        </p>
      </div>

      {/* Enable Program Toggle */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="enable_program"
            checked={program.enabled || false}
            onChange={(e) => handleProgramToggle(e.target.checked)}
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label htmlFor="enable_program" className="font-medium text-gray-700">
            Enable event program and agenda
          </label>
        </div>

        {program.enabled && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={program.is_public}
                onChange={(e) =>
                  onFormDataChange("program", {
                    ...program,
                    is_public: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Make program visible to guests on the public event page
              </label>
            </div>
          </div>
        )}
      </div>

      {program.enabled && (
        <>
          {/* Speakers Management */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Speakers & Presenters</h3>
              <CustomButton
                buttonText="Add Speaker"
                onClick={() => setShowAddSpeaker(true)}
                prefixIcon={<Plus className="h-4 w-4" />}
                buttonColor="bg-green-600"
                radius="rounded-md"
                className="text-sm"
              />
            </div>

            {/* Speakers List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {program.speakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="border rounded-lg p-4 bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        {speaker.image ? (
                          <img
                            src={speaker.image}
                            alt={speaker.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{speaker.name}</h4>
                        {speaker.title && (
                          <p className="text-sm text-gray-600">
                            {speaker.title}
                          </p>
                        )}
                        {speaker.company && (
                          <p className="text-xs text-gray-500">
                            {speaker.company}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveSpeaker(speaker.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {speaker.bio && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {speaker.bio}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Add Speaker Form */}
            {showAddSpeaker && (
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50 mb-4">
                <h4 className="font-medium mb-3">Add New Speaker</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputWithFullBoarder
                    label="Speaker Name *"
                    value={newSpeaker.name}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, name: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Title/Position"
                    value={newSpeaker.title}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <InputWithFullBoarder
                    label="Company/Organization"
                    value={newSpeaker.company}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, company: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Photo URL"
                    value={newSpeaker.image}
                    onChange={(e) =>
                      setNewSpeaker({ ...newSpeaker, image: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>
                <InputWithFullBoarder
                  label="Bio"
                  isTextArea={true}
                  rows={3}
                  value={newSpeaker.bio}
                  onChange={(e) =>
                    setNewSpeaker({ ...newSpeaker, bio: e.target.value })
                  }
                />
                <div className="flex gap-2 mt-4">
                  <CustomButton
                    buttonText="Add Speaker"
                    onClick={handleAddSpeaker}
                    buttonColor="bg-green-600"
                    radius="rounded-md"
                    className="text-sm"
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => setShowAddSpeaker(false)}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    className="text-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Program Schedule */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Program Schedule</h3>
              {availableDates.length > program.schedule.length && (
                <CustomButton
                  buttonText="Add Day"
                  onClick={() => setShowAddDay(true)}
                  prefixIcon={<Plus className="h-4 w-4" />}
                  buttonColor="bg-purple-600"
                  radius="rounded-md"
                  className="text-sm"
                />
              )}
            </div>

            {/* Add Day Selection */}
            {showAddDay && (
              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50 mb-4">
                <h4 className="font-medium mb-3">Select Date for Program</h4>
                <div className="flex flex-wrap gap-2">
                  {availableDates
                    .filter(
                      (date) =>
                        !program.schedule.find((day) => day.date === date)
                    )
                    .map((date) => (
                      <button
                        key={date}
                        onClick={() => handleAddDay(date)}
                        className="px-3 py-2 bg-white border border-purple-300 rounded-md hover:bg-purple-100 text-sm"
                      >
                        {new Date(date).toLocaleDateString()}
                      </button>
                    ))}
                </div>
                <CustomButton
                  buttonText="Cancel"
                  onClick={() => setShowAddDay(false)}
                  buttonColor="bg-gray-300"
                  textColor="text-gray-700"
                  radius="rounded-md"
                  className="text-sm mt-3"
                />
              </div>
            )}

            {/* Schedule Days */}
            <div className="space-y-6">
              {program.schedule.map((day) => (
                <div key={day.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      {new Date(day.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h4>
                    <CustomButton
                      buttonText="Add Item"
                      onClick={() => setShowAddItem(day.id)}
                      prefixIcon={<Plus className="h-4 w-4" />}
                      buttonColor="bg-purple-600"
                      radius="rounded-md"
                      className="text-sm"
                    />
                  </div>

                  {/* Program Items */}
                  <div className="space-y-3">
                    {day.items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">
                                {item.start_time}{" "}
                                {item.end_time && `- ${item.end_time}`}
                              </span>
                            </div>
                            <h5 className="font-medium mb-1">{item.title}</h5>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-1">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {item.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.location}
                                </div>
                              )}
                              {item.speakers.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {item.speakers.map(getSpeakerName).join(", ")}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleRemoveProgramItem(day.id, item.id)
                            }
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Item Form */}
                  {showAddItem === day.id && (
                    <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50 mt-4">
                      <h5 className="font-medium mb-3">Add Program Item</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputWithFullBoarder
                          label="Start Time *"
                          type="time"
                          value={newProgramItem.start_time}
                          onChange={(e) =>
                            setNewProgramItem({
                              ...newProgramItem,
                              start_time: e.target.value,
                            })
                          }
                        />
                        <InputWithFullBoarder
                          label="End Time"
                          type="time"
                          value={newProgramItem.end_time}
                          onChange={(e) =>
                            setNewProgramItem({
                              ...newProgramItem,
                              end_time: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputWithFullBoarder
                          label="Title *"
                          value={newProgramItem.title}
                          onChange={(e) =>
                            setNewProgramItem({
                              ...newProgramItem,
                              title: e.target.value,
                            })
                          }
                        />
                        <InputWithFullBoarder
                          label="Location"
                          value={newProgramItem.location}
                          onChange={(e) =>
                            setNewProgramItem({
                              ...newProgramItem,
                              location: e.target.value,
                            })
                          }
                        />
                      </div>
                      <InputWithFullBoarder
                        label="Description"
                        isTextArea={true}
                        rows={2}
                        value={newProgramItem.description}
                        onChange={(e) =>
                          setNewProgramItem({
                            ...newProgramItem,
                            description: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2 mt-4">
                        <CustomButton
                          buttonText="Add Item"
                          onClick={() => handleAddProgramItem(day.id)}
                          buttonColor="bg-purple-600"
                          radius="rounded-md"
                          className="text-sm"
                        />
                        <CustomButton
                          buttonText="Cancel"
                          onClick={() => setShowAddItem(null)}
                          buttonColor="bg-gray-300"
                          textColor="text-gray-700"
                          radius="rounded-md"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!program.enabled && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            Program and agenda are disabled. Enable them to create a detailed
            schedule for your event.
          </p>
        </div>
      )}
    </div>
  );
};
