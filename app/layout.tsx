import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/clientLayout";

export const metadata: Metadata = {
  title: "CourseFlow",
  description: "Automatically turn deadlines into a realistic schedule",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
