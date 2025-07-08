import { Outfit } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import type { Metadata } from "next";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Smart Invites",
  description: "Modern Digital Invitations Made Simple",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Smart Invites",
    description: "Modern Digital Invitations Made Simple",
    type: "website",
    url: "https://smartinvites.xyz",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Provider>
          <Suspense>{children}</Suspense>
          <ToastContainer theme="colored" />
        </Provider>
      </body>
    </html>
  );
}
