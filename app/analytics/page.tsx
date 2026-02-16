/**
 * Analytics Page
 * 
 * Main analytics dashboard displaying:
 *  - Stats grid
 * - Study hours chart
 * - Course Performance
 * - Productivity table
 */
'use client';
import { useState, useEffect } from "react";
import StatsGrid from "@/components/analytics/statsGrid";
import StudyHoursChart from "@/components/analytics/studyHours";
import CoursePerformance from "@/components/analytics/coursePerformance";
import ProductivityTable from "@/components/analytics/productivityTable";
import { generateAnalyticsData, AnalyticsStat, StudyHoursData, CoursePerformance as CoursePerformanceType, ProductivityDay } from "@/lib/mock/analyticsdata";


export default function AnalyticsPage(){
    const [statsData, setStatsData] = useState<AnalyticsStat[]>([]);
    const [studyHoursData, setStudyHoursData] = useState<StudyHoursData | null>(null);
    const [coursePerformance, setCoursePerformance] = useState<CoursePerformanceType[]>([]);
    const [productivityData, setProductivityData] = useState<ProductivityDay[]>([]);

    useEffect(()=>{
        const analyticsData = generateAnalyticsData();

        setStatsData(analyticsData.stats);
        setStudyHoursData(analyticsData.StudyHours);
        setCoursePerformance(analyticsData.coursePerformance);
        setProductivityData(analyticsData.productivity);
    }, []);

    return(
        <main className="max-w-375 mx-auto px-6 py-6 ml-40">
            <div className="mb-8">
                <h1 className="text-[36px] font-bold text-[#18181B] mb-2">
                    Performance Analytics
                </h1>
                <p className="text-[16px] text-[#52525B]">
                    Track your progress and productivity
                </p>
            </div>

            {statsData.length > 0 && (
                <StatsGrid stats = {statsData}/>
            )}
            <div className="grid grid-cols-[2fr_1fr] gap-6 mb-8">
                {studyHoursData && (
                    <StudyHoursChart data={studyHoursData}/>
                )}
                {coursePerformance.length > 0 && (
                    <CoursePerformance courses={coursePerformance}/>
                )}
            </div>

                {productivityData.length >0 && (
                    <ProductivityTable data={productivityData}/>
                )}
        </main>
    );
}