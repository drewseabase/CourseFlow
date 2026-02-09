export default function StudyHours(){
    return (
        <div className="relative overflow-hidden bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {/*Top gradient border*/}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#43e97b] to-[#38f9d7]"></div>

            {/*Icon*/}
            <div className="absolute top-5 right-5 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                ⏱️
            </div>

            <div className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[#A1A1AA] mb-2">
                Study Hours
            </div>

            <div className="text-[42px] font-bold mb-2">
                18h
            </div>

            <div className="text-[14px] text-[#52525B]">
                Scheduled this week
            </div>
        </div>
    );
}