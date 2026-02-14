/**
 * CourseCard Component
 * 
 * Displays individual course information including:
 * - Course code, title, instructor
 * - Assignment statistics (total, completed, upcoming)
 * - Progress bar with percentage
 * - Action buttons
 */
import { CourseMetadata } from "@/lib/mock/coursedata";

interface CourseCardProps {
    course: CourseMetadata;
    onViewSyllabus: (courseName: string) => void;
    onViewAssignment: (courseName: string) => void;
}

export default function CourseCard({course, onViewSyllabus, onViewAssignment}: CourseCardProps){
    const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

    return(
        <div className={`${panel} p-6 relative overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-lg`}>
            {/*Top Gradient Border*/}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r ${course.gradientClass}`}></div>

            {/*Course Code*/}
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#A1A1AA] mb-2">
                {course.code}
            </div>

            {/*Course Title*/}
            <div className="text-[18px] font-bold text-[#18181B] mb-1">
                {course.title}
            </div>

            {/*Instructor*/}
            <div className="text-[13px] text-[#52525B] mb-5">
                {course.instructor}
            </div>

            {/*Statistics Grid*/}
            <div className="grid grid-cols-3 gap-4 mb-5 pt-5 border-t border-[#E4E4E7]">
                {/*total assignments*/}
                <div className="text-center">
                    <div className="text-[20px] font-bold text-[#18181B] mb-1">
                        {course.stats.total}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-[#A1A1AA]">
                        Assignments
                    </div>
                </div>

                {/*Complexted*/}
                <div className="text-center">
                    <div className="text-[20px] font-bold text-[#18181B] mb-1">
                        {course.stats.completed}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-[#A1A1AA]">
                        Completed
                    </div>
                </div>

                {/*Upcoming*/}
                <div className="text-center">
                    <div className="text-[20px] font-bold text-[#18181B] mb-1">
                        {course.stats.upcoming}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide font-semibold text-[#A1A1AA]">
                        Upcoming
                    </div>
                </div>
            </div>

            {/*Progress Bar*/}
            <div className="mb-2">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-[12px] font-semibold text-[#18181B]">
                        Course Progress
                    </div>
                    <div className="text-[12px] font-bold text-[#8B5CF6]">
                        {course.progress}%
                    </div>
                </div>

                    {/*Progress Bar Track*/}
                    <div className="h-2 bg-[#FAFAFA] rounded-full overflow-hidden">

                        {/*Progress Bar Fill*/}
                        <div className={`h-full bg-linear-to-r ${course.gradientClass} rounded-full transition-all duration-300`} style={{width: `${course.progress}%`}}></div>
                    </div>
            </div>

            {/*Action Buttons*/}
            <div className="flex gap-2">
                {/*View Syllabus Button*/}
                <button onClick ={() => onViewSyllabus(course.name)} className="flex-1 py-2.5 px-4 border-2 border-[#E4E4E7] rounded-xl bg-transparent font-semibold text-[12px] text-[#52525B] cursor-pointer transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#FAFAFA] hover:text-[#8B5CF6]">
                    View Syllabus
                </button>

                {/*Assignment Buttons*/}
                <button onClick={() => onViewAssignment(course.name)} className="flex-1 py-2.5 px-4 border-2 border-[#E4E4E7] rounded-xl bg-transparent font-semibold text-[12px] text-[#52525B] cursor-pointer transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#FAFAFA] hover:text-[#8B5CF6]">
                    Assignments
                </button>
            </div>
        </div>
    );
}