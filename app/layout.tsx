import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Archivia | Digital Thesis Archive",
  icons: {
    icon: "/icon.ico",
  },
  description:
    "Browse past thesis papers and find your ideal adviser with Archivia — a secure platform by the USTP IT Department that centralizes research access and uses smart recommendations to match students with the best advisers for their study.",
  openGraph: {
    title: "Archivia | Digital Thesis Archive",
    description:
      "Browse past thesis papers and find your ideal adviser with Archivia — a secure platform by the USTP IT Department that centralizes research access and uses smart recommendations to match students with the best advisers for their study.",
    url: "https://archivia-official.vercel.app/", // replace with your actual domain
    siteName: "Archivia",
    images: [
      {
        url: "/thumbnail-v4.png", // replace with your actual OG image URL
        // width: 1200,
        // height: 630,
        width: 2400,
        height: 1260,
        alt: "Archivia | Digital Thesis Archive",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Archivia | Digital Thesis Archive",
    description:
      "Browse past thesis papers and find your ideal adviser with Archivia — a secure platform by the USTP IT Department that centralizes research access and uses smart recommendations to match students with the best advisers for their study.",
    images: ["/thumbnail-v4.png"], // replace with your actual image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/icon.ico" type="image/x-icon" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#010101" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Archivia" /> */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
