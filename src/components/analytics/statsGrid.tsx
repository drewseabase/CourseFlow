/**
 * StatsGrid Component
 * 
 * Displays 4 key analytics statistics in a grid layout:
 * - Total study hours
 * - Completion rate
 * - Average Session time
 * - On-time submissions
 */
import { AnalyticsStat } from "@/lib/mock/analyticsdata";

interface StatsGridProps{
    stats: AnalyticsStat[];
}

export default function StatsGrid({stats}: StatsGridProps){
    const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

    const gradients = [
        'from-[#667eea] to-[#764ba2]',
        'from-[#4facfe] to-[#00f2fe]',
        'from-[#43e97b] to-[#38f9d7]',
        'from-[#f093fb] to-[#f5576c]',
    ];

    return(
        <div className="grid grid-cols-4 gap-5 mb-8">
            {stats.map((stat, index) =>(
                <div key={stat.label} className={`${panel} p-6 relative overflow-hidden`}>
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradients[index]}`}></div>

                    <div className="w-12 h-12 rounded-xl bg-[#FAFAFA] flex items-center justify-center text-2xl mb-4">
                        {stat.icon}
                    </div>

                    <div className="text-[13px] font-semibold uppercase tracking-wide text-[#A1A1AA] mb-2">
                        {stat.label}
                    </div>

                    <div className="text-[36px] font-bold text-[#18181B] mb-2">
                        {stat.value}
                    </div>

                    <div className={`text-[13px] font-semibold ${stat.isPositive ? 'text-[#10B981]':'text-[#EC4899'}`}>
                        {stat.change}
                    </div>
                </div>
            ))}
        </div>
    );
}