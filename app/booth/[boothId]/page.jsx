"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Building2, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Globe, 
  Download,
  ArrowLeft,
  ExternalLink,
  Star,
  Calendar,
  Clock,
  Package,
  Briefcase,
  FileText,
  Play
} from "lucide-react";
import { useGetBoothDetailsManager } from "@/app/booths/controllers/boothController";
import Loader from "@/components/Loader";
import Button from "@/components/Button";

const BoothDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const boothId = params.boothId;

  const { data: boothData, isLoading, error } = useGetBoothDetailsManager(boothId);
  const booth = boothData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error || !booth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booth Not Found</h1>
          <p className="text-gray-600 mb-6">The booth you're looking for could not be found.</p>
          <Button
            buttonText="Go Back"
            onClick={() => router.back()}
            buttonColor="bg-blue-600"
            textColor="text-white"
            prefixIcon={<ArrowLeft size={16} />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cover Banner */}
      <div className="relative h-80 bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
        {booth.cover_banner && (
          <img 
            src={booth.cover_banner} 
            alt={`${booth.company_name} banner`}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <Button
            buttonText="Back to Event"
            onClick={() => router.back()}
            buttonColor="bg-white/90"
            textColor="text-gray-900"
            prefixIcon={<ArrowLeft size={16} />}
            className="backdrop-blur-sm"
          />
        </div>

        {/* Company Logo */}
        <div className="absolute bottom-0 left-8 transform translate-y-1/2">
          <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-lg overflow-hidden">
            {booth.logo ? (
              <img 
                src={booth.logo} 
                alt={`${booth.company_name} logo`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <Building2 className="text-gray-400" size={48} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {booth.company_name || booth.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-4">
                {booth.industry && (
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {booth.industry}
                  </span>
                )}
                {booth.category && (
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {booth.category.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{booth.location} • {booth.size}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {booth.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About Us</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {booth.description}
                </p>
              </div>
            )}

            {/* Services */}
            {booth.services && booth.services.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={24} />
                  Services
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booth.services.map((service, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {service.image && (
                        <div className="mb-3">
                          <img 
                            src={service.image} 
                            alt={service.name || service}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {service.name || service}
                      </h3>
                      {service.description && (
                        <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      )}
                      {service.link && (
                        <a 
                          href={service.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          Learn More
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {booth.products && booth.products.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package size={24} />
                  Products
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booth.products.map((product, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      {product.image && (
                        <div className="mb-3">
                          <img 
                            src={product.image} 
                            alt={product.name || product}
                            className="w-full h-32 object-cover rounded"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {product.name || product}
                      </h3>
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      )}
                      {product.price && (
                        <p className="text-blue-600 font-medium mb-2">{product.price}</p>
                      )}
                      {product.link && (
                        <a 
                          href={product.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          View Product
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Video */}
            {booth.video && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Play size={24} />
                  Company Video
                </h2>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={booth.cover_banner}
                  >
                    <source src={booth.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {booth.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="text-gray-400" size={18} />
                    <a href={`mailto:${booth.email}`} className="text-blue-600 hover:underline">
                      {booth.email}
                    </a>
                  </div>
                )}
                {booth.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="text-gray-400" size={18} />
                    <a href={`tel:${booth.phone}`} className="text-blue-600 hover:underline">
                      {booth.phone}
                    </a>
                  </div>
                )}
                {booth.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="text-gray-400" size={18} />
                    <a 
                      href={booth.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {booth.address && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Address</h3>
                <p className="text-gray-700">{booth.address}</p>
              </div>
            )}

            {/* Social Media */}
            {(booth.facebook || booth.twitter || booth.linkedin || booth.instagram) && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Social Media</h3>
                <div className="space-y-2">
                  {booth.facebook && (
                    <a 
                      href={booth.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      Facebook
                    </a>
                  )}
                  {booth.twitter && (
                    <a 
                      href={booth.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      Twitter
                    </a>
                  )}
                  {booth.linkedin && (
                    <a 
                      href={booth.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  {booth.instagram && (
                    <a 
                      href={booth.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Brochure Download */}
            {booth.brochure && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resources</h3>
                <Button
                  buttonText="Download Brochure"
                  onClick={() => window.open(booth.brochure, '_blank')}
                  buttonColor="bg-blue-600"
                  textColor="text-white"
                  prefixIcon={<Download size={16} />}
                  className="w-full"
                />
              </div>
            )}

            {/* Booth Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Booth Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{booth.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{booth.size}</span>
                </div>
                {booth.category && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{booth.category.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoothDetailsPage;