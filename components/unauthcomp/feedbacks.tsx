import { babycarrier, bookabooth, fb1, fb2, fb3, fb4, fb5, glo, logo, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import CustomButton from "../Button"
import InputWithFullBoarder from "../InputWithFullBoarder"
import UploadFileComponent from "../UploadFileComponent"
import { convertBytesToMB } from "@/utils/fileSize"

export default function FeedbackTabManagement(){ 
    const images = [
        fb1,
        fb2,
        fb3,
        fb4,
        fb5
    ]
    const attachmentRef = useRef(null);
      const [attachmentFile, setAttachmentFile] = useState(null);
    return(
        <div className="w-full h-fit flex flex-col gap-[20px]">
            <div className="w-full flex flex-col gap-[13px] h-fit">
                <h1 className="text-[24px] leading-[16px] text-[#1B1B1B] font-normal">Feedbacks</h1>
                <div className="w-full h-[1px] bg-[#CDCDCD]">
                    </div>        
            </div>
            <div className="rounded-[6px] border-[1px] flex flex-col items-center gap-5 border-[#CDCDCD] p-[23px]">
                <div className="max-w-[437px] mt-10 h-fit flex flex-col items-center gap-[16px]">
                    <h1 className="text-[24px] leading-[120%] font-semibold">
                        Give us a feedback!
                    </h1>
                    <p className="max-w-[341px] text-center text-[16px] font-normal h-fit ">
                        Your input is important for us. We take customer feedback very seriously.
                        
                    </p>
                    <div className="w-full h-fit flex mt-5 items-center justify-center gap-5">
                        {
                            images.map((el,l) => (
                                <Image key={l} alt="" src={el} className="w-[30px] h-[30px] lg:w-[60px] lg:h-[60px]" width={undefined} height={undefined} />
                            ))
                        } 

                    </div>

                </div>
                <InputWithFullBoarder wrapperClassName={"w-full h-fit"} row={100} isTextArea placeholder={"Add comment"} />
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
                
                 <CustomButton buttonText="Submit Feedback" className="!h-[40px] w-full mt-3 py-0 items-center" buttonColor=" bg-signin" />
            </div> 
            
             

        </div>
    )
}