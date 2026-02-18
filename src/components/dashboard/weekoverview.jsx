export default function WeekOverview(){

    const panel =
        'bg-zinc-200/85 backdrop-blur-md border-1 border-stone-400/70 rounded-2xl shadow-sm';

    const percentage = 66;
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return(
        <div className={`relative overflow-hidden p-5 ${panel}`}>

            <div className="text-[13px] font-semibold uppercase tracking-[0.5px] text-black mb-2">
                Week Overview
            </div>

            <div className="text-[42px] font-bold mb-2">
                66%
            </div>
            <div className="text-[14px] text-black">
                On Track
            </div>

            <div className="absolute bottom-10 right-15">
                <svg width="88" height="88" viewBox="0 0 88 88">
                    <defs>
                        {/* Purple gradient for filled arc */}
                        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#7c3aed" />
                        </linearGradient>

                        {/* Drop shadow filter for 3D effect */}
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#7c3aed" floodOpacity="0.35" />
                        </filter>

                        {/* Inner shadow for depth */}
                        <filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
                        </filter>
                    </defs>

                    {/* Outer glow ring */}
                    <circle
                        cx="44" cy="44" r="38"
                        fill="none"
                        stroke="rgba(139,92,246,0.15)"
                        strokeWidth="6"
                    />

                    {/* Track (background arc) */}
                    <circle
                        cx="44" cy="44" r={radius}
                        fill="none"
                        stroke="rgba(39,39,42,0.10)"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Filled arc */}
                    <circle
                        cx="44" cy="44" r={radius}
                        fill="none"
                        stroke="url(#arcGrad)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 44 44)"
                        filter="url(#shadow)"
                    />

                    {/* Donut hole */}
                    <circle
                        cx="44" cy="44" r="20"
                        fill="rgba(244,244,245,0.90)"
                        filter="url(#innerShadow)"
                    />
                </svg>
            </div>
        </div>
    );
}
