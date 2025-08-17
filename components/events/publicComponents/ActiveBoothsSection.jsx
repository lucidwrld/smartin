"use client";

import React from "react";
import { Building2, MapPin, Users, ExternalLink, Eye, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetActiveBoothsForEventManager } from "@/app/booths/controllers/boothController";

const BoothCard = ({ booth, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group border border-gray-200"
      onClick={() => onClick(booth)}
    >
      {/* Cover Banner */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 overflow-hidden">
        {booth.cover_banner ? (
          <img 
            src={booth.cover_banner} 
            alt={`${booth.company_name} banner`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-indigo-600" />
        )}
        
        {/* Visit Booth Button */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 group-hover:bg-white transition-colors">
            <Eye size={14} className="inline mr-1" />
            Visit Booth
          </div>
        </div>
      </div>

      {/* Company Logo */}
      <div className="relative px-6 -mt-8">
        <div className="w-16 h-16 bg-white rounded-xl border-4 border-white shadow-lg overflow-hidden">
          {booth.logo ? (
            <img 
              src={booth.logo} 
              alt={`${booth.company_name} logo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Building2 className="text-gray-400" size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-4">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {booth.company_name || booth.name}
          </h3>
          {booth.industry && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {booth.industry}
            </span>
          )}
        </div>

        {booth.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {booth.description}
          </p>
        )}

        {/* Booth Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin size={14} className="mr-2" />
            <span>
              {booth.location} • {booth.size}
            </span>
          </div>
          
          {booth.category && (
            <div className="flex items-center text-sm text-gray-500">
              <Building2 size={14} className="mr-2" />
              <span>{booth.category.name}</span>
            </div>
          )}
        </div>

        {/* Services/Products Preview */}
        {(booth.services?.length > 0 || booth.products?.length > 0) && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {booth.services?.slice(0, 2).map((service, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {service.name || service}
                </span>
              ))}
              {booth.products?.slice(0, 2).map((product, index) => (
                <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                  {product.name || product}
                </span>
              ))}
              {(booth.services?.length > 2 || booth.products?.length > 2) && (
                <span className="text-gray-500 text-xs px-2 py-1">
                  +{(booth.services?.length || 0) + (booth.products?.length || 0) - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <Users size={14} className="inline mr-1" />
            Visit for details
          </div>
          <ChevronRight 
            size={16} 
            className="text-gray-400 group-hover:text-blue-600 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

const ActiveBoothsSection = ({ eventId }) => {
  const router = useRouter();
  const { data: boothsData, isLoading, error } = useGetActiveBoothsForEventManager(eventId);

  const booths = boothsData?.data || [];

  const handleBoothClick = (booth) => {
    router.push(`/booth/${booth._id}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !booths.length) {
    return null; // Don't show section if no active booths
  }

  return (
    <section id="active-booths" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Exhibition Booths
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our exhibitors and discover their products, services, and innovations. 
            Click on any booth to learn more about what they offer.
          </p>
        </div>

        {/* Booths Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {booths.map((booth) => (
            <BoothCard
              key={booth._id}
              booth={booth}
              onClick={handleBoothClick}
            />
          ))}
        </div>

        {/* View All Button */}
        {booths.length > 8 && (
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors">
              View All {booths.length} Booths
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {booths.length}
              </div>
              <div className="text-gray-600">Exhibiting Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {booths.reduce((sum, booth) => sum + (booth.services?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Services Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {booths.reduce((sum, booth) => sum + (booth.products?.length || 0), 0)}
              </div>
              <div className="text-gray-600">Products Showcased</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveBoothsSection;