import React, { useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import {
  Plus,
  FileText,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  CalendarX,
} from "lucide-react";

export const RegistrationFormsStep = ({ formData, onFormDataChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [showAddField, setShowAddField] = useState(null);

  const [newForm, setNewForm] = useState({
    name: "",
    description: "",
    is_required: true,
  });

  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    validation: {},
  });

  const registrationForms = formData.registration_forms || [];
  const today = new Date().toISOString().split("T")[0];

  // Field type options
  const fieldTypes = [
    { value: "text", label: "Text Input", description: "Single line text" },
    {
      value: "textarea",
      label: "Text Area",
      description: "Multiple line text",
    },
    { value: "email", label: "Email", description: "Email address validation" },
    { value: "phone", label: "Phone", description: "Phone number input" },
    { value: "number", label: "Number", description: "Numeric input" },
    { value: "date", label: "Date", description: "Date picker" },
    { value: "select", label: "Dropdown", description: "Select from options" },
    {
      value: "radio",
      label: "Radio Buttons",
      description: "Single choice from options",
    },
    { value: "checkbox", label: "Checkboxes", description: "Multiple choices" },
    {
      value: "file",
      label: "File Upload",
      description: "Upload documents/images",
    },
  ];

  const handleAddForm = () => {
    if (!newForm.name.trim()) {
      alert("Please enter a form name");
      return;
    }

    const formToAdd = {
      id: `form_${Date.now()}`,
      ...newForm,
      fields: [],
    };

    const updatedForms = [...registrationForms, formToAdd];
    onFormDataChange("registration_forms", updatedForms);

    setNewForm({ name: "", description: "", is_required: true });
    setShowAddForm(false);
  };

  const handleRemoveForm = (formId) => {
    const updatedForms = registrationForms.filter((form) => form.id !== formId);
    onFormDataChange("registration_forms", updatedForms);
  };

  const handleFormChange = (formId, field, value) => {
    const updatedForms = registrationForms.map((form) =>
      form.id === formId ? { ...form, [field]: value } : form
    );
    onFormDataChange("registration_forms", updatedForms);
  };

  const handleAddField = (formId) => {
    if (!newField.label.trim()) {
      alert("Please enter a field label");
      return;
    }

    const fieldToAdd = {
      id: `field_${Date.now()}`,
      ...newField,
      options:
        newField.type === "select" ||
        newField.type === "radio" ||
        newField.type === "checkbox"
          ? newField.options
          : [],
    };

    const updatedForms = registrationForms.map((form) =>
      form.id === formId
        ? { ...form, fields: [...(form.fields || []), fieldToAdd] }
        : form
    );

    onFormDataChange("registration_forms", updatedForms);
    setNewField({
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [],
      validation: {},
    });
    setShowAddField(null);
  };

  const handleRemoveField = (formId, fieldId) => {
    const updatedForms = registrationForms.map((form) =>
      form.id === formId
        ? {
            ...form,
            fields: form.fields.filter((field) => field.id !== fieldId),
          }
        : form
    );
    onFormDataChange("registration_forms", updatedForms);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newField.options];
    updatedOptions[index] = value;
    setNewField({ ...newField, options: updatedOptions });
  };

  const addOption = () => {
    setNewField({ ...newField, options: [...newField.options, ""] });
  };

  const removeOption = (index) => {
    const updatedOptions = newField.options.filter((_, i) => i !== index);
    setNewField({ ...newField, options: updatedOptions });
  };

  const needsOptions = ["select", "radio", "checkbox"].includes(newField.type);

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Registration Forms</h2>
        <p className="text-gray-600">
          Create custom forms for guests to fill out when they accept
          invitations or purchase tickets. This helps you collect additional
          information needed for your event.
        </p>
      </div>

      {/* Registration Settings */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="enable_registration"
            checked={formData.enable_registration || false}
            onChange={(e) =>
              onFormDataChange("enable_registration", e.target.checked)
            }
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label
            htmlFor="enable_registration"
            className="font-medium text-gray-700"
          >
            Enable custom registration forms
          </label>
        </div>

        {formData.enable_registration && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithFullBoarder
              label="Registration Start Date"
              type="date"
              value={formData.registration_start_date || ""}
              onChange={(e) =>
                onFormDataChange("registration_start_date", e.target.value)
              }
              min={today}
            />
            <InputWithFullBoarder
              label="Registration End Date"
              type="date"
              value={formData.registration_end_date || ""}
              onChange={(e) =>
                onFormDataChange("registration_end_date", e.target.value)
              }
              min={formData.registration_start_date || today}
            />
          </div>
        )}
      </div>

      {formData.enable_registration && (
        <>
          {/* Existing Forms */}
          <div className="space-y-6 mb-6">
            {registrationForms.map((form, index) => (
              <div key={form.id} className="border rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-lg">{form.name}</h3>
                      {form.is_required && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    {form.description && (
                      <p className="text-sm text-gray-600">
                        {form.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {form.fields?.length || 0} field(s)
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingForm(editingForm === form.id ? null : form.id)
                      }
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveForm(form.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Form Fields Display */}
                {form.fields && form.fields.length > 0 && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3">Form Fields:</h4>
                    <div className="space-y-2">
                      {form.fields.map((field, fieldIndex) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between p-2 bg-white rounded border"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              {field.label}
                            </span>
                            <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {field.type}
                            </span>
                            {field.required && (
                              <span className="text-xs text-red-600">
                                Required
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveField(form.id, field.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Edit Form Properties */}
                {editingForm === form.id && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Form Name"
                        value={form.name}
                        onChange={(e) =>
                          handleFormChange(form.id, "name", e.target.value)
                        }
                      />
                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          checked={form.is_required}
                          onChange={(e) =>
                            handleFormChange(
                              form.id,
                              "is_required",
                              e.target.checked
                            )
                          }
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">
                          Required form
                        </label>
                      </div>
                    </div>
                    <InputWithFullBoarder
                      label="Description"
                      isTextArea={true}
                      rows={2}
                      value={form.description}
                      onChange={(e) =>
                        handleFormChange(form.id, "description", e.target.value)
                      }
                    />
                  </div>
                )}

                {/* Add Field to This Form */}
                {showAddField !== form.id && (
                  <button
                    onClick={() => setShowAddField(form.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors w-full"
                  >
                    <Plus className="h-4 w-4" />
                    Add Field to This Form
                  </button>
                )}

                {/* Add Field Form */}
                {showAddField === form.id && (
                  <div className="border-t pt-4 mt-4 p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium mb-4">Add New Field</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Field Type
                        </label>
                        <select
                          value={newField.type}
                          onChange={(e) =>
                            setNewField({
                              ...newField,
                              type: e.target.value,
                              options: [],
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          {
                            fieldTypes.find((t) => t.value === newField.type)
                              ?.description
                          }
                        </p>
                      </div>

                      <InputWithFullBoarder
                        label="Field Label *"
                        value={newField.label}
                        onChange={(e) =>
                          setNewField({ ...newField, label: e.target.value })
                        }
                        placeholder="e.g., Dietary Requirements"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <InputWithFullBoarder
                        label="Placeholder Text"
                        value={newField.placeholder}
                        onChange={(e) =>
                          setNewField({
                            ...newField,
                            placeholder: e.target.value,
                          })
                        }
                        placeholder="Optional placeholder text"
                      />

                      <div className="flex items-center gap-2 pt-6">
                        <input
                          type="checkbox"
                          checked={newField.required}
                          onChange={(e) =>
                            setNewField({
                              ...newField,
                              required: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label className="text-sm text-gray-700">
                          Required field
                        </label>
                      </div>
                    </div>

                    {/* Options for select, radio, checkbox fields */}
                    {needsOptions && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        <div className="space-y-2">
                          {newField.options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  handleOptionChange(index, e.target.value)
                                }
                                placeholder={`Option ${index + 1}`}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                              />
                              <button
                                onClick={() => removeOption(index)}
                                className="text-red-500 hover:text-red-700 px-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={addOption}
                            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                          >
                            <Plus className="h-3 w-3" />
                            Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddField(form.id)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        Add Field
                      </button>
                      <button
                        onClick={() => setShowAddField(null)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Form Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Registration Form
            </button>
          )}

          {/* Add Form Dialog */}
          {showAddForm && (
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h3 className="font-medium text-lg mb-4">
                Add New Registration Form
              </h3>

              <div className="space-y-4 mb-6">
                <InputWithFullBoarder
                  label="Form Name *"
                  value={newForm.name}
                  onChange={(e) =>
                    setNewForm({ ...newForm, name: e.target.value })
                  }
                  placeholder="e.g., General Registration"
                />

                <InputWithFullBoarder
                  label="Description"
                  isTextArea={true}
                  rows={3}
                  value={newForm.description}
                  onChange={(e) =>
                    setNewForm({ ...newForm, description: e.target.value })
                  }
                  placeholder="Brief description of what this form is for"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newForm.is_required}
                    onChange={(e) =>
                      setNewForm({ ...newForm, is_required: e.target.checked })
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Required form (guests must complete this)
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddForm}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Create Form
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {registrationForms.length === 0 && !showAddForm && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No registration forms created yet. Click "Add Registration Form"
                to get started.
              </p>
            </div>
          )}
        </>
      )}

      {!formData.enable_registration && (
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            Custom registration forms are disabled. Guests will only provide
            basic RSVP information.
          </p>
        </div>
      )}
    </div>
  );
};
