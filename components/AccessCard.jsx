import { accessCard } from "@/public/icons";

const { QRCodeSVG } = require("qrcode.react");

const EventAccessCard = ({ inviteDetail }) => (
  <div className="relative w-[400px] h-[200px] bg-brandPurple text-white p-6 rounded-lg overflow-hidden">
    {/* Background Pattern */}
    <img
      src={accessCard.src}
      className="absolute inset-0 w-full h-full object-cover"
      alt=""
    />

    <div className="relative z-10">
      <p className="text-sm opacity-90">
        {inviteDetail?.event?.name || "Event name"}
      </p>
      <h2 className="text-xl font-medium mt-2">{inviteDetail?.name}</h2>
      <div className="mt-6">
        <p className="text-sm opacity-90">Access Code</p>
        <p className="text-2xl font-medium mt-1">
          {inviteDetail?.code || "No Access Code"}
        </p>
      </div>
    </div>

    <div className="absolute bottom-4 right-4 z-20">
      <QRCodeSVG
        value={inviteDetail?.code}
        size={80}
        className="bg-white p-1 rounded"
      />
    </div>
  </div>
);

export { EventAccessCard };
