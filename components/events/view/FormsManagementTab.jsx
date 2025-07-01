"use client";

import React, { useState } from "react";
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
  Copy,
  BarChart3,
  Users,
  CheckCircle,
  Calendar,
  Download,
  Search
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";

// Mock submission data - in real implementation, this would come from API
const generateMockSubmissions = (form) => {
  const submissions = [];
  const guestNames = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Wilson", "Carol Brown", "David Lee", "Emma Davis", "Frank Miller", "Grace Taylor", "Henry Clark"];
  
  for (let i = 0; i < form.submission_count; i++) {
    const submission = {
      id: `submission_${form.id}_${i + 1}`,
      form_id: form.id,
      guest_name: guestNames[i % guestNames.length],
      guest_email: `${guestNames[i % guestNames.length].toLowerCase().replace(' ', '.')}@example.com`,
      submitted_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {}
    };

    // Generate mock responses for each field
    form.fields.forEach(field => {
      switch (field.type) {
        case "text":
        case "textarea":
          submission.responses[field.id] = field.label.includes("Dietary") ? ["None", "Vegetarian", "Vegan", "Gluten-free", "No nuts"][Math.floor(Math.random() * 5)] : "Sample text response";
          break;
        case "email":
          submission.responses[field.id] = submission.guest_email;
          break;
        case "phone":
          submission.responses[field.id] = "+1 (555) " + Math.floor(Math.random() * 900 + 100) + "-" + Math.floor(Math.random() * 9000 + 1000);
          break;
        case "select":
        case "radio":
          if (field.options?.length > 0) {
            submission.responses[field.id] = field.options[Math.floor(Math.random() * field.options.length)];
          }
          break;
        case "checkbox":
          submission.responses[field.id] = field.label.includes("agree") ? Math.random() > 0.3 : false;
          break;
        case "number":
          submission.responses[field.id] = Math.floor(Math.random() * 100) + 1;
          break;
        case "date":
          submission.responses[field.id] = new Date().toISOString().split('T')[0];
          break;
        default:
          submission.responses[field.id] = "Sample response";
      }
    });

    submissions.push(submission);
  }
  
  return submissions;
};

const FormSubmissionsView = ({ forms }) => {
  const [selectedForm, setSelectedForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Load submissions when form is selected
  React.useEffect(() => {
    if (selectedForm) {
      const mockSubmissions = generateMockSubmissions(selectedForm);
      setSubmissions(mockSubmissions);
    }
  }, [selectedForm]);

  const filteredSubmissions = submissions.filter(submission => 
    submission.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.guest_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewSubmissionDetails = (submission) => {
    setSelectedSubmission(submission);
    setShowSubmissionModal(true);
  };

  const exportSubmissions = () => {
    if (!selectedForm || !submissions.length) return;
    
    // Create CSV data
    const headers = ["Guest Name", "Email", "Submitted At", ...selectedForm.fields.map(f => f.label)];
    const rows = submissions.map(sub => [
      sub.guest_name,
      sub.guest_email,
      new Date(sub.submitted_at).toLocaleString(),
      ...selectedForm.fields.map(field => sub.responses[field.id] || "")
    ]);
    
    const csvContent = [headers, ...rows].map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedForm.name}_submissions.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Form Selection */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Select Form to View Submissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {forms.filter(form => form.submission_count > 0).map(form => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              className={`p-4 text-left border-2 rounded-lg transition-all ${
                selectedForm?.id === form.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{form.name}</h4>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {form.submission_count}
                </span>
              </div>
              <p className="text-sm text-gray-600">{form.description}</p>
            </button>
          ))}
          {forms.filter(form => form.submission_count > 0).length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No form submissions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Submissions List */}
      {selectedForm && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedForm.name} Submissions</h3>
                <p className="text-gray-600">
                  {filteredSubmissions.length} of {submissions.length} submissions
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
                  <th className="text-left p-3 font-medium text-gray-700">Guest</th>
                  <th className="text-left p-3 font-medium text-gray-700">Email</th>
                  <th className="text-left p-3 font-medium text-gray-700">Submitted</th>
                  <th className="text-left p-3 font-medium text-gray-700">Responses</th>
                  <th className="text-left p-3 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map(submission => (
                  <tr key={submission.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{submission.guest_name}</td>
                    <td className="p-3 text-gray-600">{submission.guest_email}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(submission.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-purple-600">
                        {Object.keys(submission.responses).length} responses
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
        </div>
      )}

      {/* Submission Details Modal */}
      {showSubmissionModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Submission Details - {selectedSubmission.guest_name}
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
                    <p className="font-medium">{selectedSubmission.guest_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Email:</span>
                    <p className="font-medium">{selectedSubmission.guest_email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Submitted:</span>
                    <p className="font-medium">{new Date(selectedSubmission.submitted_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Form:</span>
                    <p className="font-medium">{selectedForm.name}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Responses:</h4>
                  <div className="space-y-3">
                    {selectedForm.fields.map(field => (
                      <div key={field.id} className="border rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{field.label}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{field.type}</span>
                        </div>
                        <div className="text-gray-700">
                          {selectedSubmission.responses[field.id] !== undefined 
                            ? (typeof selectedSubmission.responses[field.id] === 'boolean' 
                                ? (selectedSubmission.responses[field.id] ? "Yes" : "No")
                                : selectedSubmission.responses[field.id] || "No response")
                            : "No response"
                          }
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

const FormsManagementTab = ({ event }) => {
  const [forms, setForms] = useState([
    {
      id: "form_1",
      name: "General Registration",
      description: "Basic registration form for all attendees",
      is_required: true,
      is_active: true,
      is_public: true,
      registration_start_date: "2024-07-01",
      registration_end_date: "2024-07-20",
      submission_count: 245,
      fields: [
        {
          id: "field_1",
          type: "text",
          label: "Dietary Requirements",
          placeholder: "Any food allergies or preferences?",
          required: false,
          options: [],
          validation: { min_length: null, max_length: 200, pattern: null }
        },
        {
          id: "field_2",
          type: "select",
          label: "T-Shirt Size",
          placeholder: "Select your size",
          required: true,
          options: ["XS", "S", "M", "L", "XL", "XXL"],
          validation: {}
        },
        {
          id: "field_3",
          type: "checkbox",
          label: "I agree to receive event updates",
          required: false,
          options: [],
          validation: {}
        }
      ],
      created_at: "2024-07-01T10:00:00"
    },
    {
      id: "form_2",
      name: "VIP Guest Information",
      description: "Additional information for VIP attendees",
      is_required: false,
      is_active: true,
      is_public: false,
      registration_start_date: "2024-07-01",
      registration_end_date: "2024-07-20",
      submission_count: 42,
      fields: [
        {
          id: "field_4",
          type: "text",
          label: "Special Accommodation Needs",
          placeholder: "Any special requirements?",
          required: false,
          options: [],
          validation: {}
        },
        {
          id: "field_5",
          type: "phone",
          label: "Emergency Contact",
          placeholder: "+1 (555) 123-4567",
          required: true,
          options: [],
          validation: {}
        }
      ],
      created_at: "2024-07-01T10:00:00"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [currentFormId, setCurrentFormId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("forms");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_required: false,
    is_active: true,
    is_public: true,
    registration_start_date: "",
    registration_end_date: ""
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
      pattern: ""
    }
  });

  const fieldTypes = [
    { value: "text", label: "Text Input", description: "Single line text" },
    { value: "textarea", label: "Text Area", description: "Multiple line text" },
    { value: "email", label: "Email", description: "Email address validation" },
    { value: "phone", label: "Phone", description: "Phone number input" },
    { value: "number", label: "Number", description: "Numeric input" },
    { value: "date", label: "Date", description: "Date picker" },
    { value: "select", label: "Dropdown", description: "Select from options" },
    { value: "radio", label: "Radio Buttons", description: "Single choice from options" },
    { value: "checkbox", label: "Checkboxes", description: "Multiple choices" },
    { value: "file", label: "File Upload", description: "Upload documents/images" }
  ];

  const handleOpenFormModal = (form = null) => {
    setEditingForm(form);
    
    if (form) {
      setFormData({
        name: form.name || "",
        description: form.description || "",
        is_required: form.is_required !== undefined ? form.is_required : false,
        is_active: form.is_active !== undefined ? form.is_active : true,
        is_public: form.is_public !== undefined ? form.is_public : true,
        registration_start_date: form.registration_start_date || "",
        registration_end_date: form.registration_end_date || ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        is_required: false,
        is_active: true,
        is_public: true,
        registration_start_date: "",
        registration_end_date: ""
      });
    }
    
    setShowModal(true);
  };

  const handleOpenFieldModal = (formId, field = null) => {
    setCurrentFormId(formId);
    setEditingField(field);
    
    if (field) {
      setFieldData({
        type: field.type || "text",
        label: field.label || "",
        placeholder: field.placeholder || "",
        required: field.required !== undefined ? field.required : false,
        options: field.options || [],
        validation: field.validation || { min_length: "", max_length: "", pattern: "" }
      });
    } else {
      setFieldData({
        type: "text",
        label: "",
        placeholder: "",
        required: false,
        options: [],
        validation: { min_length: "", max_length: "", pattern: "" }
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

  const handleSaveForm = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a form name");
      return;
    }

    setIsLoading(true);
    
    try {
      const newForm = {
        id: editingForm?.id || `form_${Date.now()}`,
        ...formData,
        fields: editingForm?.fields || [],
        submission_count: editingForm?.submission_count || 0,
        created_at: editingForm?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingForm) {
        setForms(prev => 
          prev.map(form => form.id === editingForm.id ? newForm : form)
        );
      } else {
        setForms(prev => [...prev, newForm]);
      }

      handleCloseModals();
    } catch (error) {
      console.error("Error saving form:", error);
      alert("Error saving form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveField = async () => {
    if (!fieldData.label.trim()) {
      alert("Please enter a field label");
      return;
    }

    setIsLoading(true);
    
    try {
      const newField = {
        id: editingField?.id || `field_${Date.now()}`,
        ...fieldData
      };

      setForms(prev => 
        prev.map(form => {
          if (form.id === currentFormId) {
            const updatedFields = editingField
              ? form.fields.map(field => field.id === editingField.id ? newField : field)
              : [...form.fields, newField];
            
            return { ...form, fields: updatedFields };
          }
          return form;
        })
      );

      handleCloseModals();
    } catch (error) {
      console.error("Error saving field:", error);
      alert("Error saving field. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!confirm("Are you sure you want to delete this form? All submissions will be lost.")) {
      return;
    }

    try {
      setForms(prev => prev.filter(form => form.id !== formId));
    } catch (error) {
      console.error("Error deleting form:", error);
      alert("Error deleting form. Please try again.");
    }
  };

  const handleDeleteField = async (formId, fieldId) => {
    if (!confirm("Are you sure you want to delete this field?")) {
      return;
    }

    try {
      setForms(prev => 
        prev.map(form => {
          if (form.id === formId) {
            return {
              ...form,
              fields: form.fields.filter(field => field.id !== fieldId)
            };
          }
          return form;
        })
      );
    } catch (error) {
      console.error("Error deleting field:", error);
      alert("Error deleting field. Please try again.");
    }
  };

  const toggleFormStatus = (formId, field) => {
    setForms(prev => 
      prev.map(form => 
        form.id === formId 
          ? { ...form, [field]: !form[field] }
          : form
      )
    );
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...fieldData.options];
    updatedOptions[index] = value;
    setFieldData(prev => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    setFieldData(prev => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index) => {
    const updatedOptions = fieldData.options.filter((_, i) => i !== index);
    setFieldData(prev => ({ ...prev, options: updatedOptions }));
  };

  const needsOptions = ["select", "radio", "checkbox"].includes(fieldData.type);

  const getTotalStats = () => {
    const totalForms = forms.length;
    const activeForms = forms.filter(f => f.is_active).length;
    const totalSubmissions = forms.reduce((sum, form) => sum + form.submission_count, 0);
    const totalFields = forms.reduce((sum, form) => sum + form.fields.length, 0);

    return { totalForms, activeForms, totalSubmissions, totalFields };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Forms Management</h2>
          <p className="text-gray-600">
            Create and manage dynamic registration forms for your event attendees
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "forms"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("forms")}
          >
            Forms
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "submissions"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("submissions")}
          >
            Submissions ({stats.totalSubmissions})
          </button>
        </div>
      </div>

      {/* Forms Tab */}
      {activeTab === "forms" && (
        <div className="space-y-4">
          {forms.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-4">
              Create dynamic registration forms to collect additional information from attendees
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
          forms.map((form) => (
            <div
              key={form.id}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{form.name}</h3>
                    {form.is_required && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      form.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {form.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      form.is_public ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {form.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Open: {new Date(form.registration_start_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Close: {new Date(form.registration_end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{form.submission_count} submissions</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {form.submission_count > 0 && (
                    <CustomButton
                      buttonText={`View Submissions (${form.submission_count})`}
                      prefixIcon={<BarChart3 className="w-4 h-4" />}
                      buttonColor="bg-purple-600"
                      radius="rounded-md"
                      onClick={() => setActiveTab("submissions")}
                      size="sm"
                    />
                  )}
                  <button
                    onClick={() => toggleFormStatus(form.id, 'is_active')}
                    className={`p-2 rounded ${form.is_active ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                    title={form.is_active ? "Active" : "Inactive"}
                  >
                    {form.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenFormModal(form)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded"
                    title="Edit form"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded"
                    title="Delete form"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-700">Form Fields ({form.fields.length})</h4>
                  <CustomButton
                    buttonText="Add Field"
                    prefixIcon={<Plus className="w-3 h-3" />}
                    buttonColor="bg-gray-500"
                    radius="rounded-md"
                    onClick={() => handleOpenFieldModal(form.id)}
                  />
                </div>
                
                {form.fields.length === 0 ? (
                  <p className="text-gray-500 text-sm italic">No fields added yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.fields.map((field) => (
                      <div
                        key={field.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{field.label}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{field.type}</span>
                          {field.required && (
                            <span className="text-xs text-red-600">Required</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenFieldModal(form.id, field)}
                            className="p-1 text-gray-500 hover:text-blue-600 rounded"
                            title="Edit field"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(form.id, field.id)}
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
      {activeTab === "submissions" && (
        <FormSubmissionsView forms={forms} />
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  {editingForm ? "Edit Form" : "Create New Form"}
                </h3>
                <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <InputWithFullBoarder
                  label="Form Name *"
                  placeholder="Enter form name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  isRequired={true}
                />

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of this form"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Registration Start Date"
                    type="date"
                    value={formData.registration_start_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_start_date: e.target.value }))}
                  />
                  <InputWithFullBoarder
                    label="Registration End Date"
                    type="date"
                    value={formData.registration_end_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, registration_end_date: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_required}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_required: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Required Form</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Form</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Public Form</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingForm ? "Update Form" : "Create Form"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={isLoading}
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingField ? "Edit Field" : "Add New Field"}
                </h3>
                <button onClick={handleCloseModals} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field Type</label>
                    <select
                      value={fieldData.type}
                      onChange={(e) => setFieldData(prev => ({ ...prev, type: e.target.value, options: [] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  <InputWithFullBoarder
                    label="Field Label *"
                    value={fieldData.label}
                    onChange={(e) => setFieldData(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="e.g., Dietary Requirements"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Placeholder Text"
                    value={fieldData.placeholder}
                    onChange={(e) => setFieldData(prev => ({ ...prev, placeholder: e.target.value }))}
                    placeholder="Optional placeholder text"
                  />

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      checked={fieldData.required}
                      onChange={(e) => setFieldData(prev => ({ ...prev, required: e.target.checked }))}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">Required field</label>
                  </div>
                </div>

                {needsOptions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-2">
                      {fieldData.options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
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
                    isLoading={isLoading}
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
    </div>
  );
};

export default FormsManagementTab;