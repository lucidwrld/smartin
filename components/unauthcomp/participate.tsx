import { bookabooth, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"

export default function ParticipateTabManagement(){
    const [selectedTab, setSelectedTab] = useState(0)
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-light">Participate</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="w-full h-fit rounded-[6px] bg-[#F2F2F2] p-[10px] gap-[10px] grid grid-cols-3">
                {
                    ["Tickets","Book Ad Spot", "Book a Booth"].map((el,l) => (
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
                <div className="bg-[#FFF5FB] rounded-[10px] flex flex-col  w-full h-fit">
                    <div className="w-full h-fit border-b-[1px] border-backgroundPurple text-backgroundPurple text-[14px] leading-[16px] font-medium rounded-t-[10px] px-[14px] p-[12px] bg-[#F8EDFF]">
                        Hi there! Select your ticket type to continue:

                    </div>
                    <div className="flex flex-col px-[14px] py-[12px] w-full h-fit gap-[6px]">
                        <div className="w-full bg-white border-[1px] border-backgroundPurple rounded-[10px] py-[13px] px-[16px] flex gap-[10px]">
                            <CheckCircle size={18} color="#8D0BF0" />
                            <div className="w-full h-fit flex flex-col gap-[10px]">
                                <div className="w-full h-fit flex justify-between items-center">
                                    <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">Regular</h1>
                                    <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">N34,000</h1>

                                </div>
                                <div className="w-full h-fit flex gap-[10px]">
                                    <p className="text-[12px] leading-[16px] text-[#6F6F6F] font-normal">
                                        Pizza ipsum dolor meat lovers buffalo. Fresh deep olives ricotta black mozzarella white white. Banana spinach olives meatball white large ranch bbq thin fresh. Tossed mayo stuffed fresh NY pan hand thin. Pork thin onions deep stuffed rib meat extra wing. Pineapple lovers lasagna pesto tomato lot pesto bacon Philly pepperoni. 
                                    </p>
                                    <div className="w-fit h-auto   flex flex-col justify-between items-end">
                                        <ChevronRight size={16} />
                                        <div className="w-fit h-fit flex items-center gap-[10px]">
                                            <div className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]">
                                                <Minus size={16} />
                                            </div>
                                            <p className="text-[16px] leading-[16px] text-backgroundPurple font-medium">
                                                1
                                            </p>
                                            <div className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]">
                                                <Plus size={16} />
                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>
                        {
                        [...Array(2)].map((_,l) => (
                                <div key={l} className="w-full bg-[#FFEBEF] border-l-[3px] border-backgroundPurple rounded-[10px] py-[13px] px-[16px] flex gap-[10px]">
                                     
                                    <div className="w-full h-fit flex flex-col gap-[10px]">
                                        <div className="w-full h-fit flex justify-between items-center">
                                            <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">Regular</h1>
                                            <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">N34,000</h1>

                                        </div>
                                        <div className="w-full h-fit flex justify-between gap-[10px]">
                                            <p className="text-[12px] leading-[16px] text-[#6F6F6F] font-normal">
                                                Description of tickets
                                            </p>
                                            <div className="w-fit h-fit   flex  justify-between items-end">
                                                <p className="text-brandPurple text-[10px] leading-[16px]">0 tickets</p>
                                                <ChevronRight size={16} />
                                                 

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            ))
                        }
                    
                    </div> 
                    <div className="px-[14px] w-full">
                        <CustomButton buttonText="Get ticket" className="!h-[40px] w-full mt-3 py-0 items-center" buttonColor=" bg-signin" />
                    </div>  
                    
 
                </div>    
                
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Book Ad Spot</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="flex w-full flex-col h-fit gap-[9px]">
                    {
                       [...Array(3)].map((_,l) => (
                            <div key={l} className="border-[1px] w-full flex-shrink-0 flex flex-col-reverse lg:flex-row  gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                               <div className="lg:w-[187px] w-full h-[187px] flex-shrink-0 bg-brandPurple rounded-[4px] flex justify-center items-center">
                                    <Image src={speaker} alt="" width={60} height={60} />                                
                               </div>
                               <div className="w-full h-auto flex flex-col gap-3"> 
                                    <div className="w-full h-fit flex justify-end"> 
                                    
                                        <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                            Premum
                                        </div>
                                    </div>
                                    <h1 className="text-[20px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                            advert Space
                                        </h1>
                                    <div className="w-full h-fit flex justify-between items-center">
                                        <div className="w-fit h-fit flex flex-col gap-[7px] max-w-[196px] "> 
                                            <div className="w-full h-fit  text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple">
                                                    Format:
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    Banner
                                                </p>

                                            </div>
                                            <div className="w-full h-fit  text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple">
                                                    Dimention:
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    10x10 ft
                                                </p>

                                            </div>
                                            <div className="w-full h-fit  text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple">
                                                    Price: 
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    N30,000
                                                </p>

                                            </div>
                                            <div className="w-full h-fit  text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple">
                                                    Availability: 
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    10 slots 
                                                </p>

                                            </div>
                                        </div>
                                        <CustomButton buttonText="Book Now" className="!h-[40px] w-fit  py-0 items-center" buttonColor=" bg-signin" />

                                    </div>   
                                    <div className="w-full h-fit grid grid-cols-2 gap-2">
                                        <div className="w-full h-fit flex flex-col gap-[9px]">
                                            <p className="text-[10px] leading-[12px] text-backgroundPurple">Sale Period:</p>
                                            <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                                                <Calendar size={16} color="#8D0BF0" />
                                                Jan 5, 2025 – Jan 25, 2025
                                            </span>
                                        </div> 
                                        <div className="w-full h-fit flex flex-col gap-[9px]">
                                            <p className="text-[10px] leading-[12px] text-backgroundPurple">Order Limit:</p>
                                            <span className="text-[12px]  flex items-center gap-1 leading-[12px] text-[#64748B] font-normal">
                                                <Store size={16} color="#8D0BF0" />
                                                Min 1 – Max 5
                                            </span>
                                        </div> 
                                    </div> 
                               </div>
                            </div>
                        ))
                    }
                
                </div>    
            </div>
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Book a Booth</h1>
                
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>  
                <div className="flex w-full flex-col h-fit gap-[9px]">
                    {
                       [...Array(3)].map((_,l) => (
                            <div key={l} className="border-[1px] w-full flex-shrink-0 flex-col-reverse lg:flex-row  gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                               <Image src={bookabooth} alt="" width={undefined} height={undefined} className="rounded-[4px] w-full lg:w-[187px] h-[187px]" />   
                               <div className="w-full h-auto flex flex-col gap-3"> 
                                    <div className="w-full h-fit flex justify-end"> 
                                    
                                        <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                            Technology
                                        </div>
                                    </div>
                                    <h1 className="text-[20px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                            Tech Innovations Hub
                                        </h1>
                                    <div className="w-full h-fit flex justify-between items-center">
                                        <div className="w-fit h-fit flex flex-col gap-[7px] max-w-[196px] "> 
                                            <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple min-w-[68px]">
                                                    Size:
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    10x10 ft
                                                </p>

                                            </div>
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
                                                    Price: 
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    N30,000
                                                </p>

                                            </div>
                                            <div className="w-full h-fit  text-[12px] flex gap-[19px] leading-[12px] font-normal"> 
                                                <h1 className="text-brandPurple min-w-[68px]">
                                                    Availability: 
                                                </h1>
                                                <p className="text-[#64748B]">
                                                    10 slots 
                                                </p>

                                            </div>
                                        </div>
                                        <CustomButton buttonText="Book Now" className="!h-[40px] w-fit  py-0 items-center" buttonColor=" bg-signin" />

                                    </div>   
                                    <div className="w-full h-fit grid grid-cols-2 gap-2">
                                        <div className="w-full h-fit flex flex-col gap-[9px]">
                                            <p className="text-[10px] leading-[12px] text-backgroundPurple">Sale Period:</p>
                                            <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                                                <Calendar size={16} color="#8D0BF0" />
                                                Jan 5, 2025 – Jan 25, 2025
                                            </span>
                                        </div> 
                                        <div className="w-full h-fit flex flex-col gap-[9px]">
                                            <p className="text-[10px] leading-[12px] text-backgroundPurple">Order Limit:</p>
                                            <span className="text-[12px]  flex items-center gap-1 leading-[12px] text-[#64748B] font-normal">
                                                <Store size={16} color="#8D0BF0" />
                                                Min 1 – Max 5
                                            </span>
                                        </div> 
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