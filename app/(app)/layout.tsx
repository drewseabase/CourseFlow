/**
 * App Layout
 * 
 * This is the nested layout for the /app routes (calendar, today, settings).
 * It provides:
 * - Navigation structure (sider/header)
 * - Schedule State context (via ScheduleProvider)
 * - Shared layout elements for all app pages
 * 
 * This layout wraps all routes within the (app) folder.
 */
import { ScheduleProvider } from "@/lib/state/schedule-context";
import React from "react";

/**
 * Props for the App Layout component
 */
interface AppLayoutProps {
    children: React.ReactNode;
}

/**
 * App Layout component
 * 
 * Wraps all app routes with the ScheduleProvider to make 
 * schedule state available throughout the application
 * 
 * The ScheduleProvider must wrap all routes that need access to schedule data
 * (Calendar, Today, Settings pages)
 * 
 * @param props - Layout props containing children
 * @returns Layout component with navigation provider
 */
export default function AppLayout({children}: AppLayoutProps){
    return(
        <ScheduleProvider>
            {/* All routes inside (app)/ folder will have access to schedule state
            This includes:
            - /calendar
            - /today
            - /settings
             */}
            {children}
        </ScheduleProvider>
    );
}