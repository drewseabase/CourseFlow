// app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-xl bg-white rounded-[20px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
        <h1 className="text-3xl font-bold mb-3">CourseFlow</h1>
        <p className="text-[#52525B] mb-8">
          Turn deadlines into a realistic, continuously-updating schedule.
        </p>

        <div className="flex gap-3">
          {/* Fake “login” for now — just routes to dashboard */}
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-xl font-semibold bg-black text-white hover:opacity-90 transition"
          >
            Enter Dashboard
          </Link>

          <button
            className="px-5 py-3 rounded-xl font-semibold bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] transition"
          >
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}

