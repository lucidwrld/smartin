import { profile } from "@/public/icons"
import { Award, Calendar, ChevronLeft, ChevronRight, Clock, MapPin, Mic } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"

export default function EventTabManagement(){
    const [selectedTab, setSelectedTab] = useState(0)
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-light">Event Overview</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="w-full h-fit rounded-[6px] bg-[#F2F2F2] p-[10px] gap-[10px] grid grid-cols-3">
                {
                    ["Programs","Speakers", "Sessions"].map((el,l) => (
                        <div key={l} onClick={() => {setSelectedTab(l)}} className={`cursor-pointer flex items-center justify-center ${l === selectedTab ? "bg-backgroundPurple text-white" : "bg-white text-[#1B1B1B]" } text-[14px] font-medium p-[10px] rounded-[4px]`} > 
                            {el}
                        </div>
                    ))
                }
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Programs</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="flex flex-col w-full h-fit gap-[6px]">
                    {
                       [...Array(3)].map((_,l) => (
                            <div key={l} className="border-[1px] flex flex-col gap-[15px] border-[#CDCDCD] rounded-[6px] py-[12px] px-[22px]">
                                <div className="w-full h-fit flex justify-between"> 
                                    <h1 className="text-[16px] leading-[16px] font-medium text-backgroundPurple">
                                        First Program
                                    </h1>
                                    <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                        Presentation
                                    </div>
                                </div>
                                <div className="w-full h-fit flex justify-between items-center">
                                    <div className="w-full h-fit flex flex-col text-[12px] text-[#64748B] gap-[5px]">
                                        <div className="flex items-center gap-4   mb-2">
                                            <span className="flex items-center gap-1">
                                            <Calendar className="w-4 text-brandPurple h-4" />
                                            Fri, October 10
                                            </span>
                                            <span className="flex items-center gap-1">
                                            <Clock className="w-4 text-brandPurple h-4" />
                                                1:00 PM - 10:30 PM
                                            </span>
                                        {/*  {item.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 text-brandPurple h-4" />
                                                {item.location}
                                            </span>
                                            )} */}
                                        </div>
                                        <span className="flex items-center gap-1">
                                            <Mic className="w-4 text-brandPurple h-4" />
                                            Prof, Donald Ude
                                        </span>

                                    </div>
                                    <ChevronRight size={35} />

                                </div>
                                <p className="text-[#64748B] text-[12px] leading-[16px] font-normal">
                                Lorem ipsum dolor sit amet consectetur. Massa rhoncus eget eu amet viverra fames sit lorem...         
                                </p>

                            </div>
                        ))
                    }
                
                </div>    
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Speakers</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="flex overflow-x-scroll w-full max-w-[528px] scrollbar-hide h-fit gap-[9px]">
                    {
                       [...Array(3)].map((_,l) => (
                            <div key={l} className="border-[1px] w-[220px] flex-shrink-0 flex flex-col gap-[15px] border-[#CDCDCD] rounded-[6px] p-[3px]">
                               <Image src={profile} width={undefined} alt="" height={undefined} className="w-full h-[146px] rounded-[4px] object-cover" /> 
                               <div className="flex flex-col gap-[9px] px-[4px] pb-5">
                                <h1 className="text-[14px] leading-[16px] font-medium text-backgroundPurple">
                                    Prof, Donald Ude
                                </h1>
                                <span className="flex items-center text-[12px] text-[#64748B] font-normal gap-1">
                                    <Award className="w-4 text-brandPurple h-4" />
                                    IT Consultant
                                </span>
                               </div> 
                            </div>
                        ))
                    }
                
                </div>    
            </div>
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
                
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="grid lg:grid-cols-2 w-full h-fit gap-[6px]">
                    {
                       [...Array(2)].map((_,l) => (
                            <div key={l} className="border-[1px] flex flex-col gap-[10px] border-[#CDCDCD] rounded-[6px] py-[15px] px-[11px]">
                                <div className="w-full h-fit flex justify-end"> 
                                    
                                    <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                        Presentation
                                    </div>
                                </div>
                                <h1 className="text-[20px] leading-[16px] font-medium text-backgroundPurple">
                                        Networking
                                    </h1>
                                <div className="w-full h-fit flex flex-col text-[12px] text-[#64748B] gap-[5px]">
                                    <div className="flex items-center gap-4   mb-2">
                                        <span className="flex items-center gap-1">
                                        <Calendar className="w-4 text-brandPurple h-4" />
                                        Fri, October 10
                                        </span>
                                        <span className="flex items-center gap-1">
                                        <Clock className="w-4 text-brandPurple h-4" />
                                            1:00 PM - 10:30 PM
                                        </span>
                                    {/*  {item.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 text-brandPurple h-4" />
                                            {item.location}
                                        </span>
                                        )} */}
                                    </div>
                                    <span className="flex items-center gap-1">
                                        <Mic className="w-4 text-brandPurple h-4" />
                                        Prof, Donald Ude
                                    </span>

                                </div>
                                <p className="text-[#64748B] text-[12px] leading-[16px] font-normal">
                                Lorem ipsum dolor sit amet consectetur. Massa rhoncus eget eu amet viverra fames sit lorem...         
                                </p>
                                 <CustomButton buttonText="Register" className="!h-[40px] mt-3 py-0 items-center" buttonColor=" bg-signin" />

                            </div>
                        ))
                    }
                
                </div>    
            </div>

        </div>
    )
}