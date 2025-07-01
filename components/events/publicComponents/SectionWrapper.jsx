"use client";

import React from "react";

const SectionWrapper = ({ 
  id, 
  title, 
  subtitle, 
  children, 
  className = "", 
  background = "default", // default, primary, secondary, gradient
  pattern = "none" // none, dots, grid, waves
}) => {
  const getBackgroundClasses = () => {
    switch (background) {
      case "primary":
        return "theme-primary text-white";
      case "secondary":
        return "theme-secondary text-white";
      case "gradient":
        return "bg-gradient-to-br from-gray-50 to-white";
      default:
        return "bg-white";
    }
  };

  const getPatternOverlay = () => {
    switch (pattern) {
      case "dots":
        return (
          <div className="absolute inset-0 opacity-5">
            <svg width="60" height="60" viewBox="0 0 60 60" className="w-full h-full">
              <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
        );
      case "grid":
        return (
          <div className="absolute inset-0 opacity-5">
            <svg width="100" height="100" viewBox="0 0 100 100" className="w-full h-full">
              <pattern id="grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        );
      case "waves":
        return (
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section 
      id={id}
      className={`relative py-16 md:py-24 ${getBackgroundClasses()} ${className}`}
    >
      {getPatternOverlay()}
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 md:mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;