export default function StudyHours(){

    const panel =
        'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

    const days = [
        { label: 'M',  height: '46%', today: false, future: false },
        { label: 'T',  height: '62%', today: false, future: false },
        { label: 'W',  height: '31%', today: false, future: false },
        { label: 'Th', height: '77%', today: true,  future: false },
        { label: 'F',  height: '46%', today: false, future: true  },
        { label: 'Sa', height: '15%', today: false, future: true  },
        { label: 'Su', height: '8%',  today: false, future: true  },
    ];

    return (
        <div className={`relative overflow-hidden p-4 ${panel}`}>

            {/* Top row: text left, nothing right */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-zinc-500">
                        Study Hours
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-[28px] font-bold leading-tight">18h</span>
                    </div>
                </div>

                <span className="text-[11px] font-bold text-violet-700 bg-violet-500/12 border border-violet-500/22 px-2 py-1 rounded-full whitespace-nowrap">
                    ↑ 3h vs last week
                </span>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-1.5 h-10">
                {days.map((day) => (
                    <div key={day.label} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                        <div
                            className="w-full rounded-t-sm rounded-b-xs"
                            style={{
                                height: day.height,
                                background: day.future
                                    ? 'rgba(39,39,42,0.10)'
                                    : day.today
                                    ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                                    : 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)',
                                boxShadow: day.today ? '0 4px 12px rgba(118,75,162,0.30)' : 'none',
                            }}
                        />
                        <span className="text-[9px] font-bold text-black uppercase">{day.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
