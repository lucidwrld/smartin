"use client";

import React, { useState, useEffect } from "react";
import { 
  Megaphone, 
  Save, 
  X, 
  Upload,
  Globe,
  Phone,
  Mail,
  Building2,
  Link,
  Image,
  ExternalLink,
  Eye
} from "lucide-react";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";

const AdvertEditForm = ({ advert, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    content_url: "",
    preview_image_url: "",
    additionalInfo: ""
  });

  // Initialize form data when advert changes
  useEffect(() => {
    if (advert) {
      setFormData({
        name: advert.name || "",
        company: advert.company || "",
        phone: advert.phone || "",
        content_url: advert.content_url || "",
        preview_image_url: advert.preview_image_url || "",
        additionalInfo: advert.additionalInfo || ""
      });
    }
  }, [advert]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePreviewLink = () => {
    if (formData.content_url) {
      window.open(formData.content_url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="text-purple-600" size={28} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Advertisement Details</h2>
                  <p className="text-gray-600">Update your advertisement information and content</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Advertisement Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Megaphone size={20} />
                Advertisement Details
              </h3>
              <div className="space-y-4">
                <InputWithFullBorder
                  id="name"
                  label="Advertisement Name *"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter a descriptive name for your advertisement"
                  isRequired
                />
                <InputWithFullBorder
                  id="company"
                  label="Company/Advertiser Name"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Your company or business name"
                  icon={<Building2 className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </section>

            {/* Media and Content */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Image size={20} />
                Media & Content
              </h3>
              <div className="space-y-4">
                <div>
                  <InputWithFullBorder
                    id="content_url"
                    label="Content/Landing Page URL *"
                    value={formData.content_url}
                    onChange={(e) => handleInputChange("content_url", e.target.value)}
                    placeholder="https://your-website.com/landing-page"
                    icon={<Link className="h-5 w-5 text-gray-400" />}
                    isRequired
                  />
                  {formData.content_url && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        buttonText="Test Link"
                        onClick={handlePreviewLink}
                        buttonColor="bg-blue-100"
                        textColor="text-blue-700"
                        prefixIcon={<ExternalLink size={14} />}
                        className="text-sm px-3 py-1"
                        type="button"
                      />
                      <span className="text-sm text-gray-500">
                        This is where users will be redirected when they click your ad
                      </span>
                    </div>
                  )}
                </div>
                
                <div>
                  <InputWithFullBorder
                    id="preview_image_url"
                    label="Preview Image URL"
                    value={formData.preview_image_url}
                    onChange={(e) => handleInputChange("preview_image_url", e.target.value)}
                    placeholder="https://your-domain.com/ad-image.jpg"
                    icon={<Upload className="h-5 w-5 text-gray-400" />}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload your advertisement image and paste the URL here. Recommended size: 800x600px
                  </p>
                  {formData.preview_image_url && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                      <div className="border rounded-lg overflow-hidden max-w-md">
                        <img 
                          src={formData.preview_image_url} 
                          alt="Advertisement preview" 
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500 hidden"
                        >
                          <div className="text-center">
                            <Image size={24} className="mx-auto mb-2" />
                            <p className="text-sm">Invalid image URL</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contact Information
              </h3>
              <div className="space-y-4">
                <InputWithFullBorder
                  id="phone"
                  label="Contact Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </section>

            {/* Additional Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes or Instructions
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Any special instructions, target audience details, campaign information, or other notes about your advertisement..."
                />
              </div>
            </section>

            {/* Advertisement Preview */}
            {(formData.name || formData.preview_image_url) && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Eye size={20} />
                  Advertisement Preview
                </h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="bg-white rounded-lg shadow-sm border p-4 max-w-sm">
                    {formData.preview_image_url && (
                      <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={formData.preview_image_url} 
                          alt={formData.name || "Advertisement"} 
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {formData.name || "Advertisement Name"}
                    </h4>
                    {formData.company && (
                      <p className="text-sm text-gray-600 mb-2">{formData.company}</p>
                    )}
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <ExternalLink size={12} />
                      <span>Click to visit</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    This is how your advertisement will appear to event attendees
                  </p>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-6 rounded-b-xl">
            <div className="flex gap-4 justify-end">
              <Button
                buttonText="Cancel"
                onClick={onCancel}
                buttonColor="bg-gray-200"
                textColor="text-gray-700"
                type="button"
              />
              <Button
                buttonText="Save Changes"
                type="submit"
                buttonColor="bg-purple-600"
                textColor="text-white"
                prefixIcon={<Save size={16} />}
                isLoading={isLoading}
                disabled={!formData.name.trim() || !formData.content_url.trim()}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertEditForm;