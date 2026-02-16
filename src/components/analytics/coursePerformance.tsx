/**
 * CoursePerformance Component
 * 
 * Displays a list of courses with performance metrics:
 * - Course icon w/ gradient background
 * - Course Name
 * - Assignment progress
 * - Performance Percentage
 * 
 * Uses course metadata for consistent styling across the app. 
 */
import { CoursePerformance as CoursePerformanceType } from "@/lib/mock/analyticsdata";

interface CoursePerformanceProps{
    courses: CoursePerformanceType[];
}

export default function CoursePerformance({courses}: CoursePerformanceProps){
    const panel = 'bg-white/90 backdrop-blur-md border border-zinc-200/70 rounded-3xl shadow-sm';

    const getCourseIcon = (courseName: string): string =>{
        const iconMap: Record<string, string> = {
            'Physics 201': '⚛️',
            'Calculus III': '📐',
            'Engineering Dynamics': '⚙️',
            'Computer Science 101': '💻',
            'History of Technology': '📚',
        };

        return iconMap[courseName] || '📖';
    };

    return(
        <div className={`${panel} p-7`}>
            <h2 className = 'text-[20px] font-bold text-[#18181B] mb-6'>
                Course Performance
            </h2>
            
            <div className="flex flex-col gap-4">
                {courses.map((course)=>(
                    <div key={course.courseName} className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${course.gradientClass} flex items-center justify-center text-[20px] shrink-0`}>
                            {getCourseIcon(course.courseName)}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-bold text-[#18181B] mb-1 truncate">
                                {course.courseName}
                            </div>

                            <div className="text-[12px] text-[#52525B]">
                                {course.totalAssignments} assignments · {course.completedAssignments} completedAssignments
                            </div>
                        </div>

                        <div className="text-[24px] font-bold text-[#8B5CF6] shrink-0">
                            {course.percentage}%
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}