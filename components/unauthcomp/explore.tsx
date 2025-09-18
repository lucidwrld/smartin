import { bookabooth, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"

export default function ExploreTabManagement(){
    const [selectedTab, setSelectedTab] = useState(0)
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Explore the Event</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="w-full h-fit rounded-[6px] bg-[#F2F2F2] p-[10px] gap-[10px] grid grid-cols-2">
                {
                    ["Gallery","Resources",].map((el,l) => (
                        <div key={l} onClick={() => {setSelectedTab(l)}} className={`cursor-pointer flex items-center justify-center ${l === selectedTab ? "bg-backgroundPurple text-white" : "bg-white text-[#1B1B1B]" } text-[14px] font-medium p-[10px] rounded-[4px]`} > 
                            {el}
                        </div>
                    ))
                }
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-light">Gallery</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="w-full grid grid-cols-3 gap-[5px]">
                    {
                        [...Array(9)].map((_,l) => (
                            <Image key={l} src={profile} width={undefined} height={undefined} alt="" className="rounded-[4px] object-cover w-full h-full" /> 
                        ))
                    }

                </div>  
                
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Resources</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="flex w-full flex-col h-fit gap-[9px]">
                    {
                       [...Array(3)].map((_,l) => (
                            <div key={l} className="border-[1px] w-full flex-shrink-0 flex  gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                               <div className="w-[112px] h-[112px] flex-shrink-0 bg-[#EEE2F8] rounded-[4px] flex justify-center items-center">
                                    <FileText size={50} color="#8D0BF0" />                            
                               </div>
                               <div className="w-full h-auto flex flex-col gap-3"> 
                                    <div className="w-full h-fit flex justify-between"> 
                                        <h1 className="text-[16px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                            Resources Name
                                        </h1>
                                        <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                            Premum
                                        </div>
                                    </div>
                                    
                                    <div className="w-full h-fit flex justify-between gap-3 items-center">
                                        <p className="text-[#64748B] text-[12px] font-light leading-[16px]">
                                            Pizza ipsum dolor meat lovers buffalo. Philly banana chicken sausage style lovers large beef mushrooms steak. Ham lasagna roll marinara ham pepperoni hand Chicago burnt. Rib ham melted deep olives pesto marinara Hawaiian and. Pizza ricotta cheese...
                                            </p>    
                                        <ChevronRight size={20} className=" flex-shrink-0 flex" />    
                                    </div>   
                                    
                               </div>
                            </div>
                        ))
                    }
                
                </div>    
            </div>
             

        </div>
    )
}