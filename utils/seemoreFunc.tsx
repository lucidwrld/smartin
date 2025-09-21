import React, { useState, useRef, useEffect } from 'react';

export const DescriptionWithSeeMore = ({ description, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldShowSeeMore, setShouldShowSeeMore] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    const checkIfNeedsSeeMore = () => {
      if (textRef.current && description) {
        // Reset state first
        setShouldShowSeeMore(false);
        
        // Remove any existing line clamping to get natural height
        const originalDisplay = textRef.current.style.display;
        const originalWebkitLineClamp = textRef.current.style.webkitLineClamp;
        const originalOverflow = textRef.current.style.overflow;
        
        textRef.current.style.display = 'block';
        textRef.current.style.webkitLineClamp = 'unset';
        textRef.current.style.overflow = 'visible';
        
        // Get line height (18px from leading-[18px])
        const lineHeight = 18;
        const maxHeight = lineHeight * 3; // 3 lines = 54px
        const actualHeight = textRef.current.scrollHeight;
        
        // Restore original styles
        textRef.current.style.display = originalDisplay;
        textRef.current.style.webkitLineClamp = originalWebkitLineClamp;
        textRef.current.style.overflow = originalOverflow;
        
        // Only show "See more" if content is GREATER than 3 lines
        if (actualHeight > maxHeight + 2) { // Adding 2px buffer for precision
          setShouldShowSeeMore(true);
        }
      }
    };

    // Add a small delay to ensure the component is fully rendered
    const timer = setTimeout(checkIfNeedsSeeMore, 50);
    
    return () => clearTimeout(timer);
  }, [description]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (!description) return null;

  return (
    <div className={className}>
      <p 
        ref={textRef}
        className={`text-[12px] leading-[18px] font-normal text-[#1B1B1B] ${
          !isExpanded && shouldShowSeeMore 
            ? 'line-clamp-3 overflow-hidden' 
            : ''
        }`}
        style={{
          display: !isExpanded && shouldShowSeeMore ? '-webkit-box' : 'block',
          WebkitLineClamp: !isExpanded && shouldShowSeeMore ? 3 : 'unset',
          WebkitBoxOrient: 'vertical',
          overflow: !isExpanded && shouldShowSeeMore ? 'hidden' : 'visible'
        }}
      >
        {description}
      </p>
      
      {shouldShowSeeMore && (
        <span 
          className="font-medium text-brandPurple cursor-pointer text-[12px] leading-[18px]"
          onClick={toggleExpanded}
        >
          {isExpanded ? 'See less' : 'See more'}
        </span>
      )}
    </div>
  );
};
 