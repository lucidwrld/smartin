export function getVisibleSections(data, config, visibilityCheck = null) {
  const defaultCheck = (item) => { 
    if (item && typeof item === 'object' && 'role' in item  && 'status' in item) {
       
      return item.status === "active" && item.role.toLowerCase() === "speaker";
    }
    if (item && typeof item === 'object' && 'is_public' in item) {
      return item.is_public === true;
    }
    
     
    return true;
  };

  const checkFunction = visibilityCheck || defaultCheck;
  
  const visibleSections = [];
  
  Object.entries(config).forEach(([displayName, dataKey]) => {
    const sectionData = data[dataKey];
    
    if (sectionData && sectionData.length > 0) {
      const hasVisibleItem = sectionData.some(checkFunction);
      if (hasVisibleItem) {
        visibleSections.push(displayName);
      }
    }
  });
  
  return visibleSections;
}

export function shouldShowSection(data, config, visibilityCheck = null) {
  const visibleSections = getVisibleSections(data, config, visibilityCheck);
  return visibleSections.length > 0;
}   