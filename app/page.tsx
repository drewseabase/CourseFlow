import { auth } from "auth";
import { redirect } from "next/navigation";
import SignInButton from "@/components/auth/signInButton";

export default async function LandingPage() {

  const session = await auth();
  if(session?.user) redirect('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-zinc-50">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M3 10 L12 5 L21 10 L12 15 Z" strokeLinejoin="round"/>
              <path d="M7 13 V16 C7 17.5 10 19 12 19 C14 17 17.5 17 16 V13" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[22px] font-bold text-[#18181B] tracking-tight">CourseFlow</span>
        </div>

        <h1 className="text-[42px] font-bold text-[#18181B] leading-tight mb-4">
          Your schedule, <br /> built around your deadlines.
        </h1>
        <p className="text-[17px] text-[#52525B] mb-10 leading-relaxed">
          Connect Canvas and CourseFlow automatically turns your assignments into a realiatic, continuously-updating study schedule.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06) border border-zinc-200/70">
          <p className="text-[15px] font-semibold text-[#18181B] mb-1">Get Started</p>
          <p className="text-[13px] text-[#71717A] mb-6">
            Sign in with your U of M Google account to continue.
          </p>
          <SignInButton/>
        </div>
      </div>
    </div>
  );
}

