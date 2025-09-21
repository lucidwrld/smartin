import { bookabooth, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, FolderOpen, ImageIcon, LinkIcon, MapPin, Mic, Minus, Plus, Store, Video } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"
import { getVisibleSections, shouldShowSection } from "@/utils/publicFilter"
 
export default function ExploreTabManagement({eventDetails}){
    const [selectedTab, setSelectedTab] = useState(0)
     
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
                            <Image key={l} src={el} width={173} height={173} alt="" className="rounded-[4px] object-cover !w-full !h-[173.33px]" /> 
                        ))
                    }

                </div>  
                
            </div>}
            {visibleTabs[selectedTab] === "Resources" &&  renderResourcesSection(eventDetails)  }
            
             

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
                    <div key={l} className="border-[1px] w-full flex-shrink-0 flex  gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                         
                        <Image src={el?.url} alt="" width={112} height={112} className="!w-[112px] !h-[112px] flex-shrink-0 bg-[#EEE2F8] rounded-[4px] "/>
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
                                <ChevronRight size={20} className=" flex-shrink-0 flex" />    
                            </div>   
                            
                        </div>
                    </div>
                ))
            }
        
        </div>    
    </div>
  );
}