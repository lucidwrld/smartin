"use client"
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";  
import { Switch } from "@mui/material";
import { Mail, Phone } from "lucide-react";

export default function TicketPage(){

    return(
        <div className="w-full min-h-dvh flex flex-col items-center px-5 py-10">
            <div className="max-w-[1220px] w-full flex flex-col gap-10 h-auto">
                <div className="w-full h-fit flex justify-between items-center">
                    <h2 className="text-[40px] leading-[55px] text-backgroundPurple font-light">
                        Ticket Checkout
                    </h2>

                </div>
                <div className="w-full flex flex-col lg:flex-row gap-[20px]">
                    <div className="max-w-[756px] p-[31px] flex flex-col w-full h-fit gap-[20px] border-[1px] border-[#CDCDCD] rounded-[6px] flex-shrink-0">
                        <div className="pb-[17px] border-b-[1px] border-[#CDCDCD] w-full h-fit">
                            <h2 className="text-backgroundPurple text-[25px] leading-[25px] font-light">
                                Your Information
                            </h2>

                        </div>
                        <div className="w-full grid grid-cols-2 gap-[20px]">
                            <InputWithFullBoarder label={"First Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                            <InputWithFullBoarder label={"Last Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                            <InputWithFullBoarder label={"Email"} labelColor={"text-backgroundPurple"} icon={<Mail color="#8D0BF0" size={18} />} hasSuffix={true} wrapperClassName={"col-span-2"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                            <InputWithFullBoarder label="Phone Number" labelColor={"text-backgroundPurple"} id="phone_number" placeholder="e.g. +1 for US, +44 for UK" wrapperClassName={"col-span-2"} type="tel" icon={<Phone color="#8D0BF0" size={18} />} hasSuffix={true}   className={"!border-backgroundPurple"} />
                        </div>
                        <div className="w-full h-fit flex mb-3 items-center justify-between gap-10">
                            <div className="w-fit h-fit flex flex-col gap-1">
                                <h1 className="lg:text-[20px] text-[16px] leading-[22px] lg:leading-[25px] font-light text-backgroundPurple">
                                    Send Tickets to different email addresses?
                                </h1>
                                <p className="text-[10px] leading-[14px] lg:text-[14px] lg:leading-[16px] font-normal text-[#94A3B8]">
                                    Leave blank to send tickets to the payment email.
                                </p>
                            </div>
                            <Switch    />

                        </div>
                        <div className="w-full h-fit flex flex-col gap-[18px]">
                            <h1 className="text-[20px] leading-[25px] font-medium text-backgroundPurple">
                                Attendee 1 - Regular
                            </h1>
                            <div className="w-full grid grid-cols-2 gap-[20px]">
                                <InputWithFullBoarder label={"First Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label={"Last Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label={"Email"} labelColor={"text-backgroundPurple"} icon={<Mail color="#8D0BF0" size={18} />} hasSuffix={true} wrapperClassName={"col-span-2"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label="Phone Number" labelColor={"text-backgroundPurple"} id="phone_number" placeholder="e.g. +1 for US, +44 for UK" wrapperClassName={"col-span-2"} type="tel" icon={<Phone color="#8D0BF0" size={18} />} hasSuffix={true}   className={"!border-backgroundPurple"} />
                            </div>
                        </div>
                        <div className="w-full h-fit flex flex-col gap-[18px]">
                            <h1 className="text-[20px] leading-[25px] font-medium text-backgroundPurple">
                                Attendee 2 - Regular
                            </h1>
                            <div className="w-full grid grid-cols-2 gap-[20px]">
                                <InputWithFullBoarder label={"First Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label={"Last Name"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label={"Email"} labelColor={"text-backgroundPurple"} icon={<Mail color="#8D0BF0" size={18} />} hasSuffix={true} wrapperClassName={"col-span-2"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                                <InputWithFullBoarder label="Phone Number" labelColor={"text-backgroundPurple"} id="phone_number" placeholder="e.g. +1 for US, +44 for UK" wrapperClassName={"col-span-2"} type="tel" icon={<Phone color="#8D0BF0" size={18} />} hasSuffix={true}   className={"!border-backgroundPurple"} />
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-fit flex-col border-[1px] bg-white border-[#CDCDCD] rounded-[6px]">
                        <div className="rounded-t-[6px] w-full p-[25px] h-fit bg-signin">
                            <h1 className="text-[25px] leading-[25px] font-light text-white">Summary</h1>
                        </div>
                        <div className="p-[25px] flex flex-col gap-10">
                            <div className="w-full h-fit flex flex-col gap-[10px]">
                                <div className="w-full h-fit flex justify-between items-center">
                                    <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-light">
                                        2 <span className="text-[12px] font-extralight">x</span> Regular 
                                    </h2> 
                                    <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-medium">
                                        N34,200
                                    </h2>

                                </div>
                                <div className="w-full h-fit flex justify-between items-center">
                                    <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-light">
                                        2 <span className="text-[12px] font-extralight">x</span> VIP 
                                    </h2> 
                                    <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-medium">
                                        N340,200
                                    </h2>

                                </div>

                            </div>
                            <div className="w-full flex gap-2   py-1 bg-[#F6F6F6] items-center h-[40px] rounded-[6px]">
                                <input type="text" placeholder="Enter coupon code here..." className="w-full h-auto bg-transparent outline-none border-none px-2 " />
                                <CustomButton buttonText="Apply"  buttonColor="bg-signin" className="!h-[36px] rounded-[4px]" />
                            </div>
                            <div className="w-full flex text-[15px] text-[#94A3B8] leading-[25px] font-normal flex-col gap-[10px] h-fit">
                                <div className="w-full h-fit flex justify-between">
                                    <p>Quantity</p>
                                    <p>4</p>
                                </div>
                                <div className="w-full h-fit flex justify-between">
                                    <p>Discount</p>
                                    <p>N0</p>
                                </div>
                                <div className="w-full h-fit flex justify-between">
                                    <p>Fees</p>
                                    <p>N0</p>
                                </div> 

                            </div>
                            <div className="w-full h-fit flex justify-between pt-5 border-t-[1px] border-[#CDCDCD] items-center">
                                    <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-light">
                                        Total
                                    </h2> 
                                    <h2 className="flex items-center gap-2 text-[25px] leading-[25px] text-backgroundPurple font-semibold">
                                        N180,200
                                    </h2>

                                </div>
                            <div className="w-full h-fit flex flex-col gap-5">
                                <div className="w-full h-fit flex gap-2 items-center">
                                    <input type="checkbox" className="w-[24px] h-[24px]" />
                                    <p className="text-[14px] leading-[16px] text-[#94A3B8] font-normal">
                                        I agree to the <span className="text-brandPurple cursor-pointer">Terms of Service</span> and <span className="text-brandPurple cursor-pointer">Privacy Policy</span> 
                                    </p>
                                </div>
                                <CustomButton buttonColor="bg-signin" className="rounded-[6px]" buttonText="Proceed to Payment" />
                            </div>    

                        </div>

                    </div>

                </div>

            </div>


        </div>
    )
}