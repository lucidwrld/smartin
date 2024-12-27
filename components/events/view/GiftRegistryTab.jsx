import React from "react";
import { MoreVertical, Copy } from "lucide-react";
import HeaderWithEdit from "@/components/HeaderWithEdit";
import Link from "next/link";
import { copyToClipboard } from "@/utils/copyToClipboard";
import Loader from "@/components/Loader";

const GiftItem = ({ name, type, link }) => (
  <Link
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between p-4 border border-grey3 rounded-lg bg-whiteColor"
  >
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <span className="text-purple-600 text-xl">🎁</span>
      </div>
      <div>
        <h3 className="font-medium text-gray-900 capitalize">{name}</h3>
        <span className="text-sm text-gray-500">{type}</span>
      </div>
    </div>
    <button className="p-2 hover:bg-gray-100 rounded-full">
      <MoreVertical size={20} className="text-gray-400" />
    </button>
  </Link>
);

const AccountDetails = ({ accountInfo, isLoading }) => {
  return isLoading ? (
    <Loader />
  ) : (
    <div className="bg-whiteColor text-confiBlack p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">
        Account Details for cash gifts
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Account Name</p>
          <p className="text-gray-900">{accountInfo?.account_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Bank</p>
          <p className="text-gray-900">{accountInfo?.bank_name}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="text-gray-900">{accountInfo?.account_number}</p>
          </div>
          <button
            onClick={() => {
              const text = `Account Name: ${accountInfo?.account_name}\nBank: ${accountInfo?.bank_name}\nAccount Number: ${accountInfo?.account_number}`;
              copyToClipboard(text);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Copy size={16} />
            <span>Copy</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const GiftRegistryTab = ({ event, isViewOnly = false }) => {
  return (
    <div className="space-y-6">
      {!isViewOnly && (
        <HeaderWithEdit
          title="Gift Registry"
          href={`/events/create-event?id=${event?.id}&section=gift registry`}
        />
      )}
      <p className="text-gray-600">
        {isViewOnly
          ? `Celebrate with ${event?.host} by sending a thoughtful gift! You can choose from their carefully curated gift registry or send them a cash gift to make their special day even more memorable. Your generosity means the world!`
          : "Create a personalized list of gifts"}
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {event?.items.map((gift, index) => (
            <GiftItem key={index} {...gift} />
          ))}
        </div>
        <AccountDetails accountInfo={event?.donation} />
      </div>
    </div>
  );
};

export default GiftRegistryTab;
