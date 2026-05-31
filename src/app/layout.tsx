import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Toolhouse",
  description: "A growing workspace for PDF, video, image, link, and AI tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
