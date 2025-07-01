"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Home, Info, Users, Calendar, Gift, Image, MessageSquare, Star } from "lucide-react";

const EventNavigation = ({ event, activeSection, onSectionChange, isScrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "about", label: "About", icon: Info },
    { id: "program", label: "Program", icon: Calendar },
    { id: "speakers", label: "Speakers", icon: Users },
    { id: "gallery", label: "Gallery", icon: Image },
    { id: "registry", label: "Gift Registry", icon: Gift },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
    onSectionChange(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3">
              {event?.logo ? (
                <img 
                  src={event.logo} 
                  alt="Event Logo" 
                  className="h-8 w-auto max-w-32 object-contain"
                />
              ) : (
                <div className={`text-2xl font-bold ${
                  isScrolled ? 'theme-text-primary' : 'text-white'
                }`}>
                  {event?.name?.split(' ')[0] || 'Event'}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeSection === item.id
                        ? isScrolled
                          ? 'theme-primary text-white'
                          : 'bg-white/20 text-white'
                        : isScrolled
                        ? 'text-gray-600 hover:theme-text-primary'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${
                  isScrolled ? 'text-gray-600' : 'text-white'
                }`}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        activeSection === item.id
                          ? 'theme-primary text-white'
                          : 'text-gray-600 hover:theme-text-primary hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Progress Indicator */}
      <div className="fixed top-16 left-0 right-0 z-40">
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full theme-primary transition-all duration-300"
            style={{ 
              width: `${Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%` 
            }}
          />
        </div>
      </div>
    </>
  );
};

export default EventNavigation;