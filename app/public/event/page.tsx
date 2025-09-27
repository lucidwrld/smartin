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
import { MoveRight, Pause, Play, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FaArrowRight } from "react-icons/fa" 
import useGetSingleEventPublicManager from "@/app/events/controllers/getSingleEventPublicController" 
import Loader from "@/components/Loader"
import { DescriptionWithSeeMore } from "@/utils/seemoreFunc"
import { useGetEventTicketsManager } from "@/app/tickets/controllers/ticketController"
import { useGetEventAdvertsManager } from "@/app/adverts/controllers/advertController"
import { useGetEventBoothsManager } from "@/app/booths/controllers/boothController"
import GetEventFormsMetadataManager from "@/app/events/controllers/forms/getEventFormsMetadataController" 
import RegistrationForm from "@/components/register/registerForm"
import { useProgram } from "@/context/programContext"


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
    const [participateData, setParticipateData] = useState({})
    const {setSelectedEventId} = useProgram()
    const [showRegistrationForms, setShowRegistrationForms] = useState(false);
    const [currentFormIndex, setCurrentFormIndex] = useState(0);
    const { data: event, isLoading , refetch} = useGetSingleEventPublicManager({ eventId: "68bad3fcfc8371001b2b0135", enabled: true });
    const { data: formsMetadata, isLoading: isFormsMetadataLoading } =
        GetEventFormsMetadataManager({
          eventId: "68bad3fcfc8371001b2b0135",
          enabled: true,
        });   
    useEffect(() => {
            setSelectedEventId("68bad3fcfc8371001b2b0135")
    }, [])    
    const hasRequiredForms = formsMetadata?.data?.hasRequiredForms || false;
    const requiredForms = formsMetadata?.data?.requiredForms || [];
    const [selectedCh, setSelectedCh] = useState("about")
    const eventDetails = event?.data 
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef(null); 
    const handleRegisterClick = () => {
    if (hasRequiredForms && requiredForms.length > 0) {
      setShowRegistrationForms(true);
      setCurrentFormIndex(0);
    }
  };
   
    const togglePlay = () => {
        if (videoRef.current) {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
        }
    };
    
    const {
    data: ticketsData,
    isLoading: loadingTickets,
    refetch: refetchTickets,
    } = useGetEventTicketsManager("68bad3fcfc8371001b2b0135");

    const {
    data: advertsData,
    isLoading: loadingAdverts,
    refetch: refetchAdverts,
    } = useGetEventAdvertsManager("68bad3fcfc8371001b2b0135");

    const {
    data: boothsData,
    isLoading: loadingBooths,
    refetch: refetchBooths,
    } = useGetEventBoothsManager("68bad3fcfc8371001b2b0135");

    useEffect(() => {
    // Only update if we have at least some data
    if (ticketsData || advertsData || boothsData) {
        setParticipateData(prevState => ({
        ...prevState,
        tickets: ticketsData?.data,
        adverts: advertsData?.data,
        booths: boothsData?.data
        }));
    }
    }, [ticketsData, advertsData, boothsData]);
    
    function processEventDays(eventData) {
        const eventDays = eventData.event_days;
        const venue = eventData.venue;
        
        if (!eventDays || eventDays.length === 0) {
            return [
                {type: "dates", date: "", month: "", value: "No date set"},
                {type: "location", value: venue},
                {type: "time", value: "No time set"}
            ];
        }
        
        if (eventDays.length === 1) {
            // Single day event
            const eventDay = eventDays[0];
            const date = new Date(eventDay.date);
            const day = date.getDate();
            const month = date.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
            const fullMonth = date.toLocaleDateString('en-US', { month: 'long' });
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            // Format time from 24-hour to 12-hour
            const [hours, minutes] = eventDay.time.split(':');
            const timeObj = new Date();
            timeObj.setHours(parseInt(hours), parseInt(minutes));
            const formattedTime = timeObj.toLocaleTimeString('en-US', { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            
            return [
                {
                    type: "dates",
                    date: day.toString(),
                    month: month,
                    value: `${dayOfWeek}, ${fullMonth} ${day}`
                },
                {
                    type: "location", 
                    value: venue
                },
                {
                    type: "time", 
                    value: formattedTime
                }
            ];
        } else {
            // Multiple days event
            const startDate = new Date(eventDays[0].date);
            const endDate = new Date(eventDays[eventDays.length - 1].date);
            
            const startDay = startDate.getDate();
            const endDay = endDate.getDate();
            const month = startDate.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
            const fullStartMonth = startDate.toLocaleDateString('en-US', { month: 'long' });
            const fullEndMonth = endDate.toLocaleDateString('en-US', { month: 'long' });
            const startDayOfWeek = startDate.toLocaleDateString('en-US', { weekday: 'short' });
            const endDayOfWeek = endDate.toLocaleDateString('en-US', { weekday: 'short' });
            
            return [
                {
                    type: "dates",
                    date: `${startDay} - ${endDay}`,
                    month: month,
                    value: startDate.getMonth() === endDate.getMonth() 
                        ? `${startDayOfWeek}, ${fullStartMonth} ${startDay} - ${endDayOfWeek}, ${fullEndMonth} ${endDay}`
                        : `${startDayOfWeek}, ${fullStartMonth} ${startDay} - ${endDayOfWeek}, ${fullEndMonth} ${endDay}`
                },
                {
                    type: "location", 
                    value: venue
                },
                {
                    type: "time", 
                    value: "Different times"
                }
            ];
        }
    }
    const themeClasses = {
    bg: "bg-gray-50",
    text:  "text-gray-900",
    card: "bg-signin",
    cardBorder: "border-gray-200",
    cardHover:  "hover:border-gray-300",
    nav:  "bg-white/95",
    navBorder: "border-gray-200",
    accent:  "text-white/50",
    sectionBg:  "bg-gray-100/50",
  };

    
    if(isLoading || loadingTickets || loadingAdverts || loadingBooths){
        return <Loader />
    }
    
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
                <div className="flex-shrink-0 flex flex-col lg:flex-row gap-10 lg:gap-0  w-full h-fit ">
                    {/* Left side */}
                    <div className="w-full flex-shrink-0 lg:sticky top-0 flex flex-col gap-[24px] h-fit max-w-[348px] ">
                        <div 
                        className="relative w-full rounded-[10px] h-[434px] bg-purple-600 overflow-hidden cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={togglePlay}
                        >
                        <video
                            ref={videoRef}
                            className="w-full h-full rounded-[10px] object-cover"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        >
                            <source src={eventDetails?.video} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        
                        {/* Play/Pause Button - appears on hover */}
                        {(isHovered || !isPlaying) && (
                            <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black  bg-opacity-80 rounded-full p-4 transition-all duration-200 hover:bg-opacity-70">
                                {isPlaying ? (
                                <Pause className="w-8 h-8 text-[#8d0bf0]" />
                                ) : (
                                <Play className="w-8 h-8 text-[#8d0bf0] ml-1" />
                                )}
                            </div>
                            </div>
                        )}
                        </div> 
                        <div className="w-full h-fit flex flex-col gap-[19px]">
                            <div className="w-full h-fit flex gap-[10px] items-center">
                                <Image src={eventDetails?.hosts?.[0]?.profile_image} alt="" width={50} height={50} className="rounded-[10px] flex-shrink-0 object-cover" />
                                <div className="w-full h-fit flex flex-col gap-[6px]">
                                    <h3 className="text-[12px] leading-[12px] font-normal text-[#94A3B8]">Hosted by</h3>
                                    <p className="text-[16px] leading-[20px] font-medium text-[#1B1B1B]">
                                        {eventDetails?.hosts?.[0]?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-[1px] bg-[#CDCDCD]">
                            </div>  
                            <div className="flex flex-col gap-[9px] w-full h-fit">
                              <h3 className="text-[12px] leading-[12px] font-normal text-[#94A3B8]">About Host</h3>
                              <p className="text-[12px] leading-[16px] font-normal text-[#1B1B1B]">
                                {eventDetails?.hosts?.[0]?.description} 
                              </p>
                            </div>  

                        </div>
                        {eventDetails?.donation &&
                            (eventDetails.donation.account_name ||
                                eventDetails.donation.bank_name ||
                                eventDetails.donation.account_number) && (
                                <div className="lg:col-span-1">
                                <h3 className="text-2xl text-backgroundPurple font-bold mb-6">
                                    Direct Contribution
                                </h3>
                                <div
                                    className={`${themeClasses.card} border ${themeClasses.cardBorder} rounded-lg p-6 sticky top-24`}
                                >
                                    <h4 className="font-semibold mb-4 text-white">Account Details</h4>
                                    <div className="space-y-4 text-white text-sm">
                                    <div>
                                        <span
                                        className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                                        >
                                        Bank Name
                                        </span>
                                        <span className="font-medium">
                                        {eventDetails?.donation?.bank_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span
                                        className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                                        >
                                        Account Name
                                        </span>
                                        <span className="font-medium">
                                        {eventDetails?.donation?.account_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span
                                        className={`block ${themeClasses.accent} text-xs uppercase tracking-wide mb-1`}
                                        >
                                        Account Number
                                        </span>
                                        <span className="font-medium font-mono">
                                        {eventDetails?.donation?.account_number}
                                        </span>
                                    </div>
                                     
                                    </div>
            
                                    
                                </div>
                                </div>
                            )}
                    </div>
                    {/* Right side */}
                    <div className="w-full flex flex-col lg:px-[58px] gap-[60px] h-full">
                        <div className="w-full h-fit flex flex-col">
                            <div className="w-full h-fit flex gap-[40px] flex-col">
                                <h1 className="text-backgroundPurple text-[48px] leading-[55px] font-semibold">
                                    {eventDetails?.name}
                                </h1>
                                <div className="w-full h-fit grid gap-[19px] lg:grid-cols-2">
                                    {
                                        processEventDays(eventDetails).map((el,l) => (
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
                            <CountdownTimer tarDate={new Date(`${eventDetails?.event_days?.[0]?.date?.split('T')[0]}T${eventDetails?.event_days?.[0]?.time}:00.000Z`).getTime()} />
                            <div className="w-full h-fit flex flex-col gap-[40px]">
                                <div className="w-full h-fit flex flex-col gap-[9px]">
                                    <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">
                                        Description
                                    </h1>
                                    <div className="w-full h-[1px] bg-[#CDCDCD]">

                                    </div>
                                    <DescriptionWithSeeMore description={eventDetails.description} /> 

                                </div>
                              {hasRequiredForms &&  <CustomButton onClick={() => {handleRegisterClick()}} buttonText="Register" buttonColor=" bg-signin" />}

                            </div>

                        </div>
                        <EventTabManagement eventDetails={eventDetails} />
                        <ParticipateTabManagement participateData={participateData} currency={eventDetails?.currency} />
                        <ExploreTabManagement eventDetails={eventDetails}/>
                        <CommunityTabManagement eventDetails={eventDetails} />
                        {eventDetails?.items.length > 0 && <GiftRegistryTabManagement currency={eventDetails?.currency} giftDetails={eventDetails?.items} />}
                        <FeedbackTabManagement eventDetails={eventDetails} />
                    </div>
                </div>
            </div>
        {showRegistrationForms && (
                <RegistrationForm 
                requiredForms={requiredForms} 
                eventId={""}
                currentFormIndex={currentFormIndex} 
                setCurrentFormIndex={setCurrentFormIndex} 
                showRegistrationForms={showRegistrationForms} 
                setShowRegistrationForms={setShowRegistrationForms} 
            />
        )}                            
        </div>
    )
}