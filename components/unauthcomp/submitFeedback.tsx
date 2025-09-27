import { babycarrier, bookabooth, fb1, fb2, fb3, fb4, fb5, glo, logo, profile, speaker } from "@/public/icons"
import { Award, Calendar, CheckCircle, ChevronLeft, ChevronRight, Clock, FileText, MapPin, Mic, Minus, Plus, Store } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import { Formik, Form, Field } from "formik"
import * as Yup from "yup"
import CustomButton from "../Button"
import InputWithFullBoarder from "../InputWithFullBoarder"
import UploadFileComponent from "../UploadFileComponent"
import { convertBytesToMB } from "@/utils/fileSize"
import useFileUpload from "@/utils/fileUploadController"
import { SubmitFeedbackManager } from "@/app/events/controllers/feedbacks/submitFeedbackController"
import ModalManagement from "../ModalManagement"
import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController"
import { toast } from "react-toastify"

// Validation schema
const validationSchema = Yup.object({
  rating: Yup.number().min(1, "Please select a rating").max(5).required("Rating is required"),
  comment: Yup.string().required("Comment is required"),
  designation: Yup.string(),
  company: Yup.string()
})

export default function FeedbackTabModal({ eventId,  }) {
  const images = [fb1, fb2, fb3, fb4, fb5]
  const [step, setStep] = useState(1)
  const event = eventId
  const attachmentRef = useRef(null)
  const [attachmentFile, setAttachmentFile] = useState(null)
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState([])
  const [inviteCode, setInviteCode] = useState("");
  const [codeToValidate, setCodeToValidate] = useState(""); 
  const [validationError, setValidationError] = useState("");
  const closeTotal = () => {
        setInviteCode("") 
        setCodeToValidate("")
        setStep(1)
        setValidationError("")
        document.getElementById("submit-feedbacks").close()

    }

  const { data: inviteData, isLoading: checkingCode, isSuccess: confirmed, error, isError, } =
        useGetInviteByCodeManager({
            code: codeToValidate,
            enabled: Boolean(codeToValidate && codeToValidate.trim().length > 0),  
        });  
    useEffect(() => {
        if(confirmed){
            setStep(2)
        }
        if(isError){
            toast.error("Invalid code")
            setValidationError("This invitation code is not valid for this event");
        }
    }, [confirmed, isError])  
      
    useEffect(() => {
        setInviteCode("") 
        setStep(1)
        setCodeToValidate("")
        setValidationError("")
        }, []);
    const validateInviteCode = async (e) => {
        if (e) {
        e.preventDefault();
        e.stopPropagation();
        }


        if (!inviteCode.trim()) {
        setValidationError("Please enter your invitation code");
        return;
        }

        setValidationError("");
        setCodeToValidate(inviteCode.trim()); 
    };      



  const { submitFeedback, isLoading: submitting, isSuccess } = SubmitFeedbackManager();
  
  useEffect(() => {
    if(isSuccess){
        closeTotal()
    }
  }, [isSuccess])
  const {
      progress,
      handleFileUpload,
      isLoading: uploadingFile,
    } = useFileUpload();  
  // Initial form values
  const initialValues = {
    event: event || "", 
    rating: 0,
    media: [],
    comment: "",
    invitee_code:"", 
    designation: "",
    company: ""
  }

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare the data in the expected backend format
      const formData = {
        event: values.event, 
        rating: values.rating, 
        invitee_code: inviteCode, 
        media: [],
        comment: values.comment,
        designation: values.designation,
        company: values.company
      }
      if (uploadedMediaUrls.length > 0) {
            const url = await handleFileUpload(uploadedMediaUrls);
            formData.media = [url];
        }

      submitFeedback(formData)
       
      
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Error submitting feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
 

  return (
    <ModalManagement id={"submit-feedbacks"} type={"medium"} className={""} title={"Feedback"} hasSpecFunc specialFunc={() => {closeTotal()}}>
        <div className="py-5">
            {
                step === 1 && 
                <div className="w-full h-fit flex flex-col gap-10">
                
                            <div className="space-y-4">
                            <p className="text-gray-600">
                                Please enter your invitation code to leave feedback for this
                                event.
                            </p>
                
                            <InputWithFullBoarder
                                label="Invitation Code"
                                value={inviteCode}
                                onChange={(e) => { 
                                    setInviteCode(e.target.value);
                                    // ✅ Clear validation error when user types
                                    if (validationError) {
                                        setValidationError("");
                                    }
                                } }
                                placeholder="Enter your invitation code"
                                isRequired
                                onKeyPress={(e) => {
                                    // Allow Enter key to trigger validation
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        validateInviteCode(e);
                                    }
                                } } id={undefined} form={undefined} tokens={undefined} checked={undefined} onClick={undefined} className={undefined} min={undefined} labelClass={undefined} labelColor={undefined} message={undefined} maxLength={undefined} minLength={undefined} hasSuffix={undefined} icon={undefined} accept={undefined} none={undefined} wrapperClassName={undefined} customValidator={undefined} customErrorMessage={undefined} errorProp={undefined} touchedProp={undefined}                          />
                
                            {validationError && (
                                <p className="text-red-500 text-sm">{validationError}</p>
                            )}
                
                            
                            </div>
                <div className="flex justify-end gap-3">
                     
                    <CustomButton
                        buttonText="Verify Code"
                        onClick={validateInviteCode}
                        isLoading={checkingCode}
                        radius="rounded-full"
                        className="bg-signin w-full"
                        disabled={!inviteCode.trim()}
                    />
                </div>            
            </div>
            }
            {
                step === 2 && 
                <div className="w-full h-fit  flex flex-col gap-[20px]">
                    
      
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, setFieldValue,  }) => (
                        <Form className="rounded-[6px]   flex flex-col items-center gap-5 border-[#CDCDCD] p-[23px]">
                            <div className="max-w-[437px] mt-10 h-fit flex flex-col items-center gap-[16px]">
                            <h1 className="text-[24px] leading-[120%] font-semibold">
                                Give us a feedback!
                            </h1>
                            <p className="max-w-[341px] text-center text-[16px] font-normal h-fit">
                                Your input is important for us. We take customer feedback very seriously.
                            </p>
                            
                            {/* Rating Selection */}
                            <div className="w-full h-fit flex mt-5 items-center justify-center gap-5">
                                {images.map((el, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setFieldValue('rating', index + 1)}
                                    className={`transition-all duration-200 ${
                                    values.rating >= index + 1 
                                        ? 'scale-110 opacity-100' 
                                        : 'scale-100 opacity-50 hover:opacity-75'
                                    }`}
                                >
                                    <Image 
                                    alt={`Rating ${index + 1}`} 
                                    src={el} 
                                    className="w-[30px] h-[30px] lg:w-[60px] lg:h-[60px]" 
                                    width={60} 
                                    height={60} 
                                    />
                                </button>
                                ))}
                            </div>
                            {errors.rating && touched.rating && (
                                <p className="text-red-500 text-sm">{errors.rating}</p>
                            )}
                            </div>

                            {/* Comment Field */}
                            <div className="w-full">
                            <Field name="comment">
                                {({ field }) => (
                                <InputWithFullBoarder
                                    {...field}
                                    wrapperClassName="w-full h-fit"
                                    row={100}
                                    isTextArea
                                    placeholder="Add comment"
                                    onChange={(e) => setFieldValue('comment', e.target.value)}
                                />
                                )}
                            </Field>
                            {errors.comment && touched.comment && (
                                <p className="text-red-500 text-sm mt-1">{errors?.comment}</p>
                            )}
                            </div>

                            {/* Optional Company Field */}
                            <div className="w-full">
                            <Field name="company">
                                {({ field }) => (
                                <InputWithFullBoarder
                                    {...field}
                                    wrapperClassName="w-full h-fit"
                                    placeholder="Company (optional)"
                                    onChange={(e) => setFieldValue('company', e.target.value)}
                                />
                                )}
                            </Field>
                            </div>

                            {/* Optional Designation Field */}
                            <div className="w-full">
                            <Field name="designation">
                                {({ field }) => (
                                <InputWithFullBoarder
                                    {...field}
                                    wrapperClassName="w-full h-fit"
                                    placeholder="Designation (optional)"
                                    onChange={(e) => setFieldValue('designation', e.target.value)}
                                />
                                )}
                            </Field>
                            </div>

                            {/* File Upload */}
                            <div className="w-full h-fit grid">
                            <UploadFileComponent
                                description="Upload your attachment"
                                inputRef={attachmentRef}
                                isLoading={false}
                                format="Image/PDF/Video"
                                maxSize={attachmentFile ? convertBytesToMB(attachmentFile.size) : "20"}
                                fileName={attachmentFile ? attachmentFile.name : null}
                                progress={null}
                                accept="video/*,application/pdf,image/*"
                                files={[]}
                                buttonClick={() => {
                                setAttachmentFile(null)  
                                }}
                                onChange={async (e) => {
                                const file = e.target.files[0]
                                if (file) {
                                    setAttachmentFile(file) 
                                }
                                }}
                            />
                            </div>

                            {/* Submit Button */}
                            <CustomButton
                            type="submit"
                            buttonText={submitting ? "Submitting..." : "Submit Feedback"}
                            className="!h-[40px] w-full mt-3 py-0 items-center"
                            buttonColor="bg-signin"
                            disabled={submitting}
                            progress={progress}
                            />
                        </Form>
                        )}
                    </Formik>
                </div> 
            }
        </div>
    </ModalManagement>
  )
}