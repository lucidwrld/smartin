import React from "react";
import { MoreVertical, Copy } from "lucide-react";
import HeaderWithEdit from "@/components/HeaderWithEdit";

const GiftItem = ({ name, type, link }) => (
  <div className="flex items-center justify-between p-4 border border-grey3 rounded-lg bg-whiteColor">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
        <span className="text-purple-600 text-xl">🎁</span>
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">{type}</span>
      </div>
    </div>
    <button className="p-2 hover:bg-gray-100 rounded-full">
      <MoreVertical size={20} className="text-gray-400" />
    </button>
  </div>
);

const AccountDetails = () => {
  const accountInfo = {
    name: "Obere Destiny",
    bank: "Sterling bank",
    number: "0245678905",
  };

  const handleCopy = async () => {
    const text = `Account Name: ${accountInfo.name}\nBank: ${accountInfo.bank}\nAccount Number: ${accountInfo.number}`;
    try {
      await navigator.clipboard.writeText(text);
      // You might want to add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-whiteColor text-confiBlack p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">
        Account Details for cash gifts
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500">Account Name</p>
          <p className="text-gray-900">{accountInfo.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Bank</p>
          <p className="text-gray-900">{accountInfo.bank}</p>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="text-gray-900">{accountInfo.number}</p>
          </div>
          <button
            onClick={handleCopy}
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

const GiftRegistryTab = () => {
  const gifts = [
    { name: "Biurhytmix blender", type: "$450", link: "#" },
    { name: "Biurhytmix blender", type: "$45", link: "#" },
    { name: "Biurhytmix blender", type: "$123", link: "#" },
  ];

  return (
    <div className="space-y-6">
      <HeaderWithEdit title="Gift Registry" />
      <p className="text-gray-600">Create a personalized list of gifts</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {gifts.map((gift, index) => (
            <GiftItem key={index} {...gift} />
          ))}
        </div>
        <AccountDetails />
      </div>
    </div>
  );
};

export default GiftRegistryTab;
