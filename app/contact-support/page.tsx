"use client";
import React, { useState, useEffect } from "react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import { CreateTicketManager } from "../admin/tickets/controllers/createTicketController";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MailsIcon, PhoneCall } from "lucide-react";
import emailjs from "@emailjs/browser";

const ContactSupportPage = () => {
  // EmailJS Configuration - Replace with your actual values
  const EMAILJS_SERVICE_ID = "service_excu53c";
  const EMAILJS_TEMPLATE_ID = "template_rwpegkm";
  const EMAILJS_PUBLIC_KEY = "e1AP3EFhA-7rgGCQZ";

  // Preserved existing hooks and logic
  const [tokenExists, setTokenExists] = useState(false);
  const {
    createTicket,
    isLoading: apiLoading,
    isSuccess,
  } = CreateTicketManager();

  // Check token on component mount and when localStorage changes
  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const hasToken = token !== null && token !== "";
        console.log("Token check - token:", token, "hasToken:", hasToken);
        setTokenExists(hasToken);
      }
    };

    checkToken();

    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkToken);

    return () => window.removeEventListener("storage", checkToken);
  }, []);

  const initialData = {
    email: "",
    title: "",
    description: "",
    attachments: [],
    type: "dispute",
  };

  const [formData, setFormData] = useState(initialData);
  const [emailjsLoading, setEmailjsLoading] = useState(false);

  // Handle API success
  useEffect(() => {
    if (isSuccess && tokenExists) {
      console.log("API submission successful");
      toast.success("Support ticket created successfully!");
      setFormData(initialData); // Reset form
    }
  }, [isSuccess, tokenExists]);

  // Debug function to clear invalid tokens
  const clearToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      setTokenExists(false);
      console.log("Token cleared manually");
    }
  };

  const validateForm = () => {
    return (
      formData.email !== "" &&
      formData.title !== "" &&
      formData.description !== ""
    );
  };

  const handleEmailJSSubmission = async () => {
    setEmailjsLoading(true);
    console.log("Starting EmailJS submission...");

    try {
      const templateParams = {
        from_email: formData.email,
        subject: formData.title,
        message: formData.description,
        to_email: "contact@smartinvites.xyz", // Your receiving email
        submission_date: new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
      };

      console.log("EmailJS template params:", templateParams);

      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("EmailJS success:", result);
      toast.success(
        "Message sent successfully! We will revert to you within 1 business day."
      );
      setFormData(initialData); // Reset form
    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error(
        "Failed to send message. Please try again or contact us directly."
      );
    } finally {
      setEmailjsLoading(false);
      console.log("EmailJS submission completed");
    }
  };

  const handleAPISubmission = async () => {
    console.log("Starting API submission for logged-in user...");
    try {
      await createTicket(formData);
      console.log("API submission initiated");
      // The success handling should be done in the CreateTicketManager hook
    } catch (error) {
      console.error("API submission error:", error);

      // If API fails due to authentication, clear token and use EmailJS instead
      if (
        error?.message?.includes("account") ||
        error?.response?.status === 401
      ) {
        console.log(
          "API failed due to auth issues, clearing token and switching to EmailJS"
        );
        clearToken();
        toast.info("Switching to alternative submission method...");
        setTimeout(async () => {
          await handleEmailJSSubmission();
        }, 500);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (validateForm()) {
      console.log("Form validation passed. Token exists:", tokenExists);
      console.log(
        "Current localStorage token:",
        typeof window !== "undefined" ? localStorage.getItem("token") : "SSR"
      );

      if (tokenExists) {
        // User is logged in - use API endpoint
        console.log("Using API endpoint for logged-in user");
        handleAPISubmission();
      } else {
        // User is not logged in - use EmailJS
        console.log("Using EmailJS for non-logged-in user");
        await handleEmailJSSubmission();
      }
    } else {
      toast.error("Fill in the compulsory fields");
    }
  };

  // Determine loading state based on which method is being used
  const isLoading = tokenExists ? apiLoading : emailjsLoading;

  return (
    <>
      <Header isLandingPage={false} />

      <div className="w-full py-24 mt-0 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Information Section */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 md:p-12">
                <div className="h-full flex flex-col justify-between">
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Contact Us
                      </h2>
                      <p className="mt-2 text-gray-600">
                        Any questions or enquiries? Get in touch with us
                      </p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <PhoneCall className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-700">+23 703 520 5494</p>
                          <p className="text-gray-700">+234 806 811 1435</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <MailsIcon className="h-6 w-6 text-orange-500" />
                        </div>
                        <div className="ml-4">
                          <p className="text-gray-700">
                            contact@smartinvites.xyz
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <p className="text-gray-600 mb-4">Connect with us</p>
                    <div className="flex space-x-5">
                      {/* <Link
                        href="https://www.linkedin.com/company/theconfidant/"
                        target="_blank"
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <FaLinkedin size={24} />
                      </Link> */}
                      <Link
                        href="https://www.instagram.com/smartinvitesofficial/"
                        target="_blank"
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <FaInstagram size={24} />
                      </Link>
                      <Link
                        href="https://web.facebook.com/profile.php?id=61573614393252"
                        target="_blank"
                        className="text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <FaFacebook size={24} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Section */}
              <div className="p-8 md:p-12">
                {/* Debug info - Remove this in production */}
                {/* <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>
                    Token exists:{" "}
                    {tokenExists
                      ? "Yes (Will use API)"
                      : "No (Will use EmailJS)"}
                  </p>
                  <p>
                    Current token:{" "}
                    {typeof window !== "undefined"
                      ? localStorage.getItem("token")
                        ? "Present"
                        : "Not found"
                      : "SSR"}
                  </p>
                  {tokenExists && (
                    <button
                      onClick={clearToken}
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Clear Token (Force EmailJS)
                    </button>
                  )}
                </div> */}

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <InputWithFullBoarder
                      labelColor="text-gray-700"
                      label="Title"
                      isRequired={true}
                      placeholder="Enter subject"
                      className="w-full"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <InputWithFullBoarder
                      label="Email"
                      isRequired={true}
                      labelColor="text-gray-700"
                      placeholder="Enter your email address"
                      className="w-full"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <InputWithFullBoarder
                      labelColor="text-gray-700"
                      label="Message"
                      isRequired={true}
                      placeholder="Enter text"
                      className="w-full h-[200px]"
                      isTextArea={true}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <CustomButton
                      buttonText="Submit"
                      className="w-full h-[50px]"
                      buttonColor="bg-brandOrange"
                      radius="rounded-[30px]"
                      isLoading={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e);
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ContactSupportPage;
