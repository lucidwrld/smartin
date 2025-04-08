"use client";
import React, { useState } from "react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import { CreateTicketManager } from "../admin/tickets/controllers/createTicketController";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MailsIcon, PhoneCall } from "lucide-react";

const ContactSupportPage = () => {
  // Preserved existing hooks and logic
  const tokenExists =
    typeof window !== "undefined" && localStorage.getItem("token") !== null;
  const { createTicket, isLoading, isSuccess } = CreateTicketManager();

  const initialData = {
    email: "",
    title: "",
    description: "",
    attachments: [],
    type: "dispute",
  };

  const [formData, setFormData] = useState(initialData);

  const validateForm = () => {
    return (
      formData.email !== "" &&
      formData.title !== "" &&
      formData.description !== ""
    );
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      createTicket(formData);
    } else {
      toast.error("Fill in the compulsory fields");
    }
  };

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
                <form className="space-y-6">
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
                      onClick={handleSubmit}
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
