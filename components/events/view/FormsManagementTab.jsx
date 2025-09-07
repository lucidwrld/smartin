"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  Eye,
  EyeOff,
  Save,
  X,
  Settings,
  Share2,
  BarChart3,
  Users,
  CheckCircle,
  Calendar,
  Download,
  Search,
  ArrowLeft,
  Send,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import useGetEventFormsManager from "@/app/events/controllers/forms/getEventFormsController";
import useCreateFormManager from "@/app/events/controllers/forms/createFormController";
import useUpdateFormManager from "@/app/events/controllers/forms/updateFormController";
import useUpdateFormFieldsManager from "@/app/events/controllers/forms/updateFormFieldsController";
import useDeleteFormManager from "@/app/events/controllers/forms/deleteFormController";
import useGetFormSubmissionsManager from "@/app/events/controllers/forms/getFormSubmissionsController";
import useDebounce from "@/utils/UseDebounce";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import GetPublicFormManager from "@/app/events/controllers/forms/getPublicFormController";

const FormSubmissionsView = ({ forms, event }) => {
  const form = forms[0]; // Use the first (and only) form passed in
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Debounce search term with 1 second delay
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  // API hook for submissions with search
  const { data: submissionsData, isLoading: submissionsLoading } =
    useGetFormSubmissionsManager({
      eventId: event?.id,
      formId: form?.id,
      search: debouncedSearchTerm,
      enabled: !!form?.id && !!event?.id,
    });

  // Use submissions directly from API (already filtered by backend)
  const filteredSubmissions = submissionsData?.data || [];

  const viewSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const exportSubmissions = () => {
    if (!form || !(submissionsData?.data || []).length) return;

    // Create CSV data
    const headers = [
      "Guest Name",
      "Email",
      "Submitted At",
      ...form.form_fields.map((f) => f.label),
    ];
    const rows = (submissionsData?.data || []).map((sub) => [
      sub.name,
      sub.email,
      new Date(sub.createdAt).toLocaleString(),
      ...form.form_fields.map((field) => {
        const response = sub.responses.find(r => r.label === field.label);
        return response?.response || "";
      }),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${form.name}_submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Submissions List */}
      {form ? (
        <div className="bg-white rounded-lg border">
          {submissionsLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
              <span className="ml-2">Loading submissions...</span>
            </div>
          ) : (
            <>
              <div className="p-4 border-b">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {form.name} Submissions
                    </h3>
                    <p className="text-gray-600">
                      {filteredSubmissions.length} submissions{" "}
                      {submissionsData?.pagination?.total && `(${submissionsData.pagination.total} total)`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                      <Search className="w-4 h-4 absolute left-2 top-3 text-gray-400" />
                    </div>
                    <CustomButton
                      buttonText="Export CSV"
                      prefixIcon={<Download className="w-4 h-4" />}
                      buttonColor="bg-green-600"
                      radius="rounded-md"
                      onClick={exportSubmissions}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-medium text-gray-700">
                        Guest
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">
                        Email
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">
                        Submitted
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">
                        Responses
                      </th>
                      <th className="text-left p-3 font-medium text-gray-700">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((submission) => (
                      <tr
                        key={submission.id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{submission.name}</td>
                        <td className="p-3 text-gray-600">
                          {submission.email}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(
                            submission.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-purple-600">
                            {submission.responses.length} responses
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => viewSubmissionDetails(submission)}
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No form selected</p>
        </div>
      )}

      {/* Submission Details Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Submission Details - {selectedSubmission.name}
                </h3>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                  <div>
                    <span className="text-sm text-gray-600">Guest Name:</span>
                    <p className="font-medium">
                      {selectedSubmission.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">
                      {selectedSubmission.email}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <p className="font-medium">
                      {new Date(
                        selectedSubmission.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Form:</span>
                    <p className="font-medium">{form.name}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Responses:</h4>
                  <div className="space-y-3">
                    {selectedSubmission.responses.map((response, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">
                            {response.label}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {response.type}
                          </span>
                        </div>
                        <div className="text-gray-700">
                          {response.response || "No response"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FormsManagementTab = ({ event, refetch }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [activeFormId, setActiveFormId] = useState(null);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [activeTab, setActiveTab] = useState("forms");
  const [selectedId, setSelectedId] = useState(null)
  const [selectedFieldId, setSelectedFieldId] = useState(null)
  const [show, setShow] = useState(0)
  // API hooks
  const {
    data: formsData,
    isLoading: formsLoading,
    error: formsError,
    refetch: recall
  } = useGetEventFormsManager({
    eventId: event?.id,
    enabled: !!event?.id,
  });

  const { createForm, data, isLoading, isSuccess } = useCreateFormManager();
  const {
      data: formResponse,
      isLoading: loadingForm,
      error: formError,
    } = GetPublicFormManager({
      selectedId,
      enabled: Boolean(selectedId),
    });
  const {
    updateForm,
    data: updateFormData,
    isLoading: updateFormLoading,
    isSuccess: updateFormSuccess,
    error: updateFormError,
  } = useUpdateFormManager(activeFormId);
  const {
    updateFormFields,
    data: updateData,
    isLoading: updateLoading,
    isSuccess: updateSuccess,
    error: updateError,
  } = useUpdateFormFieldsManager(activeFormId);
  const {
    deleteForm, 
    isLoading: deleteLoading,
    isSuccess: deleteSuccess,
    error: deleteError,
  } = useDeleteFormManager(selectedId);
  useEffect(() => {
    if(updateFormSuccess){
      refetch()
      recall()
      setShowModal(false);
      document.getElementById("toggle_visibility").close()
    }
    if(updateSuccess){
      refetch()
      recall()
      document.getElementById("form_field").close()
    }
    if(deleteSuccess){
      refetch()
      recall()
    }
  }, [deleteSuccess, updateSuccess, updateFormSuccess])
  const [formData, setFormData] = useState({
    name: "",
    is_required: false,
    is_active: true,
    is_public: true,
    registration_start_date: "",
    registration_end_date: "",
  });

  const [fieldData, setFieldData] = useState({
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    validation: {
      min_length: "",
      max_length: "",
      pattern: "",
    },
  });

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

  const handleOpenFormModal = (form = null) => {
    setEditingForm(form);
    setActiveFormId(form?.id || null);

    if (form) {
      setFormData({
        name: form.description || "", // API uses 'description' field as name
        is_required: form.is_required !== undefined ? form.is_required : false,
        is_active: form.is_active !== undefined ? form.is_active : true,
        is_public: form.is_public !== undefined ? form.is_public : true,
        registration_start_date: form.start_date
          ? form.start_date.split("T")[0]
          : "",
        registration_end_date: form.end_date ? form.end_date.split("T")[0] : "",
      });
    } else {
      setFormData({
        name: "",
        is_required: false,
        is_active: true,
        is_public: true,
        registration_start_date: "",
        registration_end_date: "",
      });
    }

    setShowModal(true);
  };

  const handleOpenFieldModal = (formId, field = null) => {
    setCurrentFormId(formId);
    setActiveFormId(formId);
    setEditingField(field);

    if (field) {
      setFieldData({
        type: field.type || "text",
        label: field.label || "",
        placeholder: field.placeholder || "",
        required: field.required !== undefined ? field.required : false,
        options: field.options || [],
        validation: field.validation || {
          min_length: "",
          max_length: "",
          pattern: "",
        },
      });
    } else {
      setFieldData({
        type: "text",
        label: "",
        placeholder: "",
        required: false,
        options: [],
        validation: { min_length: "", max_length: "", pattern: "" },
      });
    }

    setShowFieldModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
    setShowFieldModal(false);
    setEditingForm(null);
    setEditingField(null);
    setCurrentFormId(null);
  };

  const handleViewSubmissions = (form) => {
    setActiveFormId(form.id);
    setActiveTab("submissions");
  };

  const handleBackToForms = () => {
    setActiveFormId(null);
    setActiveTab("forms");
  };

  const handleSaveForm = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a form name");
      return;
    }

    try {
      if (editingForm) {
        // Update existing form using form update endpoint
        const updatePayload = {
          description: formData.name, // API uses description field as name
          start_date: formData.registration_start_date,
          end_date: formData.registration_end_date,
          is_public: formData.is_public,
          is_required: formData.is_required,
          is_active: formData.is_active,
        };

        // Only include form_fields if they exist in the editing form
        if (editingForm.form_fields && editingForm.form_fields.length > 0) {
          updatePayload.form_fields = editingForm.form_fields;
        }

         await updateForm(updatePayload);  
      } else {
        // Create new form
        await createForm({
          event: event.id,
          description: formData.name, // Send name as description to backend
          start_date: formData.registration_start_date,
          end_date: formData.registration_end_date,
          is_public: formData.is_public,
          is_required: formData.is_required,
          is_active: formData.is_active,
        });
      }

      handleCloseModals();
    } catch (error) {
      console.error("Error saving form:", error);
      console.error("Error details:", error.message);
      alert(`Error saving form: ${error.message || "Please try again."}`);
    }
  };

  const handleSaveField = async () => {
    if (!fieldData.label.trim()) {
      alert("Please enter a field label");
      return;
    }

    try {
      const currentForm = (formsData?.data || []).find(
        (f) => f.id === activeFormId
      );
      if (!currentForm) return;

      const newField = {
        type: fieldData.type,
        label: fieldData.label,
        placeholder: fieldData.placeholder,
        required: fieldData.required,
        options: fieldData.options,
      };

      let updatedFields;
      if (editingField) {
        // Update existing field
        updatedFields = currentForm.form_fields.map((field) =>
          field._id === editingField._id ? { ...field, ...newField } : field
        );
      } else {
        // Add new field
        updatedFields = [...(currentForm.form_fields || []), newField];
      }

      // Call API to update form fields
      await updateFormFields(updatedFields);

      handleCloseModals();
    } catch (error) {
      console.error("Error saving field:", error);
      alert("Error saving field. Please try again.");
    }
  };

   

   

  const handleDeleteField = async (formId, fieldId) => {
     try {
      const currentForm = (formsData?.data || []).find((f) => f.id === formId);
      if (!currentForm) return;

      // Filter out the field to be deleted
      const updatedFields = currentForm.form_fields.filter(
        (field) => (field._id || field.id) !== fieldId
      );

      await updateFormFields(updatedFields);
    } catch (error) {
      console.error("Error deleting field:", error);
      alert("Error deleting field. Please try again.");
    }
  };

  const toggleFormStatus = async (formId, field) => {
    try {
      const currentForm = (formsData?.data || []).find((f) => f.id === formId);
      if (!currentForm) return;

      // Update the form with the toggled status
      const payload = {
           ...currentForm,
        [field]: !currentForm[field],
      } 
      await updateForm(payload); 
    } catch (error) {
      console.error("Error toggling form status:", error);
      alert("Error updating form status. Please try again.");
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...fieldData.options];
    updatedOptions[index] = value;
    setFieldData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setFieldData((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    const updatedOptions = fieldData.options.filter((_, i) => i !== index);
    setFieldData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const needsOptions = ["select", "radio", "checkbox"].includes(fieldData.type);

  const getTotalStats = () => {
    const forms = formsData?.data || [];
    const totalForms = forms.length;
    const activeForms = forms.filter((f) => f.is_active).length;
    const totalSubmissions = forms.reduce(
      (sum, form) => sum + (form.submission_count || 0),
      0
    );
    const totalFields = forms.reduce(
      (sum, form) => sum + (form.form_fields?.length || 0),
      0
    );

    return { totalForms, activeForms, totalSubmissions, totalFields };
  };
  const renderFormField = (field, index) => {  
  
      switch (field.type) {
        case "text":
        case "email":
        case "phone":
          return (
            <InputWithFullBoarder
              key={index}
              label={field.label}
              type={field.type} 
              disabled
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              isRequired={field.required}
               
            />
          );
  
        case "textarea":
          return (
            <InputWithFullBoarder
              key={index}
              label={field.label}
              disabled
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              isTextArea={true}
              rows={4}
              isRequired={field.required}
               
            />
          );
  
        case "select":
          return (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              <select 
                disabled
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 border-gray-300`}
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select> 
            </div>
          );
  
        case "radio":
          return (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {field.options?.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center">
                    <input
                      type="radio"
                      name={`field_${index}`}
                      disabled
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div> 
            </div>
          );
  
        case "checkbox":
          return (
            <div key={index} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              <div className="space-y-2">
                {field.options?.map((option, optionIndex) => (
                  <label key={optionIndex} className="flex items-center">
                    <input
                      type="checkbox" 
                      disabled
                      className="mr-2 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div> 
            </div>
          );
  
        default:
          return (
            <InputWithFullBoarder
              key={index}
              label={field.label}
              disabled
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
              isRequired={field.required}
               
            />
          );
      }
    };

  const stats = getTotalStats();

  if (formsLoading || loadingForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600">Loading forms...</p>
        </div>
      </div>
    );
  }

  if (formsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          Error loading forms: {formsError.message}
        </div>
        <CustomButton
          buttonText="Retry"
          onClick={() => window.location.reload()}
          buttonColor="bg-purple-600"
          radius="rounded-md"
        />
      </div>
    );
  }

  return (
    ( Boolean(show) && selectedId) ?
      <div>
        <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                      onClick={() => {setShow(0)}}
                      className="p-2 text-gray-500 hover:text-gray-700 rounded"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                  <div>
                     
                    <p className="text-gray-600">{formResponse?.data}</p>
                  </div>
                </div>
              </div>
        
              {/* Form Description */}
              {formResponse?.data.description && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{formResponse?.data.description}</p>
                </div>
              )}
        
              {/* Form */}
              <div  className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Full Name" 
                    disabled
                    placeholder="Enter your full name"
                    isRequired={true} 
                  />
                  <InputWithFullBoarder
                    label="Email Address"
                    type="email"
                    disabled
                    placeholder="Enter your email address"
                    isRequired={true} 
                  />
                </div>
        
                {/* Dynamic Form Fields */}
                {formResponse?.data.form_fields && formResponse?.data.form_fields.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Form Details</h3>
                    {formResponse?.data.form_fields.map((field, index) => renderFormField(field, index))}
                  </div>
                )}
         
                <div className="flex justify-end pt-6">
                  <CustomButton
                    buttonText="Submit Form" 
                    disabled 
                    prefixIcon={<Send className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                  />
                </div>
              </div>
      </div>
    :
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Forms Management
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Create and manage dynamic registration forms for your event
            attendees
          </p>
        </div>

        <CustomButton
          buttonText="Create Form"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenFormModal()}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Forms</p>
              <p className="text-2xl font-semibold">{stats.totalForms}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active Forms</p>
              <p className="text-2xl font-semibold">{stats.activeForms}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-semibold">{stats.totalSubmissions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Total Fields</p>
              <p className="text-2xl font-semibold">{stats.totalFields}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms List */}
      {activeTab === "forms" && (
        <div className="space-y-4">
          {(formsData?.data || []).length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No forms yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create dynamic registration forms to collect additional
                information from attendees
              </p>
              <CustomButton
                buttonText="Create First Form"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-purple-600"
                radius="rounded-md"
                onClick={() => handleOpenFormModal()}
              />
            </div>
          ) : (
            (formsData?.data || []).map((form) => (
              <div
                key={form.id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{form.name}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {form.is_required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            form.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {form.is_active ? "Active" : "Inactive"}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            form.is_public
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {form.is_public ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {form.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Open:{" "}
                          {form.start_date
                            ? new Date(form.start_date).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Close:{" "}
                          {form.end_date
                            ? new Date(form.end_date).toLocaleDateString()
                            : "Not set"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{form.submission_count || 0} submissions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="w-full sm:w-auto">
                      <CustomButton
                        buttonText={`Submissions (${
                          form.submission_count || 0
                        })`}
                        prefixIcon={<BarChart3 className="w-4 h-4" />}
                        buttonColor="bg-purple-600"
                        radius="rounded-md"
                        onClick={() => handleViewSubmissions(form)}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {setActiveFormId(form.id);
                          typeof document !== "undefined" && document.getElementById("toggle_visibility").showModal()
                          }}
                        className={`p-2 rounded ${
                          form.is_active
                            ? "text-green-600 bg-green-50"
                            : "text-gray-400 bg-gray-50"
                        }`}
                        title={form.is_active ? "Active" : "Inactive"}
                      >
                        {form.is_active ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => { 
                          const formUrl = `${window.location.origin}/forms/${event.id}/${form.id}`;

                          // Try to use Web Share API if available
                          if (navigator.share) {
                            navigator
                              .share({
                                title: form.description,
                                text: `Fill out this form: ${form.description}`,
                                url: formUrl,
                              })
                              .catch((err) => {
                                // Fallback to clipboard
                                navigator.clipboard.writeText(formUrl);
                                // You'll need a state to show a copied notification
                              });
                          } else {
                            // Fallback to clipboard
                            navigator.clipboard.writeText(formUrl); 
                          }
                        }}
                        className="p-2 text-gray-500 hover:text-green-600 rounded"
                        title="Share form"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenFormModal(form)}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded"
                        title="Edit form"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedId(form.id)
                          typeof document !== "undefined" && document.getElementById("delete").showModal()
                        }}
                        className="p-2 text-gray-500 hover:text-red-600 rounded"
                        title="Delete form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">
                      Form Fields ({form.form_fields?.length || 0})
                    </h4>
                    <CustomButton
                      buttonText="Add Field"
                      prefixIcon={<Plus className="w-3 h-3" />}
                      buttonColor="bg-gray-500"
                      radius="rounded-md"
                      onClick={() => handleOpenFieldModal(form.id)}
                    />
                  </div>

                  {!form.form_fields || form.form_fields.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">
                      No fields added yet
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {form.form_fields.map((field) => (
                        <div
                          key={field._id || field.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded border"
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
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleOpenFieldModal(form.id, field)
                              }
                              className="p-1 text-gray-500 hover:text-blue-600 rounded"
                              title="Edit field"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setActiveFormId(form.id);
                                setSelectedFieldId(field._id || field.id)
                                typeof document !== "undefined" && document.getElementById("form_field").showModal()
                                
                                
                              }}
                              className="p-1 text-gray-500 hover:text-red-600 rounded"
                              title="Delete field"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Submissions Tab */}
      {activeTab === "submissions" && activeFormId && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToForms}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800"
            >
              <X className="w-4 h-4" />
              Back to Forms
            </button>
            <h3 className="text-lg font-semibold">
              {
                (formsData?.data || []).find((f) => f.id === activeFormId)
                  ?.description
              }{" "}
              - Submissions
            </h3>
          </div>
          <FormSubmissionsView
            forms={[(formsData?.data || []).find((f) => f.id === activeFormId)]}
            event={event}
          />
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  {editingForm ? "Edit Form" : "Create New Form"}
                </h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <InputWithFullBoarder
                  label="Form Name *"
                  placeholder="Enter form name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  isRequired={true}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Registration Start Date"
                    type="date"
                    value={formData.registration_start_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registration_start_date: e.target.value,
                      }))
                    }
                  />
                  <InputWithFullBoarder
                    label="Registration End Date"
                    type="date"
                    min={formData.registration_start_date && new Date(formData.registration_start_date).toISOString().split("T")[0]}
                    value={formData.registration_end_date}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        registration_end_date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_required}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_required: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Required Form
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_active: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active Form
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_public: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Public Form
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <CustomButton
                    buttonText={editingForm ? "Update Form" : "Create Form"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={editingForm ? updateFormLoading : isLoading}
                    onClick={handleSaveForm}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={handleCloseModals}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Field Modal */}
      {showFieldModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingField ? "Edit Field" : "Add New Field"}
                </h3>
                <button
                  onClick={handleCloseModals}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Field Type
                    </label>
                    <select
                      value={fieldData.type}
                      onChange={(e) =>
                        setFieldData((prev) => ({
                          ...prev,
                          type: e.target.value,
                          options: [],
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputWithFullBoarder
                    label="Field Label *"
                    value={fieldData.label}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        label: e.target.value,
                      }))
                    }
                    placeholder="e.g., Dietary Requirements"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Placeholder Text"
                    value={fieldData.placeholder}
                    onChange={(e) =>
                      setFieldData((prev) => ({
                        ...prev,
                        placeholder: e.target.value,
                      }))
                    }
                    placeholder="Optional placeholder text"
                  />

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={fieldData.required}
                      onChange={(e) =>
                        setFieldData((prev) => ({
                          ...prev,
                          required: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Required field
                    </label>
                  </div>
                </div>

                {needsOptions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {fieldData.options.map((option, index) => (
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

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingField ? "Update Field" : "Add Field"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={updateLoading}
                    onClick={handleSaveField}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={handleCloseModals}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmationModal title={"Delete Form"} isLoading={deleteLoading} buttonColor={"bg-red-500"} buttonText={"Delete"} body={"Are you sure you want to delete this form?"} 
            onClick={async () => { 
              try {
                 deleteForm()
              } catch (error) {
                console.error("Error deleting resource:", error);
                toast.error("Error deleting resource. Please try again.");
              }
            } 
            }
            />
      <DeleteConfirmationModal id={"form_field"} title={"Remove Field"} isLoading={updateLoading}   buttonText={"Remove"} body={"Are you sure you want to delete this field?"} 
            onClick={() => {
              handleDeleteField(
                activeFormId,
                selectedFieldId
              );
            }
            }
            />     
      <DeleteConfirmationModal id={"toggle_visibility"} successFul={!formData.is_active} title={formData.is_active ? "Make Inactive " : "Make Active"} isLoading={updateFormLoading}   buttonText={"Switch"} buttonColor={formData.is_active ? "bg-red-500" : "bg-[#8D0BF0]"} body={`Are you sure you want to this form ${formData.is_active ? "Inactive" : "active"}?`} 
            onClick={() => {
              toggleFormStatus(activeFormId, "is_active")
            }
            }
            />            
    </div>  
            
   
  );
};

export default FormsManagementTab;
