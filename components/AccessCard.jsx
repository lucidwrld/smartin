import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { accessCard } from "@/public/icons";
import dynamic from "next/dynamic";
import ReactDOMServer from "react-dom/server";

const html2canvas = dynamic(() => import("html2canvas"), {
  ssr: false,
});

const EventAccessCard = ({ inviteDetail }) => {
  const cardRef = useRef(null);
  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    try {
      const svg = qrCodeRef.current;
      const svgData = new XMLSerializer().serializeToString(svg);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Make the canvas larger for a higher resolution output
        canvas.width = 300; // Larger size
        canvas.height = 300; // Larger size

        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image scaled up
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${
          inviteDetail?.event?.name || "event"
        }-qr.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const downloadFullCard = async () => {
    try {
      if (cardRef.current && typeof window !== "undefined") {
        const html2canvasModule = await import("html2canvas");
        const html2canvas = html2canvasModule.default;

        const canvas = await html2canvas(cardRef.current);
        const image = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `${
          inviteDetail?.event?.name || "event"
        }-card.png`;
        downloadLink.href = image;
        downloadLink.click();
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
  };

  return (
    <div className="relative">
      <div
        ref={cardRef}
        className="relative w-[400px] h-[200px] bg-brandPurple text-white p-6 rounded-lg overflow-hidden"
      >
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
            ref={qrCodeRef}
            value={inviteDetail?.code}
            size={80}
            className="bg-white p-1 rounded"
          />
        </div>
      </div>

      {/* Download buttons */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={downloadFullCard}
          className="flex items-center gap-2 px-4 py-2 bg-brandPurple text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Download size={16} />
          Download Card
        </button>
        <button
          onClick={downloadQRCode}
          className="flex items-center gap-2 px-4 py-2 border border-brandPurple text-brandPurple rounded-lg hover:bg-brandPurple hover:text-white transition-colors"
        >
          <Download size={16} />
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export { EventAccessCard };
