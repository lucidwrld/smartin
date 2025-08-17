"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload,
  Globe,
  Phone,
  Mail,
  MapPin,
  FileText,
  Video,
  Camera,
  Link,
  Package,
  Briefcase
} from "lucide-react";
import Button from "@/components/Button";
import InputWithFullBorder from "@/components/InputWithFullBoarder";

const BoothEditForm = ({ booth, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    // Basic Information
    company_name: "",
    name: "",
    phone: "",
    email: "",
    website: "",
    industry: "",
    description: "",
    
    // Visual Assets
    logo: "",
    cover_banner: "",
    brochure: "",
    video: "",
    
    // Address
    address: "",
    
    // Social Media
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    
    // Services and Products
    services: [],
    products: [],
    
    // Additional Info
    additionalInfo: ""
  });

  // Initialize form data when booth changes
  useEffect(() => {
    if (booth) {
      setFormData({
        company_name: booth.company_name || "",
        name: booth.name || "",
        phone: booth.phone || "",
        email: booth.email || "",
        website: booth.website || "",
        industry: booth.industry || "",
        description: booth.description || "",
        logo: booth.logo || "",
        cover_banner: booth.cover_banner || "",
        brochure: booth.brochure || "",
        video: booth.video || "",
        address: booth.address || "",
        facebook: booth.facebook || "",
        twitter: booth.twitter || "",
        linkedin: booth.linkedin || "",
        instagram: booth.instagram || "",
        services: booth.services || [],
        products: booth.products || [],
        additionalInfo: booth.additionalInfo || ""
      });
    }
  }, [booth]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    if (!updatedServices[index]) {
      updatedServices[index] = {};
    }
    updatedServices[index][field] = value;
    setFormData(prev => ({ ...prev, services: updatedServices }));
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    if (!updatedProducts[index]) {
      updatedProducts[index] = {};
    }
    updatedProducts[index][field] = value;
    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { name: "", description: "", image: "", link: "" }]
    }));
  };

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { name: "", description: "", image: "", link: "", price: "" }]
    }));
  };

  const removeProduct = (index) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="text-blue-600" size={28} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Booth Details</h2>
                  <p className="text-gray-600">Update your company information and booth content</p>
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

          <div className="p-6 space-y-8">
            {/* Basic Company Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 size={20} />
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBorder
                  id="company_name"
                  label="Company Name *"
                  value={formData.company_name}
                  onChange={(e) => handleInputChange("company_name", e.target.value)}
                  isRequired
                />
                <InputWithFullBorder
                  id="industry"
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell visitors about your company..."
                />
              </div>
            </section>

            {/* Visual Assets */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Camera size={20} />
                Visual Assets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputWithFullBorder
                    id="logo"
                    label="Company Logo URL"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                    icon={<Upload className="h-5 w-5 text-gray-400" />}
                  />
                  {formData.logo && (
                    <div className="mt-2">
                      <img 
                        src={formData.logo} 
                        alt="Logo preview" 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <InputWithFullBorder
                    id="cover_banner"
                    label="Cover Banner URL"
                    value={formData.cover_banner}
                    onChange={(e) => handleInputChange("cover_banner", e.target.value)}
                    icon={<Camera className="h-5 w-5 text-gray-400" />}
                  />
                  {formData.cover_banner && (
                    <div className="mt-2">
                      <img 
                        src={formData.cover_banner} 
                        alt="Banner preview" 
                        className="w-full h-16 object-cover rounded border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputWithFullBorder
                  id="brochure"
                  label="Brochure PDF URL"
                  value={formData.brochure}
                  onChange={(e) => handleInputChange("brochure", e.target.value)}
                  icon={<FileText className="h-5 w-5 text-gray-400" />}
                />
                <InputWithFullBorder
                  id="video"
                  label="Company Video URL"
                  value={formData.video}
                  onChange={(e) => handleInputChange("video", e.target.value)}
                  icon={<Video className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone size={20} />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBorder
                  id="email"
                  label="Contact Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  icon={<Mail className="h-5 w-5 text-gray-400" />}
                />
                <InputWithFullBorder
                  id="phone"
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  icon={<Phone className="h-5 w-5 text-gray-400" />}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <InputWithFullBorder
                  id="website"
                  label="Website URL"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  icon={<Globe className="h-5 w-5 text-gray-400" />}
                />
                <InputWithFullBorder
                  id="address"
                  label="Business Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  icon={<MapPin className="h-5 w-5 text-gray-400" />}
                />
              </div>
            </section>

            {/* Social Media */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Link size={20} />
                Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBorder
                  id="facebook"
                  label="Facebook URL"
                  value={formData.facebook}
                  onChange={(e) => handleInputChange("facebook", e.target.value)}
                />
                <InputWithFullBorder
                  id="twitter"
                  label="Twitter URL"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                />
                <InputWithFullBorder
                  id="linkedin"
                  label="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                />
                <InputWithFullBorder
                  id="instagram"
                  label="Instagram URL"
                  value={formData.instagram}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                />
              </div>
            </section>

            {/* Services */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Briefcase size={20} />
                  Services
                </h3>
                <Button
                  buttonText="Add Service"
                  onClick={addService}
                  buttonColor="bg-green-600"
                  textColor="text-white"
                  prefixIcon={<Plus size={16} />}
                  type="button"
                />
              </div>
              {formData.services.map((service, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Service #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFullBorder
                      label="Service Name"
                      value={service.name || ""}
                      onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                    />
                    <InputWithFullBorder
                      label="Service Image URL"
                      value={service.image || ""}
                      onChange={(e) => handleServiceChange(index, "image", e.target.value)}
                      placeholder="https://your-domain.com/service-image.jpg"
                    />
                    <InputWithFullBorder
                      label="Service Link/URL"
                      value={service.link || ""}
                      onChange={(e) => handleServiceChange(index, "link", e.target.value)}
                      placeholder="https://your-website.com/service-details"
                    />
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Description
                      </label>
                      <textarea
                        value={service.description || ""}
                        onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe this service..."
                      />
                    </div>
                  </div>
                  {service.image && (
                    <div className="mt-2">
                      <img 
                        src={service.image} 
                        alt={`${service.name} preview`} 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Products */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Products
                </h3>
                <Button
                  buttonText="Add Product"
                  onClick={addProduct}
                  buttonColor="bg-green-600"
                  textColor="text-white"
                  prefixIcon={<Plus size={16} />}
                  type="button"
                />
              </div>
              {formData.products.map((product, index) => (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Product #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputWithFullBorder
                      label="Product Name"
                      value={product.name || ""}
                      onChange={(e) => handleProductChange(index, "name", e.target.value)}
                    />
                    <InputWithFullBorder
                      label="Product Image URL"
                      value={product.image || ""}
                      onChange={(e) => handleProductChange(index, "image", e.target.value)}
                      placeholder="https://your-domain.com/product-image.jpg"
                    />
                    <InputWithFullBorder
                      label="Product Link/URL"
                      value={product.link || ""}
                      onChange={(e) => handleProductChange(index, "link", e.target.value)}
                      placeholder="https://your-website.com/product-details"
                    />
                    <InputWithFullBorder
                      label="Price (optional)"
                      value={product.price || ""}
                      onChange={(e) => handleProductChange(index, "price", e.target.value)}
                      placeholder="$99.99"
                    />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Description
                      </label>
                      <textarea
                        value={product.description || ""}
                        onChange={(e) => handleProductChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe this product..."
                      />
                    </div>
                  </div>
                  {product.image && (
                    <div className="mt-2">
                      <img 
                        src={product.image} 
                        alt={`${product.name} preview`} 
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Additional Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <textarea
                value={formData.additionalInfo}
                onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information about your booth or company..."
              />
            </section>
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
                buttonColor="bg-blue-600"
                textColor="text-white"
                prefixIcon={<Save size={16} />}
                isLoading={isLoading}
                disabled={!formData.company_name.trim()}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoothEditForm;