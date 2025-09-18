import { bookabooth, glo, logo, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"

export default function CommunityTabManagement(){
    const [selectedTab, setSelectedTab] = useState(0)
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Community & Partners</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="w-full h-fit rounded-[6px] bg-[#F2F2F2] p-[10px] gap-[10px] grid grid-cols-3">
                {
                    ["Vendors","Sponsors","Media Partners",].map((el,l) => (
                        <div key={l} onClick={() => {setSelectedTab(l)}} className={`cursor-pointer flex items-center justify-center ${l === selectedTab ? "bg-backgroundPurple text-white" : "bg-white text-[#1B1B1B]" } text-[14px] font-medium p-[10px] rounded-[4px]`} > 
                            {el}
                        </div>
                    ))
                }
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-light">Vendors</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="w-full max-w-[530px] flex overflow-x-scroll scrollbar-hide gap-[5px]">
                    {
                        [...Array(4)].map((_,l) => (
                            <div className="w-[300px] gap-3 h-fit flex flex-col flex-shrink-0 border-[1px] py-[15px] px-[11px] rounded-[6px] border-[#CDCDCD]">
                                <div className="w-full h-fit flex justify-between">
                                    <div className="h-[59px] w-[59px] flex items-center justify-center rounded-[5px] bg-brandPurple"> 
                                        <Image alt="" src={logo} width={27} height={27} />
                                        </div> 
                                    <div className="w-fit p-[3px] rounded-[2px] h-fit bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                            Photography
                                        </div>    

                                </div>
                                <h1 className="text-[20px] leading-[16px] text-backgroundPurple font-medium">
                                    SMART INVITES LIMITED

                                </h1>
                                <div className="w-fit h-fit flex flex-col gap-[7px] max-w-[196px] "> 
                                    
                                    <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                        <h1 className="text-brandPurple min-w-[68px]">
                                            Location:
                                        </h1>
                                        <p className="text-[#64748B]">
                                            Main Hall - Corner
                                        </p>

                                    </div>
                                    <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                        <h1 className="text-brandPurple min-w-[68px]">
                                            Contact:
                                        </h1>
                                        <p className="text-[#64748B]">
                                            Ifeanyi Ejindu
                                        </p>

                                    </div>
                                    <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                        <h1 className="text-brandPurple min-w-[68px]">
                                            Email: 
                                        </h1>
                                        <p className="text-[#64748B]">
                                            ifeanyiejindu@gmail.com
                                        </p>

                                    </div>
                                    <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                        <h1 className="text-brandPurple min-w-[68px]">
                                            Phone: 
                                        </h1>
                                        <p className="text-[#64748B]">
                                            +2348068111435
                                        </p>

                                    </div>
                                </div>
                                <CustomButton buttonText="View Profile" className="!h-[40px] w-full mt-5  py-0 items-center" buttonColor=" bg-signin" />


                            </div>
                        ))
                    }

                </div>  
                
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Sponsors</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="w-full max-w-[530px] flex overflow-x-scroll scrollbar-hide gap-[5px]">
                    {
                        [...Array(4)].map((_,l) => (
                            <div className="w-[183px] gap-3 h-fit flex flex-col items-center flex-shrink-0 border-[1px] py-[15px] px-[11px] rounded-[6px] border-[#CDCDCD]">
                                <Image width={120} height={120} alt="" src={glo} /> 
                                <h1 className="text-[18px] leading-[16px] text-backgroundPurple font-medium">
                                    Globacom

                                </h1>
                                <p className="text-[12px] leading-[16px] font-normal cursor-pointer text-brandPurple">
                                    Visit Website
                                </p>
                                 

                            </div>
                        ))
                    }

                </div>  
                
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Media Partners</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="w-full max-w-[530px] flex overflow-x-scroll scrollbar-hide gap-[5px]">
                    {
                        [...Array(4)].map((_,l) => (
                            <div className="w-[183px] gap-3 h-fit flex flex-col items-center flex-shrink-0 border-[1px] py-[15px] px-[11px] rounded-[6px] border-[#CDCDCD]">
                                <Image width={120} height={120} alt="" src={glo} /> 
                                <h1 className="text-[18px] leading-[16px] text-backgroundPurple font-medium">
                                    Globacom

                                </h1>
                                <p className="text-[12px] leading-[16px] font-normal cursor-pointer text-brandPurple">
                                    Visit Website
                                </p>
                                 

                            </div>
                        ))
                    }

                </div>  
                
            </div>
             

        </div>
    )
}