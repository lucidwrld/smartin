import { Poppins } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Invitee",
  description: "Send and manage invitations for all your weddings and events. ",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Invitee",
    description:
      "Send and manage invitations for all your weddings and events. ",
    type: "website",
    url: "https://invitee.co",
    images: [
      {
        url: "", //put image path here
        width: 800,
        height: 600,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <Provider>
          <Suspense>{children}</Suspense>
          <ToastContainer theme="colored" />
        </Provider>
      </body>
    </html>
  );
}
