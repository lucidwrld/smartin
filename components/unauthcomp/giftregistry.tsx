import { babycarrier, bookabooth, glo, logo, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"
import Link from "next/link"
import { formatAmount } from "@/utils/formatAmount"
import { useRouter } from "next/navigation"

export default function GiftRegistryTabManagement({giftDetails, currency}){ 
    const router = useRouter() 
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Gift Registry</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="w-full h-fit grid grid-cols-2 lg:grid-cols-3 gap-[6px]">
              { giftDetails?.map((el,l) => ( 
                  <div key={l} onClick={() => {router.push(el?.link)}} className="border-[1px] border-[#CDCDCD] cursor-pointer rounded-[6px] p-[4px] flex flex-col "> 
                    <div className="w-full h-[164px] bg-purple-100 rounded-[6px] flex items-center justify-center">
                        <span className="text-purple-600 text-[60px]">🎁</span>
                      </div>
                    <div className="w-full h-fit flex flex-col px-[3px] py-4 gap-[7px]">
                        <h1 className="text-[14px] leading-[18px] text-[#64748B] font-normal">
                            {el?.name}
                        </h1>
                        <p className="text-[20px] leading-[18px] text-backgroundPurple font-semibold">
                            {currency === 'NGN' ? '₦' : '$'}{Number(el?.price)?.toLocaleString()}
                        </p>

                    </div>

                </div> ))}

            </div>
            
             

        </div>
    )
}