"use client";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";  
import { Switch } from "@mui/material";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useProgram } from "@/context/programContext";
import { useRouter } from "next/navigation";
import { BuyTicketManager } from "@/app/tickets/controllers/ticketController";
import { ValidateCouponManager } from "@/components/tickets/couponController";
import { useEffect, useState } from "react";

// Sample tickets data
 

// Generate initial values for Formik
const generateInitialValues = (tickets) => {
    const initialValues = {
        // Buyer information
        buyer: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: ""
        },
        sendToDifferentEmails: false,
        // Tickets with attendees (only populated when sendToDifferentEmails is true)
        tickets: [],
        // Coupon
        couponCode: "",
        agreeToTerms: false
    };

    // Generate ticket structure with attendees array
    tickets.forEach(ticket => {
        const ticketAttendees = [];
        for (let i = 0; i < ticket.quantity; i++) {
            ticketAttendees.push({
                firstName: "",
                lastName: "",
                email: "",
                phoneNumber: ""
            });
        }
        
        initialValues.tickets.push({
            ticketId: ticket.ticketId,
            quantity: ticket.quantity,
            attendees: ticketAttendees
        });
    });

    return initialValues;
};

// Dynamic validation schema based on sendToDifferentEmails
const getValidationSchema = (sendToDifferentEmails: boolean) => {
    const baseSchema: any = {
        buyer: Yup.object({
            firstName: Yup.string().required("First name is required"),
            lastName: Yup.string().required("Last name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            phoneNumber: Yup.string().required("Phone number is required")
        }),
        agreeToTerms: Yup.boolean().oneOf([true], "You must agree to the terms")
    };

    if (sendToDifferentEmails) {
        baseSchema.tickets = Yup.array().of(
            Yup.object({
                attendees: Yup.array().of(
                    Yup.object({
                        firstName: Yup.string().required("First name is required"),
                        lastName: Yup.string().required("Last name is required"),
                        email: Yup.string().email("Invalid email").required("Email is required"),
                        phoneNumber: Yup.string().required("Phone number is required")
                    })
                )
            })
        );
    }

    return Yup.object(baseSchema);
};


// Helper function to format currency
const formatCurrency = (amount) => {
    return `${amount.toLocaleString()}`;
};

// Calculate totals
const calculateTotals = (tickets) => {
    const totalQuantity = tickets?.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalPrice = tickets?.reduce((sum, ticket) => sum + ticket.price, 0);
    return { totalQuantity, totalPrice };
};

export default function TicketPage() {
    const {selectedTickets, selectedEventId, clearSelectedTickets} = useProgram()  
    const { totalQuantity, totalPrice } = calculateTotals(selectedTickets?.ticketss ?? [{quantity: 0, price: 0}]);
    const [couponAmount, setCouponAmount] = useState(0)
    const [gotCoupon, setGotCoupon] = useState(false)
    const {buyTicket, isLoading, isSuccess} = BuyTicketManager({eventId: selectedEventId})
    const {validateCoupon, data,isLoading: validating, isSuccess: validated} = ValidateCouponManager({eventId: selectedEventId})
    const router = useRouter()
    const handleSubmit = (values) => {
        let payload;
        
        if (values.sendToDifferentEmails) {
            // Format for detailed attendee information
            payload = {
                email: values.buyer.email,
                name: `${values.buyer.firstName} ${values.buyer.lastName}`,
                path: `public/event/${selectedEventId}`,
                tickets: values.tickets.map(ticket => ({
                    ticketId: ticket.ticketId,
                    quantity: ticket.quantity,
                    attendees: ticket.attendees
                })),
                ...(gotCoupon && { couponCode: values.couponCode }),
            };
        } else {
            // Format for simple ticket purchase
            payload = {
                email: values.buyer.email,
                name: `${values.buyer.firstName} ${values.buyer.lastName}`,
                path: `public/event/${selectedEventId}`,
                tickets: selectedTickets?.ticketss?.map(ticket => ({
                    ticketId: ticket.ticketId,
                    quantity: ticket.quantity
                })),
                ...(gotCoupon && { couponCode: values.couponCode }),
            };
        }
        buyTicket(payload) 
    };
    useEffect(() => {
        if(validated){ 
            setGotCoupon(true)
            setCouponAmount(data?.data?.discount_amount)
        }
    }, [validated])

    return (
        <div className="w-full min-h-dvh flex flex-col items-center px-5 py-10">
            <div className="w-full h-fit flex justify-between items-center">
                <div onClick={() => {router.back(); }} className="w-fit h-fit bg-white my-6 cursor-pointer p-4 group hover:bg-signin border-[1px] border-backgroundPurple rounded-full">
                    <ArrowLeft className="text-backgroundPurple group-hover:text-white" />

                </div>

            </div>
            <div className="max-w-[1220px] w-full flex flex-col gap-10 h-auto">
                <div className="w-full h-fit flex justify-between items-center">
                    <h2 className="text-[40px] leading-[55px] text-backgroundPurple font-light">
                        Ticket Checkout
                    </h2>
                </div>

                <Formik
                    initialValues={generateInitialValues(selectedTickets?.ticketss)}
                    validationSchema={getValidationSchema(false)}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, errors, touched }) => {
                        const validateCode = () => {
                            let payload  
                            if (values.sendToDifferentEmails) {
                                // Format for detailed attendee information
                                payload = {
                                    code: values.couponCode,
                                    total_amount: totalPrice,
                                    tickets: values.tickets.map(ticket => ({
                                        ticketId: ticket.ticketId,
                                        quantity: ticket.quantity,
                                        attendees: ticket.attendees
                                    }))
                                };
                            } else {
                                // Format for simple ticket purchase
                                payload = {
                                    code: values.couponCode,
                                    total_amount: totalPrice,
                                    tickets: selectedTickets?.ticketss?.map(ticket => ({
                                        ticketId: ticket.ticketId,
                                        quantity: ticket.quantity
                                    }))
                                };
                            }
                            if(values.couponCode){validateCoupon(payload)}
                        } 
                        return (
                            <Form className="w-full flex flex-col lg:flex-row gap-[20px]">
                            {/* Left Side - Form */}
                            <div className="max-w-[756px] p-[31px] flex flex-col w-full h-fit gap-[20px] border-[1px] border-[#CDCDCD] rounded-[6px] flex-shrink-0">
                                {/* Buyer Information */}
                                <div className="pb-[17px] border-b-[1px] border-[#CDCDCD] w-full h-fit">
                                    <h2 className="text-backgroundPurple text-[25px] leading-[25px] font-light">
                                        Your Information
                                    </h2>
                                </div>
                                <div className="w-full grid grid-cols-2 gap-[20px]">
                                    <Field name="buyer.firstName">
                                        {({ field }) => (
                                            <InputWithFullBoarder 
                                                {...field}
                                                label="First Name" 
                                                labelColor="text-backgroundPurple" 
                                                placeholder="Enter your first name" 
                                                className="!border-backgroundPurple" 
                                            />
                                        )}
                                    </Field>
                                    <Field name="buyer.lastName">
                                        {({ field }) => (
                                            <InputWithFullBoarder 
                                                {...field}
                                                label="Last Name" 
                                                labelColor="text-backgroundPurple" 
                                                placeholder="Enter your last name" 
                                                className="!border-backgroundPurple" 
                                            />
                                        )}
                                    </Field>
                                    <Field name="buyer.email">
                                        {({ field }) => (
                                            <InputWithFullBoarder 
                                                {...field}
                                                label="Email" 
                                                labelColor="text-backgroundPurple" 
                                                icon={<Mail color="#8D0BF0" size={18} />} 
                                                hasSuffix={true} 
                                                wrapperClassName="col-span-2" 
                                                placeholder="Enter your email" 
                                                className="!border-backgroundPurple" 
                                            />
                                        )}
                                    </Field>
                                    <Field name="buyer.phoneNumber">
                                        {({ field }) => (
                                            <InputWithFullBoarder 
                                                {...field}
                                                label="Phone Number" 
                                                labelColor="text-backgroundPurple" 
                                                placeholder="e.g. +1 for US, +44 for UK" 
                                                wrapperClassName="col-span-2" 
                                                type="tel" 
                                                icon={<Phone color="#8D0BF0" size={18} />} 
                                                hasSuffix={true}   
                                                className="!border-backgroundPurple" 
                                            />
                                        )}
                                    </Field>
                                </div>

                                {/* Send to Different Emails Toggle */}
                                <div className="w-full h-fit flex mb-3 items-center justify-between gap-10">
                                    <div className="w-fit h-fit flex flex-col gap-1">
                                        <h1 className="lg:text-[20px] text-[16px] leading-[22px] lg:leading-[25px] font-light text-backgroundPurple">
                                            Send Tickets to different email addresses?
                                        </h1>
                                        <p className="text-[10px] leading-[14px] lg:text-[14px] lg:leading-[16px] font-normal text-[#94A3B8]">
                                            Leave blank to send tickets to the payment email.
                                        </p>
                                    </div>
                                    <Switch 
                                        checked={values.sendToDifferentEmails}
                                        onChange={(e) => setFieldValue('sendToDifferentEmails', e.target.checked)}
                                    />
                                </div>

                                {/* Dynamic Attendee Forms - Only show when sendToDifferentEmails is true */}
                                {values.sendToDifferentEmails && (
                                    <div className="w-full h-fit flex flex-col gap-[20px]">
                                        {selectedTickets?.ticketss?.map((ticket, ticketIndex) => (
                                            Array.from({ length: ticket.quantity }, (_, attendeeIndex) => {
                                                const attendeeNumber = attendeeIndex + 1;
                                                
                                                return (
                                                    <div key={`${ticket.ticketId}_${attendeeNumber}`} className="w-full h-fit flex flex-col gap-[18px]">
                                                        <h1 className="text-[20px] leading-[25px] font-medium text-backgroundPurple">
                                                            Attendee {attendeeNumber} - {ticket.name}
                                                        </h1>
                                                        <div className="w-full grid grid-cols-2 gap-[20px]">
                                                            <Field name={`tickets[${ticketIndex}].attendees[${attendeeIndex}].firstName`}>
                                                                {({ field }) => (
                                                                    <InputWithFullBoarder 
                                                                        {...field}
                                                                        label="First Name" 
                                                                        labelColor="text-backgroundPurple" 
                                                                        placeholder="Enter first name" 
                                                                        className="!border-backgroundPurple" 
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Field name={`tickets[${ticketIndex}].attendees[${attendeeIndex}].lastName`}>
                                                                {({ field }) => (
                                                                    <InputWithFullBoarder 
                                                                        {...field}
                                                                        label="Last Name" 
                                                                        labelColor="text-backgroundPurple" 
                                                                        placeholder="Enter last name" 
                                                                        className="!border-backgroundPurple" 
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Field name={`tickets[${ticketIndex}].attendees[${attendeeIndex}].email`}>
                                                                {({ field }) => (
                                                                    <InputWithFullBoarder 
                                                                        {...field}
                                                                        label="Email" 
                                                                        labelColor="text-backgroundPurple" 
                                                                        icon={<Mail color="#8D0BF0" size={18} />} 
                                                                        hasSuffix={true} 
                                                                        wrapperClassName="col-span-2" 
                                                                        placeholder="Enter email" 
                                                                        className="!border-backgroundPurple" 
                                                                    />
                                                                )}
                                                            </Field>
                                                            <Field name={`tickets[${ticketIndex}].attendees[${attendeeIndex}].phoneNumber`}>
                                                                {({ field }) => (
                                                                    <InputWithFullBoarder 
                                                                        {...field}
                                                                        label="Phone Number" 
                                                                        labelColor="text-backgroundPurple" 
                                                                        placeholder="e.g. +1 for US, +44 for UK" 
                                                                        wrapperClassName="col-span-2" 
                                                                        type="tel" 
                                                                        icon={<Phone color="#8D0BF0" size={18} />} 
                                                                        hasSuffix={true}   
                                                                        className="!border-backgroundPurple" 
                                                                    />
                                                                )}
                                                            </Field>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Right Side - Summary */}
                            <div className="w-full h-fit flex-col border-[1px] bg-white border-[#CDCDCD] rounded-[6px]">
                                <div className="rounded-t-[6px] w-full p-[25px] h-fit bg-signin">
                                    <h1 className="text-[25px] leading-[25px] font-light text-white">Summary</h1>
                                </div>
                                <div className="p-[25px] flex flex-col gap-10">
                                    {/* Ticket Summary */}
                                    <div className="w-full h-fit flex flex-col gap-[10px]">
                                        {selectedTickets?.ticketss?.map(ticket => (
                                            <div key={ticket.ticketId} className="w-full h-fit flex justify-between items-center">
                                                <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-light">
                                                    {ticket.quantity} <span className="text-[12px] font-extralight">x</span> {ticket.name}
                                                </h2> 
                                                <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-medium">
                                                    {selectedTickets.currency === 'NGN' ? '₦' : '$'}{formatCurrency(ticket.price)}
                                                </h2>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coupon Code */}
                                    <div className="w-full flex gap-2 py-1 bg-[#F6F6F6] items-center h-[40px] rounded-[6px]">
                                        <Field name="couponCode">
                                            {({ field }) => (
                                                <input 
                                                    value={values.couponCode}
                                                    disabled={gotCoupon}
                                                    onChange={(e) => {setFieldValue("couponCode", e.target.value)}}
                                                    type="text" 
                                                    placeholder="Enter coupon code here..." 
                                                    className="w-full h-auto bg-transparent outline-none border-none px-2" 
                                                />
                                            )}
                                        </Field>
                                        <CustomButton 
                                            buttonText="Apply"  
                                            isLoading={validating}
                                            disabled={gotCoupon}
                                            onClick={() => {validateCode()}}
                                            buttonColor="bg-signin" 
                                            className="!h-[36px] rounded-[4px]" 
                                            type="button"
                                        />
                                    </div>

                                    {/* Summary Details */}
                                    <div className="w-full flex text-[15px] text-[#94A3B8] leading-[25px] font-normal flex-col gap-[10px] h-fit">
                                        <div className="w-full h-fit flex justify-between">
                                            <p>Quantity</p>
                                            <p>{totalQuantity}</p>
                                        </div>
                                        <div className="w-full h-fit flex justify-between">
                                            <p>Discount</p>
                                            <p>{selectedTickets.currency === 'NGN' ? '₦' : '$'}{couponAmount}</p>
                                        </div>
                                        <div className="w-full h-fit flex justify-between">
                                            <p>Fees</p>
                                            <p>{selectedTickets.currency === 'NGN' ? '₦' : '$'}0</p>
                                        </div> 
                                    </div>

                                    {/* Total */}
                                    <div className="w-full h-fit flex justify-between pt-5 border-t-[1px] border-[#CDCDCD] items-center">
                                        <h2 className="flex items-center gap-2 text-[20px] leading-[25px] text-backgroundPurple font-light">
                                            Total
                                        </h2> 
                                        <h2 className="flex items-center gap-2 text-[25px] leading-[25px] text-backgroundPurple font-semibold">
                                            {selectedTickets.currency === 'NGN' ? '₦' : '$'}{formatCurrency(totalPrice - couponAmount)}
                                        </h2>
                                    </div>

                                    {/* Terms and Submit */}
                                    <div className="w-full h-fit flex flex-col gap-5">
                                        <div className="w-full h-fit flex gap-2 items-center">
                                            <Field name="agreeToTerms">
                                                {({ field }) => (
                                                    <input 
                                                        {...field}
                                                        type="checkbox" 
                                                        className="w-[24px] h-[24px]" 
                                                        checked={field.value}
                                                    />
                                                )}
                                            </Field>
                                            <p className="text-[14px] leading-[16px] text-[#94A3B8] font-normal">
                                                I agree to the <span className="text-brandPurple cursor-pointer">Terms of Service</span> and <span className="text-brandPurple cursor-pointer">Privacy Policy</span> 
                                            </p>
                                        </div>
                                        <CustomButton 
                                            buttonColor="bg-signin" 
                                            isLoading={isLoading}
                                            className="rounded-[6px]" 
                                            buttonText="Proceed to Payment" 
                                            type="submit"
                                        />
                                    </div>    
                                </div>
                            </div>
                        </Form>
                        )
                    }}
                </Formik>
            </div>
        </div>
    );
}