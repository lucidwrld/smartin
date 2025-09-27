"use client"
import useGetInviteByCodeManager from "@/app/events/controllers/getInviteByCodeController";
import { useEffect, useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";
import ModalManagement from "../ModalManagement";
import { toast } from "react-toastify";
import SessionRegistrationManager from "@/app/events/controllers/sessions/controllers/sessionRegistrationController";

export default function BookSession({selectedId,setSelectedId}){
     
    const [inviteCode, setInviteCode] = useState("");
    const [codeToValidate, setCodeToValidate] = useState(""); 
    const [validationError, setValidationError] = useState("");
    const closeTotal = () => {
        setInviteCode("")
        setSelectedId("")
        setCodeToValidate("")
        setValidationError("")
        document.getElementById("book-session").close()
    }
    const {registerForSession, isLoading: loading, isSuccess: registered} = SessionRegistrationManager(selectedId) 
    const { data: inviteData, isLoading: checkingCode, isSuccess, error, isError, } =
        useGetInviteByCodeManager({
          code: codeToValidate,
          enabled: Boolean(codeToValidate && codeToValidate.trim().length > 0),  
        });  
    useEffect(() => {
        if(isSuccess){
            registerForSession({"invitee_code": inviteCode})
        }
        if(isError){
            toast.error("Invalid code")
            setValidationError("This invitation code is not valid for this event");
        }
    }, [isSuccess, isError])  
    useEffect(() => {
        if(registered){
            closeTotal()
        }
    }, [registered])  
    useEffect(() => {
        setInviteCode("") 
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
    return(
         <ModalManagement className={""} hasSpecFunc specialFunc={() => {closeTotal()}} type={"medium"} id={"book-session"} title={"Book Session"}>
            <div className="w-full h-fit flex flex-col gap-10">
                
                            <div className="space-y-4">
                            <p className="text-gray-600">
                                Please enter your invitation code to be eligible to register for this
                                event session.
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
                        buttonText="Verify Code & Register"
                        onClick={validateInviteCode}
                        isLoading={loading || checkingCode}
                        radius="rounded-full"
                        className="bg-signin w-full"
                        disabled={!inviteCode.trim()}
                    />
                </div>            
            </div>
        </ModalManagement>
    )
}