"use client"
import CustomButton from "@/components/Button"
import CommunityTabManagement from "@/components/unauthcomp/community"
import EventTabManagement from "@/components/unauthcomp/eventTab"
import ExploreTabManagement from "@/components/unauthcomp/explore"
import FeedbackTabManagement from "@/components/unauthcomp/feedbacks"
import GiftRegistryTabManagement from "@/components/unauthcomp/giftregistry"
import ParticipateTabManagement from "@/components/unauthcomp/participate"
import { facebook, greyPeople, instagram, locationPin, profile, testimage, timeIcon, x, youtube } from "@/public/icons"
import { logoMain1 } from "@/public/images"
import CountdownTimer from "@/utils/countdownTimer"
import { MoveRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa"

const cardBox = ({type,month,date, }) => {
    return (
        <div className="border-[1px] flex items-center w-fit min-w-[50px] h-[50px] flex-shrink-0 justify-center border-[#E2D1EE] rounded-[10px]">
            {
                (type === "date" || type === "dates") ? 
                    <div className="w-full h-full flex flex-col"> 
                        <div className="w-full text-backgroundPurple text-[10px] leading-[10px] font-medium flex items-center justify-center flex-shrink-0 h-[19px] bg-[#E2D1EE] rounded-t-[10px]"> 
                            {month}
                        </div>
                        <div className="w-full h-full flex text-[20px] px-[13px] leading-[25px] font-semibold text-backgroundPurple items-center   justify-center"> 
                                {date}
                        </div>

                    </div> :
                type === "location" ? 
                    <Image src={locationPin} width={25} height={25} alt="" /> :
                    <Image src={timeIcon} width={25} height={25} alt="" /> 
            }
        </div>
    )
}
export default function UnauthEvent(){
    const [selectedCh, setSelectedCh] = useState("about")
    return(
        <div className="w-full p-10 h-full flex gap-[28px]">
            <div className="w-full h-[calc(100dvh-80px)] border-r-[1px] border-[#CDCDCD] hidden lg:flex flex-col justify-between">
                <Image alt="" src={logoMain1} width={undefined} height={undefined} className="w-[168px] h-[27.65px]" />
                <div className="w-fit h-fit flex flex-col gap-[30px]">
                    {
                        ["About", "Overview", "Participate", "Explore", "Partners", "Gift Registry","Feedbacks"].map((el,l) => (
                            <p key={l} onClick={() => {setSelectedCh(el.toLocaleLowerCase())}} className={`text-[16px] cursor-pointer leading-[20px] font-normal ${el.toLocaleLowerCase() === selectedCh ? "text-backgroundPurple" : "text-[#94A3B8]"}`}>
                              {el}  
                            </p>
                        ))
                    }

                </div>
                <div className="w-fit h-fit flex flex-col max-w-[152px] gap-[5px]">
                    <span className="flex gap-2 items-center">Follow <MoveRight color="#69727D"/></span>
                    <div className="w-full h-fit flex justify-between gap-[7.24px]">
                        {
                            [
                                {link: "", icon: facebook},
                                {link: "", icon: instagram},
                                {link: "", icon: x},
                                {link: "", icon: youtube},
                            ].map((el,l) => (
                                <div key={l} className="w-[32px] h-[32px] cursor-pointer flex justify-center items-center rounded-full bg-backgroundPurple"> 
                                    <Image alt="" src={el.icon} width={undefined} height={undefined} className="w-[10.86px] h-[10.86px]" />
                                </div>
                            ))
                        }

                    </div>

                </div>
            </div>
            <div className="lg:max-w-[75%] flex-shrink-0 h-[calc(100dvh-80px)] flex flex-col gap-[20px] w-full overflow-y-scroll scrollbar-hide">
                <div className="w-full h-fit flex justify-end flex-shrink-0">
                    <div className="w-fit h-fit bg-signin text-[14px] font-medium text-white px-[10px] py-[5px] rounded-[50px]   flex-shrink-0"> 

                        Sign In
                    </div>
                </div>
                <div className="flex-shrink-0 flex flex-col lg:flex-row  w-full h-fit ">
                    {/* Left side */}
                    <div className="w-full flex-shrink-0 lg:sticky top-0 flex flex-col gap-[24px] h-fit max-w-[348px] ">
                        <div className="w-full rounded-[10px] h-[434px] bg-brandPurple">
                           <Image src={testimage} alt="" height={undefined} width={undefined} className="w-full h-full rounded-[10px] object-cover" /> 
                        </div>
                        <div className="w-full h-fit flex flex-col gap-[19px]">
                            <div className="w-full h-fit flex gap-[10px] items-center">
                                <Image src={profile} alt="" width={50} height={50} className="rounded-[10px] flex-shrink-0 object-cover" />
                                <div className="w-full h-fit flex flex-col gap-[6px]">
                                    <h3 className="text-[12px] leading-[12px] font-normal text-[#94A3B8]">Hosted by</h3>
                                    <p className="text-[16px] leading-[20px] font-medium text-[#1B1B1B]">
                                        Ifeanyi Ejindu
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-[1px] bg-[#CDCDCD]">
                            </div>  
                            <div className="flex flex-col gap-[9px] w-full h-fit">
                              <h3 className="text-[12px] leading-[12px] font-normal text-[#94A3B8]">About Host</h3>
                              <p className="text-[12px] leading-[16px] font-normal text-[#1B1B1B]">
                                Lorem ipsum dolor sit amet consectetur. Massa rhoncus eget eu amet viverra fames sit lorem. Tincidunt sollicitudin scelerisque nibh interdum. Scelerisque malesuada viverra vulputate cum duis. Nisl est dui tellus porttitor scelerisque tortor amet. Cursus duis in tortor libero egestas quis est. Id mi arcu sed mauris nulla. Condimentum massa aliquam egestas enim fames facilisi ut fermentum et. Sapien in sem fusce volutpat ante sed pharetra odio.
                                Metus volutpat adipiscing iaculis morbi sit sed. 
                              </p>
                            </div>  

                        </div>
                    </div>
                    {/* Right side */}
                    <div className="w-full flex flex-col lg:px-[58px] gap-[60px] h-full">
                        <div className="w-full h-fit flex flex-col">
                            <div className="w-full h-fit flex gap-[40px] flex-col">
                                <h1 className="text-backgroundPurple text-[48px] leading-[55px] font-semibold">
                                    TECH EVENT
                                </h1>
                                <div className="w-full h-fit grid gap-[19px] lg:grid-cols-2">
                                    {
                                        [
                                            {type: "date",date: "10",month: "oct", value: "Fri, October 10"},
                                            {type: "dates",date: "10 - 12",month: "oct", value: "Fri, October 10 -  Sun, October 12"},
                                            {type: "location", value: "Transcort Hilton Resort"},
                                            {type: "time", value: "1:00 PM - 10:30 PM"},
                                            {type: "time", value: "Different times"},
                                        ].map((el,l) => (
                                            <div key={l} className={`${l === 2 && "lg:col-span-2"} flex gap-[9px] items-center`}> 
                                               {cardBox({type: el.type, month:el.month, date:el.date })}  
                                               <div className="w-full h-fit flex flex-col gap-[6px]"> 
                                                    <p className="text-[#94A3B8] font-normal text-[12px] leading-[12px] capitalize">
                                                        {el.type}
                                                    </p>
                                                    <p className="text-[14px] leading-[16px] text-[#1B1B1B] capitalize font-medium">
                                                        {el.value}
                                                    </p>
                                                </div>           
                                            </div>
                                        ))
                                    }

                                </div>

                            </div>
                            {CountdownTimer({tarDate: new Date('2025-09-17T23:59:59').getTime()})}
                            <div className="w-full h-fit flex flex-col gap-[40px]">
                                <div className="w-full h-fit flex flex-col gap-[9px]">
                                    <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">
                                        Description
                                    </h1>
                                    <div className="w-full h-[1px] bg-[#CDCDCD]">

                                    </div>
                                    <p className="text-[12px] leading-[18px] font-normal text-[#1B1B1B]">
                                        Pizza ipsum dolor meat lovers buffalo. Tossed fresh spinach Chicago personal garlic ricotta ranch personal. Sauce extra ham beef tomato fresh. Garlic platter spinach string mouth. Broccoli roll dolor green pan green pizza pork crust pesto. Extra Chicago large pizza chicken fresh and mouth.... <span className="font-medium text-brandPurple">See more</span>
                                    </p>

                                </div>
                                <CustomButton buttonText="Register" buttonColor=" bg-signin" />

                            </div>

                        </div>
                        <EventTabManagement />
                        <ParticipateTabManagement />
                        <ExploreTabManagement />
                        <CommunityTabManagement />
                        <GiftRegistryTabManagement />
                        <FeedbackTabManagement />
                    </div>
                </div>
            </div>

        </div>
    )
}