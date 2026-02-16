/**
 * ProductivityTableComponent
 * 
 * Displays a detailed weekly productivity breakdown table with:
 * - Day of week
 * - Task completed
 * - Study hours
 * - Completion rate
 * - Focus score
 */

import { ProductivityDay } from "@/lib/mock/analyticsdata";

interface ProductivityTableProps{
    data: ProductivityDay[];
}

export default function ProductivityTable({data}: ProductivityTableProps){
    const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

    return(
        <div className={`${panel} p-7`}>
            <h2 className="text-[24px] font-bold text-[#18181B] mb-6">
                Weekly Productivity Breakdown
            </h2>

            <table className="w-full border-separate border-spacing-y-3">
                <thead>
                    <tr>
                        <th className="text-left text-[12px] font-bold uppercase tracking-wide text-[#A1A1AA] pb-3 px-4">
                            Day
                        </th>
                        <th className="text-left text-[12px] font-bold uppercase tracking-wide text-[#A1A1AA] pb-3 px-4">
                            Tasks Completed
                        </th>
                        <th className="text-left text-[12px] font-bold uppercase tracking-wide text-[#A1A1AA] pb-3 px-4">
                            Study Hours
                        </th>
                        <th className="text-left text-[12px] font-bold uppercase tracking-wide text-[#A1A1AA] pb-3 px-4">
                            Completion Rate
                        </th>
                        <th className="text-left text-[12px] font-bold uppercase tracking-wide text-[#A1A1AA] pb-3 px-4">
                            Focus Score
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((day) =>(
                        <tr key={day.day}>
                            <td className="bg-[#FAFAFA] py-4 px-4 rounded-l-xl text-[14px] font-semibold text-[#18181B]">
                                {day.day}
                            </td>

                            <td className="bg-[#FAFAFA] py-4 px-4 text-[14px]">
                                <span className="inline-block px-3 py-1 rounded-lg text-[12px] font-bold bg-white">
                                    {day.tasksCompleted} tasks
                                </span>
                            </td>

                            <td className="bg-[#FAFAFA] py-4 px-4 text-[14px] font-bold text-[#8B5CF6]">
                                {day.studyHours}
                            </td>

                            <td className="bg-[#FAFAFA] py-4 px-4 text-[14px] font-bold">
                                <span className={day.completionRate >= 90 ? 'text-[#10B981]' : 'text-[#F59E0B]'}>
                                    {day.completionRate}%
                                </span>
                            </td>

                            <td className="bg-[#FAFAFA] py-4 px-4 rounded-r-xl text-[14px] font-bold text-[#8B5CF6]">
                                {day.focusScore}%
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}