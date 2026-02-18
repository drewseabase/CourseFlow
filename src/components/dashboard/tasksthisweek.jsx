export default function TasksThisWeek(){

    const panel =
        'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

    return(
        <div className={`relative overflow-hidden p-5 ${panel}`}>
           
            <div className="grid grid-cols-[120px_1fr] gap-4">

                {/* Left */}
                <div className="flex flex-col justify-center gap-2.5">
                    <div className="text-[12px] font-bold uppercase tracking-widest text-black">
                        Tasks This Week
                    </div>

                    {/* Sparkline */}
                    <svg className="w-30 h-11.5 block" viewBox="0 0 120 46" aria-hidden="true">
                        <path
                            d="M6 36 L22 26 L38 30 L54 18 L70 24 L86 14 L104 10 L104 40 L6 40 Z"
                            fill="rgba(109,40,217,0.10)"
                            stroke="none"
                        />
                        <path
                            d="M6 36 L22 26 L38 30 L54 18 L70 24 L86 14 L104 10"
                            stroke="#6D28D9"
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle cx="6" cy="36" r="2.2" fill="#6D28D9" />
                        <circle cx="104" cy="10" r="2.2" fill="#6D28D9" />
                    </svg>

                    <div className="text-[12px] font-semibold text-black -mt-0.5">
                        Daily completions
                    </div>
                </div>

                {/* Right */}
                <div className="flex flex-col justify-center gap-2.5 min-w-0">
                    <div className="text-[40px] font-extrabold leading-none tracking-tight">
                        8/12
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="text-[14px] font-semibold text-black">
                            66% complete
                        </div>
                        <div className="text-[12px] font-bold text-green-800 bg-green-500/15 border border-green-500/25 px-2.5 py-1.5 rounded-full inline-flex items-center gap-2 whitespace-nowrap">
                            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]" />
                            On pace
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2.5 bg-zinc-900/8 rounded-full overflow-hidden" aria-label="Progress">
                        <div
                            className="h-full rounded-full"
                            style={{ width: '66%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
