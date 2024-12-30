import React, { useRef } from "react";
import { Download, X } from "lucide-react";
import CustomButton from "../Button";
import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Image from "next/image";
import { logo } from "@/public/images";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
  const receiptRef = useRef();

  const downloadPDF = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "white",
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`transaction-${transaction._id}.pdf`);
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-[600px] max-h-[80vh] overflow-y-auto text-brandBlack">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Transaction Receipt</h2>
          <div className="flex gap-4">
            <Download className="cursor-pointer" onClick={downloadPDF} />
            <X className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* Receipt Content */}
        <div ref={receiptRef} className="bg-white p-6 rounded-lg">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <div className="mb-4 flex justify-center">
              <Image
                src={logo}
                alt="Company Logo"
                width={120}
                height={40}
                className="h-auto"
              />
            </div>
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold mb-2">Payment Receipt</h1>
              <p className="text-gray-600">Transaction ID: {transaction._id}</p>
              <p className="text-gray-600">
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-brandBlack">
              {transaction.currency} {formatAmount(transaction.amount)}
            </p>
            <p
              className={`text-sm mt-1 ${
                transaction.approved ? "text-green-600" : "text-orange-500"
              }`}
            >
              {transaction.approved ? "Payment Approved" : "Pending Approval"}
            </p>
          </div>

          {/* Payment Details */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-3">Payment Details</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-600">Payment Method:</p>
              <p className="font-medium capitalize">
                {transaction.payment_type}
              </p>
              <p className="text-gray-600">Transaction Type:</p>
              <p className="font-medium capitalize">{transaction.type}</p>
            </div>
          </div>

          {/* Payer Information */}
          <div className="border-b pb-4 mb-4">
            <h3 className="font-semibold mb-3">Payer Information</h3>
            <div className="grid grid-cols-2 gap-y-2 text-sm">
              <p className="text-gray-600">Name:</p>
              <p className="font-medium">{transaction.user.fullname}</p>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{transaction.user.email}</p>
              <p className="text-gray-600">Phone:</p>
              <p className="font-medium">{transaction.user.phone}</p>
            </div>
          </div>

          {/* Event Details if available */}
          {transaction.event && (
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Event Details</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <p className="text-gray-600">Event Name:</p>
                <p className="font-medium">{transaction.event.name}</p>
                <p className="text-gray-600">Host:</p>
                <p className="font-medium">{transaction.event.host}</p>
                <p className="text-gray-600">Date:</p>
                <p className="font-medium">
                  {formatDateTime(transaction.event.date)}
                </p>
                <p className="text-gray-600">Time:</p>
                <p className="font-medium">{transaction.event.time}</p>
                <p className="text-gray-600">Venue:</p>
                <p className="font-medium">{transaction.event.venue}</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-6 pt-4 border-t">
            <p>Thank you for your payment</p>
            <p className="mt-1">For any queries, please contact support</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <CustomButton
            buttonText="Download Receipt"
            onClick={downloadPDF}
            buttonColor="bg-green-50"
            textColor="text-green-600"
            className="w-auto"
            icon={<Download size={16} />}
          />
          <CustomButton
            buttonText="Close"
            onClick={onClose}
            buttonColor="bg-gray-100"
            textColor="text-gray-700"
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailModal;
