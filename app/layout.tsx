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
        {/*Animated Background Blobs*/}
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-30 bg-gradient-1
          -top-[100px] -left-[100px] animate-float"/>
            <div className="absolute w-[350px] h-[350px] rounded-full blur-[80px] opacity-30 bg-gradient-3
            -bottom-[100px] -right-[100px] animate-float [animation-delay: -5s]"/>
            <div className="absolute w-[300px] h-[300px] rounded-full blur-[80px] opacity-30
            bg-gradient-4 top-[50%] right-[20%] animate-float [animation-delay:-10s]"/>
        </div>
        {/*Main Content*/}
        <div className="max-w-[1500[px] mx-auto px-6 py-6">
          <Navbar/>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}