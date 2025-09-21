"use client"
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import { BookUser, Calendar, Mail, Phone } from "lucide-react";
import CustomDropdown from "../../../components/CustomDropDown";
import UploadFileComponent from "@/components/UploadFileComponent";
import { useRef, useState } from "react";
import { convertBytesToMB } from "@/utils/fileSize";
import CustomButton from "@/components/Button";

export default function Register(){
const attachmentRef = useRef(null);
      const [attachmentFile, setAttachmentFile] = useState(null);
    return(
        <div className="w-full min-h-dvh py-5 px-5 flex flex-col items-center">
            <div className="bg-[#FFF5FB] rounded-[10px] flex flex-col w-full max-w-[624px] ">
                <div className="rounded-t-[10px] bg-[#F8EDFF] border-b-[1px] border-backgroundPurple py-[23px] px-[20px] flex flex-col gap-[10px]">
                    <h1 className="text-[18px] leading-[16px] font-medium text-backgroundPurple">
                        This the form you will for registration
                    </h1>
                    <div className="w-full h-fit flex gap-[10px]">
                        <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                            <Calendar size={16} color="#8D0BF0" />
                            Open: Fri, October 10
                        </span>
                        <div className="h-auto w-[1px] bg-[#64748B]">

                        </div>
                        <span className="text-[12px] leading-[12px] flex items-center gap-1 text-[#64748B] font-normal">
                            <Calendar size={16} color="#8D0BF0" />
                            Close: Fri, October 12
                        </span>

                    </div>

                </div>
                <div className="py-[23px] px-[20px] flex flex-col gap-[20px]">
                    <InputWithFullBoarder label={"Text Field"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                    <InputWithFullBoarder label={"Text Area"} labelColor={"text-backgroundPurple"} placeholder={"placeholder text"} className={"!border-backgroundPurple"} isTextArea />
                    <InputWithFullBoarder label={"Email"} labelColor={"text-backgroundPurple"} icon={<Mail color="#8D0BF0" size={18} />} hasSuffix={true} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                    <InputWithFullBoarder label="Phone Number" labelColor={"text-backgroundPurple"} id="phone_number" placeholder="e.g. +1 for US, +44 for UK" type="tel" icon={<Phone color="#8D0BF0" size={18} />} hasSuffix={true}   className={"!border-backgroundPurple"} />
                    <InputWithFullBoarder label={"Number"} labelColor={"text-backgroundPurple"} icon={<BookUser color="#8D0BF0" size={18} />} hasSuffix={true} placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                    <InputWithFullBoarder label={"Email"} labelColor={"text-backgroundPurple"} type="date"   placeholder={"placeholder text"} className={"!border-backgroundPurple"} />
                    <CustomDropdown title={"Dropdown"} wrapperClassname={"!text-backgroundPurple"} className={"bg-white !border-backgroundPurple"} options={["kjlds", "jkdsds"]} />
                    <div className="w-fit h-fit flex flex-col gap-[8px]">
                        <label className="text-backgroundPurple text-[14px] leading-[16px] font-normal">
                            Radio buttons
                        </label>
                        <div className="flex flex-col w-fit gap-[10px] p-[10px]">
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="radio" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 1
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="radio" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 2
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="radio" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 3
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="radio" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 4
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="w-fit h-fit flex flex-col gap-[8px]">
                        <label className="text-backgroundPurple text-[14px] leading-[16px] font-normal">
                            Checkboxes
                        </label>
                        <div className="flex flex-col w-fit gap-[10px] p-[10px]">
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="checkbox" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 1
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="checkbox" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 2
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="checkbox" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 3
                                </p>
                            </div>
                            <div className="w-fit h-fit flex gap-[11px] items-center">
                                <input type="checkbox" className="w-[24px] h-[24px] !text-[#8D0BF0]" />
                                <p className="text-[14px] leading-[16px] font-medium">
                                    Option 4
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="w-full h-fit grid">
                        <UploadFileComponent 
                            description={`Upload your attachment`}
                            inputRef={attachmentRef}
                            isLoading={false}
                            format={`Image/PDF/Video`}
                            maxSize={
                            attachmentFile ? convertBytesToMB(attachmentFile.size) : `20`
                            }
                            fileName={attachmentFile ? attachmentFile.name : null}
                            progress={null}
                            accept={"video/*,application/pdf,image/*"}
                            files={[]} 
                            buttonClick={() => setAttachmentFile(null)}
                            onChange={async (e) => {
                            const file = e.target.files[0];
                            setAttachmentFile(file);
                            }}
                        />
                    </div> 
                     <CustomButton buttonText="Register" className="!h-[40px] w-full mt-3 py-0 items-center" buttonColor=" bg-signin" />
                </div>
            </div>
        </div>
    )
}