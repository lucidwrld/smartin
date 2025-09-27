import { bookabooth, profile, speaker } from "@/public/icons"
import { Award, Calendar, Camera, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, FolderOpen, ImageIcon, LinkIcon, MapPin, Mic, Minus, Play, Plus, Store, Video, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"
import { getVisibleSections, shouldShowSection } from "@/utils/publicFilter"
 
export default function ExploreTabManagement({eventDetails}){
    const [selectedTab, setSelectedTab] = useState(0) 
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [selectedGalleryItem, setSelectedGalleryItem] = useState(null);
    const [galleryCurrentIndex, setGalleryCurrentIndex] = useState(0);
    const isVideo = (url) =>
    url?.includes("video") || url?.endsWith(".mp4") || url?.includes(".mp4"); 
    const openGalleryModal = (item, index) => {
    setSelectedGalleryItem(item);
    setGalleryCurrentIndex(index);
    setShowGalleryModal(true);
  };
  
  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setSelectedGalleryItem(null);
  };

  const goToPreviousGalleryItem = () => {
    const gallery = eventDetails?.gallery || [];
    const newIndex =
      galleryCurrentIndex > 0 ? galleryCurrentIndex - 1 : gallery.length - 1;
    setGalleryCurrentIndex(newIndex);
    setSelectedGalleryItem(gallery[newIndex]);
  };

  const goToNextGalleryItem = () => {
    const gallery = eventDetails?.gallery || [];
    const newIndex =
      galleryCurrentIndex < gallery.length - 1 ? galleryCurrentIndex + 1 : 0;
    setGalleryCurrentIndex(newIndex);
    setSelectedGalleryItem(gallery[newIndex]);
  };
      const tabConfig = {
        "Gallery": "gallery",
        "Resources": "resources",  
      };
      
      // Get visible tabs dynamically
      const visibleTabs = eventDetails ? getVisibleSections(eventDetails, tabConfig) : [];
      const showTabSection = eventDetails ? shouldShowSection(eventDetails, tabConfig) : false;
      if (!showTabSection || visibleTabs.length === 0) {
    return null;
  }
  
  // Reset selectedTab if current selection is not in visible tabs
  if (selectedTab >= visibleTabs.length) {
    setSelectedTab(0);
  }
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Explore the Event</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className={`w-full h-fit rounded-[6px] bg-[#F2F2F2] p-[10px] gap-[10px] grid`} 
                style={{gridTemplateColumns: `repeat(${visibleTabs.length}, 1fr)`}}>
                {visibleTabs.map((tab, index) => (
                <div 
                    key={index} 
                    onClick={() => setSelectedTab(index)} 
                    className={`cursor-pointer flex items-center justify-center ${
                    index === selectedTab ? "bg-backgroundPurple text-white" : "bg-white text-[#1B1B1B]"
                    } text-[14px] font-medium p-[10px] rounded-[4px]`}
                > 
                    {tab}
                </div>
                ))}
            </div>
            {visibleTabs[selectedTab] === "Gallery" && <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-light">Gallery</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="w-full grid grid-cols-3 gap-[5px]">
                    {
                        eventDetails?.gallery?.map((el,l) => (
                          <div
                            key={l}
                            className="relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => openGalleryModal(el, l)}
                          >
                            {isVideo(el) ? (
                              <div className="relative">
                                <video
                                  src={el}
                                  className="w-full h-[173.33px] object-cover"
                                  muted
                                  playsInline
                                />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                                    <Play
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <img
                                  src={el}
                                  alt={`Gallery ${l + 1}`}
                                  className="w-full h-[173.33px] object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                  <Camera
                                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    size={32}
                                  />
                                </div>
                              </>
                            )}
                          </div> 
                        ))
                    }

                </div>  
                
            </div>}
            {visibleTabs[selectedTab] === "Resources" &&  renderResourcesSection(eventDetails)  }
            
             
        {showGalleryModal && selectedGalleryItem && (
                <div
                  className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                  onClick={closeGalleryModal}
                >
                  {/* Close Button */}
                  <button
                    onClick={closeGalleryModal}
                    className="absolute top-4 right-4 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <X size={24} />
                  </button>
        
                  {/* Previous Button */}
                  {eventDetails?.gallery?.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPreviousGalleryItem();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
        
                  {/* Next Button */}
                  {eventDetails?.gallery?.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNextGalleryItem();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-60 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  )}
        
                  {/* Media Content */}
                  <div className="max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                    {isVideo(selectedGalleryItem) ? (
                      <video
                        src={selectedGalleryItem}
                        className="w-full max-h-[80vh] object-contain"
                        controls
                        autoPlay
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <img
                        src={selectedGalleryItem}
                        alt="Gallery view"
                        className="w-full max-h-[80vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
        
                  {/* Image Counter */}
                  {eventDetails?.gallery?.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                      {galleryCurrentIndex + 1} / {eventDetails.gallery.length}
                    </div>
                  )}
                </div>
              )}            
        </div>
    )
}
function renderResourcesSection(eventDetails) {
  const resources = eventDetails?.resources?.filter(item => item.is_public) || [];
  
    const getTypeColor = (type) => {
      switch (type) {
        case "document":
          return "bg-blue-100 text-blue-800";
        case "image":
          return "bg-green-100 text-green-800";
        case "video":
          return "bg-purple-100 text-purple-800";
        case "link":
          return "bg-orange-100 text-orange-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };
  return (
    <div className="w-full h-fit flex flex-col gap-[10px]">
        <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Resources</h1>
        <div className="w-full h-[1px] bg-[#CDCDCD]">
            </div>  
        <div className="flex w-full flex-col h-fit gap-[9px]">
            {
                resources?.map((el,l) => (
                    <div key={l} onClick={() =>
                      el.url && window.open(el.url, "_blank")
                    } className="border-[1px] w-full cursor-pointer flex-shrink-0 flex  gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                         
                        <div className="lg:w-[112px] w-full !h-[112px] flex-shrink-0 bg-brandPurple rounded-[4px] flex justify-center items-center">
                                <FolderOpen size={60} color="#fff"/> 
                            </div>
                        <div className="w-full h-auto flex flex-col gap-3"> 
                            <div className="w-full h-fit flex justify-between"> 
                                <h1 className="text-[16px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                    {el?.name}
                                </h1>
                                <span  className={`px-2 py-1 text-xs capitalize rounded ${getTypeColor(el?.type)}`}>
                                    {el?.type}
                                </span>
                            </div>
                            
                            <div className="w-full h-fit flex justify-between gap-3 items-center">
                                <p className="text-[#64748B] text-[12px] font-light leading-[16px]">
                                    {el?.description}
                                    </p>    
                                <ChevronRight size={20}  className="  flex-shrink-0 flex" />    
                            </div>   
                            
                        </div>
                    </div>
                ))
            }
        
        </div>    
    </div>
  );
}