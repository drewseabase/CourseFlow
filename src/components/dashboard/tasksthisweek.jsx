export default function TasksThisWeek(){

    const panel =
        'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-2xl shadow-sm';

    return(
        <div className={`relative overflow-hidden p-5 ${panel}`}>
            {/*top gradient border*/}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[#4facfe] to-[#00f2fe]"></div>
            {/*Icon*/}
            <div className="absolute top-5 right-5 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">
                ✅
            </div>

            <div className="text-[13px] font-semibold uppercase tracking-[0.5px] text-[#A1A1AA] mb-2">
                Tasks This Week
            </div>

            <div className="text-[42px] font-bold mb-2">
                8/12
            </div>
            <div className="text-[14px] text-[#52525B]">
                66% complete
            </div>
        </div>
    );
}
