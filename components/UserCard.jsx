import React from "react";

const UserCard = ({ letter, name, email }) => (
  <div className="flex items-center gap-3 p-2">
    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
      <span className="text-purple-600 font-medium text-15px">{letter}</span>
    </div>
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-900">{name}</span>
      <span className="text-sm text-gray-500">{email}</span>
    </div>
  </div>
);

export default UserCard;
