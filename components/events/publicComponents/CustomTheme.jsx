"use client";

import React from "react";

const generateColorPalette = (primaryColor) => {
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1/3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1/3);

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  if (!primaryColor) return {};

  const rgb = hexToRgb(primaryColor);
  if (!rgb) return {};

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Generate color variations
  const colors = {
    primary: primaryColor,
    primaryLight: rgbToHex(...hslToRgb(h, s, Math.min(l + 20, 95))),
    primaryDark: rgbToHex(...hslToRgb(h, s, Math.max(l - 20, 5))),
    secondary: rgbToHex(...hslToRgb((h + 30) % 360, s, l)),
    accent: rgbToHex(...hslToRgb((h + 180) % 360, s, l)),
    neutral: rgbToHex(...hslToRgb(h, Math.max(s - 40, 5), l)),
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  };

  return colors;
};

const CustomTheme = ({ event, children }) => {
  const colors = generateColorPalette(event?.theme?.primaryColor || "#6B46C1");
  
  const themeConfig = {
    colors,
    fonts: {
      primary: event?.theme?.primaryFont || "Inter, system-ui, sans-serif",
      secondary: event?.theme?.secondaryFont || "Inter, system-ui, sans-serif",
    },
    borderRadius: event?.theme?.borderRadius || "0.5rem",
    spacing: event?.theme?.spacing || "1rem",
    layout: event?.theme?.layout || "modern", // modern, classic, minimal
  };

  const generateCSSVariables = () => {
    return {
      '--theme-primary': colors.primary,
      '--theme-primary-light': colors.primaryLight,
      '--theme-primary-dark': colors.primaryDark,
      '--theme-secondary': colors.secondary,
      '--theme-accent': colors.accent,
      '--theme-neutral': colors.neutral,
      '--theme-success': colors.success,
      '--theme-warning': colors.warning,
      '--theme-error': colors.error,
      '--theme-font-primary': themeConfig.fonts.primary,
      '--theme-font-secondary': themeConfig.fonts.secondary,
      '--theme-border-radius': themeConfig.borderRadius,
      '--theme-spacing': themeConfig.spacing,
    };
  };

  const getLayoutClasses = () => {
    switch (themeConfig.layout) {
      case 'classic':
        return 'theme-classic';
      case 'minimal':
        return 'theme-minimal';
      default:
        return 'theme-modern';
    }
  };

  return (
    <div 
      className={`theme-wrapper ${getLayoutClasses()}`}
      style={generateCSSVariables()}
    >
      <style jsx>{`
        .theme-wrapper {
          font-family: var(--theme-font-primary);
        }

        .theme-wrapper .theme-primary {
          background-color: var(--theme-primary);
          color: white;
        }

        .theme-wrapper .theme-primary-light {
          background-color: var(--theme-primary-light);
        }

        .theme-wrapper .theme-primary-dark {
          background-color: var(--theme-primary-dark);
        }

        .theme-wrapper .theme-secondary {
          background-color: var(--theme-secondary);
        }

        .theme-wrapper .theme-accent {
          background-color: var(--theme-accent);
        }

        .theme-wrapper .theme-text-primary {
          color: var(--theme-primary);
        }

        .theme-wrapper .theme-border-primary {
          border-color: var(--theme-primary);
        }

        .theme-wrapper .theme-btn {
          background-color: var(--theme-primary);
          color: white;
          border-radius: var(--theme-border-radius);
          padding: calc(var(--theme-spacing) * 0.5) var(--theme-spacing);
          transition: all 0.2s ease;
        }

        .theme-wrapper .theme-btn:hover {
          background-color: var(--theme-primary-dark);
          transform: translateY(-1px);
        }

        .theme-wrapper .theme-card {
          border-radius: var(--theme-border-radius);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .theme-wrapper .theme-card:hover {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        /* Layout-specific styles */
        .theme-modern {
          --theme-spacing: 1.5rem;
          --theme-border-radius: 0.75rem;
        }

        .theme-classic {
          --theme-spacing: 1rem;
          --theme-border-radius: 0.25rem;
        }

        .theme-minimal {
          --theme-spacing: 0.75rem;
          --theme-border-radius: 0;
        }

        .theme-modern .theme-card {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .theme-classic .theme-card {
          border: 1px solid var(--theme-neutral);
        }

        .theme-minimal .theme-card {
          box-shadow: none;
          border-bottom: 2px solid var(--theme-primary);
        }
      `}</style>
      {children}
    </div>
  );
};

export default CustomTheme;