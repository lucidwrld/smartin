"use client";

import CustomButton from "@/components/Button";
import CustomDropdown from "@/components/CustomDropDown";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Loader from "@/components/Loader";
import UploadFileComponent from "@/components/UploadFileComponent";
import AuthShell from "@/components/auth/AuthShell";
import useGetCategoriesManager from "@/app/admin/categories/controllers/getCategoriesController";
import { convertBytesToMB } from "@/utils/fileSize";
import useFileUpload from "@/utils/fileUploadController";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OTPInput from "react-otp-input";
import { ConsultantApplicationManagement } from "./controller/consultant_application";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "react-toastify";
import { camera } from "@/public/icons";
import GlobalVariables from "@/utils/GlobalVariables";
import ConsultantTermsModal from "@/components/ConsultantTermsModal";

const ConsultantApplicationPage = () => {
  const router = useRouter();
  
  const [agreedToTerms, setAgreedToTerms] = useState(false); 
  const picRef = useRef(null);
  const [picFile, setPicFile] = useState(null);
  const resumeRef = useRef();
  const certRed = useRef();
  const [categoriesOptimized, setCategoryOpimized] = useState([
    {
      title: "Select your industry",
      id: "",
    },
  ]);
  const [subcategories, setSubCategories] = useState([
    {
      title: "Select your category(ies)",
      id: "",
    },
  ])
  const [accountType, setAccountType] = useState("Client");

  const initialData = {
    linkedin: "",
    experience: "",
    picture: "",
    categories: [],
    certificates: [],
    resume: "",
    comment: "",
  };

  const [formData, setFormData] = useState(initialData);
  const { data: categories, isLoading: fetchingCategories } =
    useGetCategoriesManager();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const accountType = localStorage.getItem("accountType");
      
      setAccountType(accountType);
    }
  }, []);

  useEffect(() => {
    if (categories) {
      setCategoryOpimized([
        ...categoriesOptimized,
        ...categories?.data?.categories.map((el) => ({
          title: el?.title,
          id: el?.id,
        })),
      ]);
    }
  }, [categories]);

  const [resumeFile, setResumeFile] = useState(null);
  const [certFiles, setCertFiles] = useState([]);
  const [uploadingResume, setUploadingResume] = useState(null);
  const [uploadingCerts, setUploadingCerts] = useState(null);
  const {
    progress,
    handleFileUpload, 
     
    isLoading: uploadingFile,
  } = useFileUpload();
  const { apply, isLoading, isSuccess, data } =
    ConsultantApplicationManagement(); 
  const validateForm = () => {
    // const { linkedin, experience, categories, resume, other } = formData;
    if (
      !formData.linkedin ||
      !formData.experience ||
      formData.categories.length === 0 ||
      !resumeFile ||
      !picFile ||
      !formData.comment 
       
    ) {
      toast.error("Please fill in all fields, ensure you have uploaded a profile picture and select at least one category.");

      return false;
    }
    return true;
  };
  const removeFromArrayyClick = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      categories: prevFormData.categories.filter((_, i) => i !== index),
    }));
  }; 

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("confirmation").showModal();
    }
  }, [isSuccess]);


  if (fetchingCategories) {
    return <Loader />;
  }

  return (
    <AuthShell
      title={`Other Information`}
      progress={progress}
      isLoading={isLoading || uploadingFile}
      onClick={async () => {
        if (!validateForm()) {
          return;
        }
        const updatedFormData = { ...formData };

        updatedFormData.categories = formData.categories.map((el) => el.id);
        if (picFile) {
           
          const profileUrl = await handleFileUpload(picFile);
          updatedFormData.picture = profileUrl; 
        }
        if (resumeFile) {
          setUploadingResume(true);
          const resumeUrl = await handleFileUpload(resumeFile);
          updatedFormData.resume = resumeUrl;
          setUploadingResume(false);
        }

        if (certFiles.length > 0) {
          const fileUrls = [];
          setCertFiles(true);
          for (let i = 0; i < certFiles.length; i++) {
            const url = await handleFileUpload(certFiles[i]);
            fileUrls.push(url);
          }
          updatedFormData.certificates = fileUrls;
          setCertFiles(false);
        } 
         if(agreedToTerms){
          await apply(updatedFormData);  
         }else{toast.error("Agree to terms and conditions")}
      }}
      buttonText={`Submit`}
    >
      {accountType === "Consultant" && (
        <div className="flex w-full items-center gap-2">
          <div className="w-full bg-brandOrange h-2 rounded-full "></div>
          <div className="w-full bg-brandOrange h-2 rounded-full "></div>
        </div>
      )}
 
      <div className="my-1">
        <h3 className="w-full text-right text-red-600">*</h3>
        <div
          className="h-[144.06px] w-[144.06px] rounded-full bg-cover bg-no-repeat flex flex-col items-end justify-end mb-3"
          style={{
            backgroundImage: `url(${
              picFile
                ? URL.createObjectURL(picFile)
                : GlobalVariables.defaultProfilePicture
            })`,
          }}
        >
          <img
            src={camera.src}
            alt=""
            className="-mr-3"
            role="button"
            onClick={() => picRef.current.click()}
          />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={picRef}
            onChange={(e) => {
              const file = e.target.files[0];
              setPicFile(file);
            }}
          />
        </div>
      </div>
      <div className="w-full">
        <p className="text-14px flex text-[#181918] font-medium">LinkedIn <span className="text-red-600">*</span></p> 
        <div className="flex flex-col sm:flex-row   sm:items-center sm:gap-3 justify-center w-full relative ">
          <p className="text-14px text-[#2A2A2A] font-normal h-[35px] ">
            www.linkedin.com/in/
          </p>
          <div className="w-full">
            <InputWithFullBoarder
              placeholder={`Username`}
              // value={formData.linkedin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  linkedin: `www.linkedin.com/in/${e.target.value}`,
                })
              }
            />
          </div>
        </div>
        <InputWithFullBoarder
          label={<p className="flex">Years of experience <span className="text-red-600">*</span></p>}
          type={"Number"}
          value={formData.experience}
          onChange={(e) =>
            setFormData({ ...formData, experience: Number(e.target.value) })
          }
        />
        <CustomDropdown
          title={<p className="flex">Industry <span className="text-red-600">*</span></p>}
          placeholder={`Select your industry`}
          onChange={(e) => {
            const selectedValue = e.target.value;
            
            const selectedCategory = categories?.data?.categories.find(
              (option) => option?.title === selectedValue && option?.id
            );
             
            if (selectedCategory?.sub_categories) {
              setSubCategories([
                ...subcategories,
                ...selectedCategory?.sub_categories,
              ]);
            } 
          }}
          options={categoriesOptimized.map((el) => el?.title) || []} 
        />
        <CustomDropdown
          title={<p className="flex">Categories <span className="text-red-600">*</span></p>}
          placeholder={`Select your category(ies)`}
          onChange={(e) => {
            const selectedValue = e.target.value;
            
            const selectedCategory = subcategories.find(
              (option) => option?.title === selectedValue && option?.id
            );
             
            if(formData.categories.length <  3){
                if (
                      selectedCategory &&
                      !formData.categories.some(
                      (category) => category.id === selectedCategory.id
                      )
                    ) {
                      setFormData({
                        ...formData,
                        categories: [...formData.categories, selectedCategory],
                      });
                }
            }else{
              toast.error("Maximum category selection reached")
            }
          }}
          options={subcategories?.map((el) => el?.title) || []}  
          valuesArray={formData?.categories.map((el) => el?.title)}
          removeFromArrayClick={(indexToRemove) =>  {
             
            removeFromArrayyClick(indexToRemove)
          }}
        />
        <UploadFileComponent
          description={<p className="flex">Upload your resume <span className="text-red-600">*</span></p>}
          inputRef={resumeRef}
          isLoading={uploadingResume}
          format={`PDF`}
          maxSize={resumeFile ? convertBytesToMB(resumeFile.size) : `20`}
          fileName={resumeFile ? resumeFile.name : null}
          progress={progress}
          accept={"application/pdf"}
          buttonClick={() => setResumeFile(null)}
          onChange={async (e) => {
            const file = e.target.files[0];
            setResumeFile(file);
          }}
        />
        <UploadFileComponent
          description={`Upload your certificate(s)`}
          inputRef={certRed}
          isLoading={uploadingCerts}
          format={`PDF/Image`}
          maxSize={`20`}
          fileName={certFiles ? certFiles.name : null}
          progress={progress}
          accept={"image/*,.pdf"}
          files={certFiles}
          multiple={true}
          buttonClick={() => setCertFiles([])}
          onChange={async (e) => {
            const files = Array.from(e.target.files);
            setCertFiles(files);
          }}
        />
        <InputWithFullBoarder
          label={"Tell us about yourself" }
          value={formData.comment}
          onChange={(e) =>
            setFormData({ ...formData, comment: e.target.value })
          }
          isTextArea={true}
          isRequired={true}
          placeholder={`Enter text`}
          className={`h-[200px]`}
        />
        <label className="flex items-start gap-2">
              <input
                type="checkbox"
                className="mt-1"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <div className="flex h-fit flex-wrap gap-1 w-auto ">
              <p className="text-sm w-fit     text-gray-600">
                I understand and agree to the 
              </p>
              <span   className="text-brandOrange w-auto text-sm   cursor-pointer" onClick={() => document.getElementById("consultant_term_modal").showModal()}>
                  Terms and Conditions
                </span> 
                 <span className="text-red-600">*</span>
              </div>
              
            </label>
      </div>
      <ConfirmationModal
        title={`Application Successful`}
        message={data?.message}
        onClick={() => {
          router.push(`/`);
          document.getElementById("confirmation").close();
        }}
      />
      <ConsultantTermsModal />
    </AuthShell>
  );
};

export default ConsultantApplicationPage;
