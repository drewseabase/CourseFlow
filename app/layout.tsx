import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";


export const metadata: Metadata = {
  title: "CourseFlow - Student Scheduling",
  description: "Automatically turn class deadlines into a realistic, continuously-updating schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return(
    <html lang="en">
      <body>
        {/*Main Content*/}
        <div className="max-w-375 mx-auto px-10 py-10">
          <Navbar/>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}