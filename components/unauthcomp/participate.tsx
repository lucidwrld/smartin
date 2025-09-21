import { bookabooth, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"
import { getVisibleSections, shouldShowSection } from "@/utils/publicFilter"

export default function ParticipateTabManagement({participateData}){
    const [selectedTab, setSelectedTab] = useState(0)
    const [ticketQuantities, setTicketQuantities] = useState([]) // Track ticket quantities
    
    const tabConfig = {
        "Tickets": "tickets",
        "Book Ad Spot": "adverts", 
        "Book a Booth": "booths"
    };
     
    
    // Get visible tabs dynamically
    const visibleTabs = participateData ? getVisibleSections(participateData, tabConfig) : [];
    const showTabSection = participateData ? shouldShowSection(participateData, tabConfig) : false;
     
    if (!showTabSection || visibleTabs.length === 0) {
        return null;
    }
    
    // Reset selectedTab if current selection is not in visible tabs
    if (selectedTab >= visibleTabs.length) {
        setSelectedTab(0);
    }

    // Handle ticket quantity changes
    const updateTicketQuantity = (ticketId, change) => {
        setTicketQuantities(prev => {
            const existingTicketIndex = prev.findIndex(item => item.ticketId === ticketId);
            const ticket = participateData.tickets.find(t => t._id === ticketId);
            const maxQuantity = ticket?.max_per_order || 1;
            
            if (existingTicketIndex >= 0) {
                // Update existing ticket
                const currentQuantity = prev[existingTicketIndex].quantity;
                const newQuantity = Math.max(0, currentQuantity + change);
                const finalQuantity = Math.min(newQuantity, maxQuantity);
                
                if (finalQuantity === 0) {
                    // Remove ticket if quantity becomes 0
                    return prev.filter(item => item.ticketId !== ticketId);
                } else {
                    // Update quantity
                    return prev.map((item, index) => 
                        index === existingTicketIndex 
                            ? { ...item, quantity: finalQuantity }
                            : item
                    );
                }
            } else {
                // Add new ticket if change is positive
                if (change > 0) {
                    const newQuantity = Math.min(change, maxQuantity);
                    return [...prev, { ticketId, quantity: newQuantity }];
                }
                return prev;
            }
        });
    };

    const getTicketQuantity = (ticketId) => {
        const ticket = ticketQuantities.find(item => item.ticketId === ticketId);
        return ticket ? ticket.quantity : 0;
    };

    // Check if ticket is available for purchase
    const isTicketAvailable = (ticket) => {
        if (!ticket.is_active || ticket.sold_out) return false;
        if (ticket.quantity_remaining <= 0) return false;
        
        // Check if within sale period
        const now = new Date();
        const saleStart = new Date(ticket.sale_start_date);
        const saleEnd = new Date(ticket.sale_end_date);
        
        return now >= saleStart && now <= saleEnd;
    };

    const getTicketStatusText = (ticket) => {
        if (!ticket.is_active) return "Inactive";
        if (ticket.sold_out || ticket.quantity_remaining <= 0) return "Sold Out";
        
        const now = new Date();
        const saleStart = new Date(ticket.sale_start_date);
        const saleEnd = new Date(ticket.sale_end_date);
        
        if (now < saleStart) return "Sale Not Started";
        if (now > saleEnd) return "Sale Ended";
        
        return null;
    };

    const formatPrice = (ticket) => {
        if (ticket.is_free) return "Free";
        return `${ticket.currency === 'NGN' ? '₦' : '$'}${ticket.price.toLocaleString()}`;
    };

    const getCurrentTabData = () => {
        if (!participateData) return [];
        const currentTabKey = Object.values(tabConfig)[selectedTab];
        return participateData[currentTabKey] || [];
    };

    const getCurrentTabName = () => {
        return visibleTabs[selectedTab];
    };

    const renderTicketsSection = () => {
        const tickets = participateData.tickets || [];
        
        return (
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Tickets</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]"></div>  
                <div className="bg-[#FFF5FB] rounded-[10px] flex flex-col w-full h-fit">
                    <div className="w-full h-fit border-b-[1px] border-backgroundPurple text-backgroundPurple text-[14px] leading-[16px] font-medium rounded-t-[10px] px-[14px] p-[12px] bg-[#F8EDFF]">
                        Hi there! Select your ticket type to continue:
                    </div>
                    <div className="flex flex-col px-[14px] py-[12px] w-full h-fit gap-[6px]">
                        {tickets.map((ticket) => {
                            const quantity = getTicketQuantity(ticket._id);
                            const isAvailable = isTicketAvailable(ticket);
                            const statusText = getTicketStatusText(ticket);
                            const isSelected = quantity > 0;

                            if (isSelected) {
                                // Selected state - show with controls
                                return (
                                    <div key={ticket._id} className="w-full bg-white border-[1px] border-backgroundPurple rounded-[10px] py-[13px] px-[16px] flex gap-[10px]">
                                        <CheckCircle size={18} color="#8D0BF0" />
                                        <div className="w-full h-fit flex flex-col gap-[10px]">
                                            <div className="w-full h-fit flex justify-between items-center">
                                                <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">
                                                    {ticket.name}
                                                </h1>
                                                <h1 className="text-[16px] leading-[16px] text-backgroundPurple font-medium">
                                                    {formatPrice(ticket)}
                                                </h1>
                                            </div>
                                            <div className="w-full h-fit flex gap-[10px]">
                                                <p className="text-[12px] leading-[16px] text-[#6F6F6F] font-normal flex-1">
                                                    {ticket.description}
                                                </p>
                                                <div className="w-fit h-auto flex flex-col justify-between items-end">
                                                    <ChevronRight size={16} />
                                                    <div className="w-fit h-fit flex items-center gap-[10px]">
                                                        <div 
                                                            className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]"
                                                            onClick={() => updateTicketQuantity(ticket._id, -1)}
                                                        >
                                                            <Minus size={16} />
                                                        </div>
                                                        <p className="text-[16px] leading-[16px] text-backgroundPurple font-medium">
                                                            {quantity}
                                                        </p>
                                                        <div 
                                                            className="cursor-pointer flex items-center justify-center bg-[#FFF0F7] w-[26px] h-[26px] rounded-[30px]"
                                                            onClick={() => updateTicketQuantity(ticket._id, 1)}
                                                        >
                                                            <Plus size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // Unselected state
                                return (
                                    <div 
                                        key={ticket._id} 
                                        className={`w-full rounded-[10px] py-[13px] px-[16px] flex gap-[10px] cursor-pointer
                                            ${!isAvailable ? 'bg-gray-100 opacity-60' : 'bg-[#FFEBEF] border-l-[3px] border-backgroundPurple hover:bg-[#FFE1E7]'}
                                        `}
                                        onClick={() => isAvailable && updateTicketQuantity(ticket._id, 1)}
                                    >
                                        <div className="w-full h-fit flex flex-col gap-[10px]">
                                            <div className="w-full h-fit flex justify-between items-center">
                                                <h1 className={`text-[16px] leading-[16px] font-medium ${!isAvailable ? 'text-gray-400' : 'text-backgroundPurple'}`}>
                                                    {ticket.name}
                                                    {ticket.category && (
                                                        <span className="ml-2 text-[10px] bg-[#F5E7FF] text-backgroundPurple px-2 py-1 rounded">
                                                            {ticket.category.name}
                                                        </span>
                                                    )}
                                                </h1>
                                                <h1 className={`text-[16px] leading-[16px] font-medium ${!isAvailable ? 'text-gray-400' : 'text-backgroundPurple'}`}>
                                                    {formatPrice(ticket)}
                                                </h1>
                                            </div>
                                            <div className="w-full h-fit flex justify-between gap-[10px]">
                                                <p className={`text-[12px] leading-[16px] font-normal flex-1 ${!isAvailable ? 'text-gray-400' : 'text-[#6F6F6F]'}`}>
                                                    {ticket.description}
                                                </p>
                                                <div className="w-fit h-fit flex items-center gap-2">
                                                    {statusText ? (
                                                        <p className="text-red-500 text-[10px] leading-[16px] font-medium">
                                                            {statusText}
                                                        </p>
                                                    ) : (
                                                        <p className="text-green-600 text-[10px] leading-[16px]">
                                                            {ticket.quantity_remaining} available
                                                        </p>
                                                    )}
                                                    <ChevronRight size={16} className={!isAvailable ? 'text-gray-400' : ''} />
                                                </div>
                                            </div>
                                            {isAvailable && (
                                                <div className="text-[10px] text-gray-500 flex gap-4">
                                                    <span>Min: {ticket.min_per_order}</span>
                                                    <span>Max: {ticket.max_per_order}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            }
                        })}
                    </div>
                    {Object.values(ticketQuantities).some(qty => qty.quantity > 0) && (
                        <div className="px-[14px] w-full pb-[14px]">
                            <CustomButton 
                                buttonText="Get tickets" 
                                className="!h-[40px] w-full py-0 items-center" 
                                buttonColor="bg-signin" 
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderAdvertsSection = () => {
        const adverts = participateData.adverts || [];
        
        return (
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Book Ad Spot</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]"></div>
                <div className="flex w-full flex-col h-fit gap-[9px]">
                    {adverts.length > 0 ? adverts.map((advert, index) => (
                        <div key={index} className="border-[1px] w-full flex-shrink-0 flex flex-col-reverse lg:flex-row gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                            <div className="lg:w-[147px] w-full h-[187px] flex-shrink-0 bg-brandPurple rounded-[4px] flex justify-center items-center">
                                <Image src={speaker} alt="" width={60} height={60} />
                            </div>
                            <div className="w-full h-auto flex flex-col gap-3">
                                <div className="w-full h-fit flex justify-end">
                                    <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                        {advert.category?.name}
                                    </div>
                                </div>
                                <h1 className="text-[20px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                    {advert.name || "Advert Space"}
                                </h1>
                                <div className="w-full h-fit flex justify-between items-center">
                                    <div className="w-fit h-fit flex flex-col gap-[7px] max-w-[196px]">
                                        <div className="w-full h-fit text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple">Format:</h1>
                                            <p className="text-[#64748B]">{advert.format || "Banner"}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple">Dimension:</h1>
                                            <p className="text-[#64748B]">{advert.dimensions || "10x10 ft"}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple">Price:</h1>
                                            <p className="text-[#64748B]">{advert.currency === 'NGN' ? '₦' : '$'}{advert.price?.toLocaleString()}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] grid grid-cols-2 gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple">Availability:</h1>
                                            <p className="text-[#64748B]">{advert.quantity_remaining || advert.quantity} slots</p>
                                        </div>
                                    </div>
                                    <CustomButton 
                                        buttonText="Book Now" 
                                        className="!h-[40px] w-fit py-0 items-center" 
                                        buttonColor="bg-signin" 
                                    />
                                </div>
                                <div className="w-full h-fit grid grid-cols-2 gap-2">
                                    <div className="w-full h-fit flex flex-col gap-[9px]">
                                        <p className="text-[10px] leading-[12px] text-backgroundPurple">Sale Period:</p>
                                        <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                                            <Calendar size={16} color="#8D0BF0" />
                                            {advert.sale_start_date && advert.sale_end_date ? 
                                                `${new Date(advert.sale_start_date).toLocaleDateString()} – ${new Date(advert.sale_end_date).toLocaleDateString()}` :
                                                "Jan 5, 2025 – Jan 25, 2025"
                                            }
                                        </span>
                                    </div>
                                    <div className="w-full h-fit flex flex-col gap-[9px]">
                                        <p className="text-[10px] leading-[12px] text-backgroundPurple">Order Limit:</p>
                                        <span className="text-[12px] flex items-center gap-1 leading-[12px] text-[#64748B] font-normal">
                                            <Store size={16} color="#8D0BF0" />
                                            Min {advert.min_per_order || 1} – Max {advert.max_per_order || 5}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500">
                            No advertisement spots available at this time.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderBoothsSection = () => {
        const booths = participateData.booths || [];
        
        return (
            <div className="w-full h-fit flex flex-col gap-[10px]">
                <h1 className="text-[16px] leading-[16px] text-[#1B1B1B] font-normal">Book a Booth</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]"></div>
                <div className="flex w-full flex-col h-fit gap-[9px]">
                    {booths.length > 0 ? booths.map((booth, index) => (
                        <div key={index} className="border-[1px] w-full flex-shrink-0 flex flex-col-reverse lg:flex-row gap-[15px] border-[#CDCDCD] rounded-[6px] p-[7px]">
                            <Image 
                                src={booth.image || bookabooth} 
                                alt="" 
                                width={undefined} 
                                height={undefined} 
                                className="rounded-[4px] w-full lg:w-[147px] object-cover h-[187px]" 
                            />
                            <div className="w-full h-auto flex flex-col gap-3">
                                <div className="w-full h-fit flex justify-end">
                                    <div className="w-fit p-[3px] rounded-[2px] bg-[#F5E7FF] text-[10px] font-medium leading-[10px] text-backgroundPurple">
                                        {booth.category?.name || "Technology"}
                                    </div>
                                </div>
                                <h1 className="text-[20px] capitalize leading-[16px] font-medium text-backgroundPurple">
                                    {booth.name || "Tech Innovations Hub"}
                                </h1>
                                <div className="w-full h-fit flex justify-between items-center">
                                    <div className="w-fit h-fit flex flex-col gap-[7px] max-w-[196px]">
                                        <div className="w-full h-fit text-[12px] flex gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple min-w-[68px]">Size:</h1>
                                            <p className="text-[#64748B]">{booth.size || "10x10 ft"}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] flex gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple min-w-[68px]">Location:</h1>
                                            <p className="text-[#64748B]">{booth.location || "Main Hall - Corner"}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] flex gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple min-w-[68px]">Price:</h1>
                                            <p className="text-[#64748B]">{booth.currency === 'NGN' ? '₦' : '$'}{booth.price?.toLocaleString()}</p>
                                        </div>
                                        <div className="w-full h-fit text-[12px] flex gap-[19px] leading-[12px] font-normal">
                                            <h1 className="text-brandPurple min-w-[68px]">Availability:</h1>
                                            <p className="text-[#64748B]">{booth.quantity_remaining || booth.quantity} slots</p>
                                        </div>
                                    </div>
                                    <CustomButton 
                                        buttonText="Book Now" 
                                        className="!h-[40px] w-fit py-0 items-center" 
                                        buttonColor="bg-signin" 
                                    />
                                </div>
                                <div className="w-full h-fit grid grid-cols-2 gap-2">
                                    <div className="w-full h-fit flex flex-col gap-[9px]">
                                        <p className="text-[10px] leading-[12px] text-backgroundPurple">Sale Period:</p>
                                        <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                                            <Calendar size={16} color="#8D0BF0" />
                                            {booth.sale_start_date && booth.sale_end_date ? 
                                                `${new Date(booth.sale_start_date).toLocaleDateString()} – ${new Date(booth.sale_end_date).toLocaleDateString()}` :
                                                "Jan 5, 2025 – Jan 25, 2025"
                                            }
                                        </span>
                                    </div>
                                    <div className="w-full h-fit flex flex-col gap-[9px]">
                                        <p className="text-[10px] leading-[12px] text-backgroundPurple">Order Limit:</p>
                                        <span className="text-[12px] flex items-center gap-1 leading-[12px] text-[#64748B] font-normal">
                                            <Store size={16} color="#8D0BF0" />
                                            Min {booth.min_per_order || 1} – Max {booth.max_per_order || 5}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-8 text-gray-500">
                            No booth spaces available at this time.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-light">Participate</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]"></div>        
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

            {/* Render content based on selected tab */}
            {getCurrentTabName() === 'Tickets' && renderTicketsSection()}
            {getCurrentTabName() === 'Book Ad Spot' && renderAdvertsSection()}
            {getCurrentTabName() === 'Book a Booth' && renderBoothsSection()}
        </div>
    )
}