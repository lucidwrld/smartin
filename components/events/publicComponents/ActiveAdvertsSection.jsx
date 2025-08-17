"use client";

import React from "react";
import { ExternalLink, Eye, ChevronRight, Tag, Clock, Users } from "lucide-react";
import { useGetActiveAdvertsForEventManager } from "@/app/adverts/controllers/advertController";

const AdvertCard = ({ advert, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all cursor-pointer group border border-gray-200"
      onClick={() => onClick(advert)}
    >
      {/* Preview Image */}
      <div className="relative h-48 bg-gradient-to-r from-purple-500 to-pink-600 overflow-hidden">
        {advert.preview_image_url ? (
          <img 
            src={advert.preview_image_url} 
            alt={advert.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
            <Tag className="text-white" size={48} />
          </div>
        )}
        
        {/* Visit Link Button */}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 group-hover:bg-white transition-colors">
            <ExternalLink size={14} className="inline mr-1" />
            Visit Link
          </div>
        </div>

        {/* Category Badge */}
        {advert.category && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {advert.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
            {advert.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {advert.format && (
              <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {advert.format}
              </span>
            )}
            {advert.placement && (
              <span className="inline-block bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full">
                {advert.placement}
              </span>
            )}
          </div>
        </div>

        {advert.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {advert.description}
          </p>
        )}

        {/* Advert Details */}
        <div className="space-y-2 mb-4">
          {advert.dimensions && (
            <div className="flex items-center text-sm text-gray-500">
              <Tag size={14} className="mr-2" />
              <span>{advert.dimensions}</span>
            </div>
          )}
          
          {advert.duration && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock size={14} className="mr-2" />
              <span>{advert.duration}</span>
            </div>
          )}
        </div>

        {/* Company Info */}
        {advert.company && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Advertiser:</p>
            <p className="text-sm text-gray-600">{advert.company}</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <Eye size={14} className="inline mr-1" />
            Click to visit
          </div>
          <ChevronRight 
            size={16} 
            className="text-gray-400 group-hover:text-purple-600 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

const ActiveAdvertsSection = ({ eventId }) => {
  const { data: advertsData, isLoading, error } = useGetActiveAdvertsForEventManager(eventId);

  const adverts = advertsData?.data || [];

  const handleAdvertClick = (advert) => {
    if (advert.content_url) {
      // Open external link in new tab
      window.open(advert.content_url, '_blank', 'noopener,noreferrer');
    }
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

  if (error || !adverts.length) {
    return null; // Don't show section if no active adverts
  }

  return (
    <section id="active-adverts" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Featured Advertisements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover products, services, and offers from our event sponsors and partners. 
            Click on any advertisement to explore their offerings.
          </p>
        </div>

        {/* Adverts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adverts.map((advert) => (
            <AdvertCard
              key={advert._id}
              advert={advert}
              onClick={handleAdvertClick}
            />
          ))}
        </div>

        {/* View All Button */}
        {adverts.length > 8 && (
          <div className="text-center mt-12">
            <button className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-colors">
              View All {adverts.length} Advertisements
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {adverts.length}
              </div>
              <div className="text-gray-600">Active Advertisements</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(adverts.map(ad => ad.category?.name).filter(Boolean)).size}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(adverts.map(ad => ad.placement).filter(Boolean)).size}
              </div>
              <div className="text-gray-600">Placement Types</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveAdvertsSection;