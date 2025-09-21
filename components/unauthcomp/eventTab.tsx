// Updated EventTabManagement component
import { profile } from "@/public/icons"
import { Award, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Mic } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import CustomButton from "../Button"
import { getVisibleSections, shouldShowSection } from "@/utils/publicFilter"
 
 

export default function EventTabManagement({ eventDetails }) {
  const [selectedTab, setSelectedTab] = useState(0)
  
  // Configuration for your tabs
  const tabConfig = {
    "Programs": "program",
    "Speakers": "hosts", 
    "Sessions": "sessions"
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
  
  return (
    <div className="w-full h-fit flex flex-col gap-[20px]">
      <div className="w-full flex flex-col gap-[13px] h-fit">
        <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-light">Event Overview</h1>
        <div className="w-full h-[1px] bg-[#CDCDCD]"></div>        
      </div>
      
      {/* Dynamic tab buttons */}
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
      
      {/* Render content based on selected tab */}
      {visibleTabs[selectedTab] === "Programs" && renderProgramsSection(eventDetails)}
      {visibleTabs[selectedTab] === "Speakers" && renderSpeakersSection(eventDetails)}
      {visibleTabs[selectedTab] === "Sessions" && renderSessionsSection(eventDetails)}
    </div>
  )
}

// Helper functions to render each section
function renderProgramsSection(eventDetails) {
  const publicPrograms = eventDetails?.program?.filter(item => item.is_public) || [];
  
  return (
    <div className="w-full h-fit flex flex-col gap-[10px]">
      <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Programs</h1>
      <div className="w-full h-[1px] bg-[#CDCDCD]"></div>  
      <div className="flex flex-col w-full h-fit gap-[6px]">
        {publicPrograms.map((program, index) => (
          <div key={index} className="border-[1px] flex flex-col gap-[15px] border-[#CDCDCD] rounded-[6px] py-[12px] px-[22px]">
            <div className="w-full h-fit flex justify-between"> 
              <h1 className="text-[16px] leading-[16px] font-medium text-backgroundPurple">
                {program.description || "Program"}
              </h1>
              <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                Presentation
              </div>
            </div>
            <div className="w-full h-fit flex justify-between items-center">
              <div className="w-full h-fit flex flex-col text-[12px] text-[#64748B] gap-[5px]">
                <div className="flex items-center gap-4 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 text-brandPurple h-4" />
                    {new Date(program.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 text-brandPurple h-4" />
                    {program.start_time} - {program.end_time}
                  </span>
                </div>
                <span className="flex items-center gap-1">
                  <Mic className="w-4 text-brandPurple h-4" />
                  {program.speaker || "TBA"}
                </span>
              </div>
              <ChevronRight size={35} />
            </div>
            <p className="text-[#64748B] text-[12px] leading-[16px] font-normal">
              {program.description || "Program description..."}        
            </p>
          </div>
        ))}
      </div>    
    </div>
  );
}

function renderSpeakersSection(eventDetails) { 
  
  return (
    <div className="w-full h-fit flex flex-col gap-[10px]">
      <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Speakers</h1>
      <div className="w-full h-[1px] bg-[#CDCDCD]"></div>  
      <div className="flex overflow-x-scroll w-full max-w-[528px] scrollbar-hide h-fit gap-[9px]">
        {eventDetails?.hosts?.map((speaker, index) => (
          <div key={index} className="border-[1px] w-[220px] flex-shrink-0 flex flex-col gap-[15px] border-[#CDCDCD] rounded-[6px] p-[3px]">
            <Image 
              src={speaker.profile_image || profile} 
              width={146} 
              alt="" 
              height={146} 
              className="!w-full !h-[146px] rounded-[4px] object-cover object-center " 
            /> 
            <div className="flex flex-col gap-[9px] px-[4px] pb-5">
              <h1 className="text-[14px] leading-[16px] font-medium text-backgroundPurple">
                {speaker.name}
              </h1>
              <span className="flex items-center text-[12px] text-[#64748B] font-normal gap-1">
                <Award className="w-4 text-brandPurple h-4" />
                {speaker.title || "Speaker"}
              </span>
            </div> 
          </div>
        ))}
      </div>    
    </div>
  );
}

function renderSessionsSection(eventDetails) {
  const publicSessions = eventDetails?.sessions?.filter(item => item.is_public) || [];
  
  return (
    <div className="w-full h-fit flex flex-col gap-[10px]">
      <div className="w-full h-fit flex items-end justify-between">
        <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Sessions</h1>
        <div className="w-fit h-fit flex gap-[10px]">
          <div className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]">
            <ChevronLeft size={16} />
          </div>
          <div className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-[#CDCDCD]"></div>  
      <div className="grid lg:grid-cols-2 w-full h-fit gap-[6px]">
        {publicSessions.map((session, index) => (
          <div key={index} className="border-[1px] flex flex-col gap-[10px] border-[#CDCDCD] rounded-[6px] py-[15px] px-[11px]">
            <div className="w-full h-fit flex justify-end"> 
              <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                Session
              </div>
            </div>
            <h1 className="text-[20px] capitalize leading-[16px] font-medium text-backgroundPurple">
              {session.name || "Session"}
            </h1>
            <div className="w-full h-fit flex flex-col text-[12px] text-[#64748B] gap-[5px]">
              <div className="flex items-center gap-4 mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 text-brandPurple h-4" />
                  {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 text-brandPurple h-4" />
                  {session.start_time} - {session.end_time}
                </span>
              </div>
              <div className="w-full flex flex-wrap gap-2">  {
                session?.speakers?.map((ell,ll) => (
                  <span key={ll} className="flex capitalize items-center gap-1">
                    <Mic className="w-4 text-brandPurple h-4" />
                    {ell || "TBA"}
                  </span>
                ))
              } </div>
              
            </div>
            <p className="text-[#64748B] text-[12px] capitalize leading-[16px] font-normal">
              {session.description || "Session description..."}        
            </p>
            <CustomButton buttonText="Register" className="!h-[40px] mt-3 py-0 items-center" buttonColor=" bg-signin" />
          </div>
        ))}
      </div>    
    </div>
  );
}