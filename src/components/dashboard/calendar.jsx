'use client';
import {useState} from 'react';

export default function Calendar(){
    //Get current date
    const today = new Date();

    //State to track current month and year being displayed
    const[currentMonth, setCurrentMonth] = useState(today.getMonth());
    const[currentYear, setCurrentYear] = useState(today.getFullYear());

    //Array of months
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
        'September', 'October', 'November', 'December'];
    //Array of day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    /**
     * Get the number of days in a specific month/year
     * @param {number} month - Month (0-11)
     * @param {number} year- Full year
     * @returns {number} Number of days in the month
     */
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };

    /**
     * Get the day of week that the month starts on
     * @param {number} month - Month (0-11)
     * @param {number} year - Full year
     * @returns {number} Day of week
     */
    const getFirstDayOfMonth = (month, year) =>{
        return new Date(year, month, 1).getDay();
    };

    /**
     * Check if a specific date is today
     * @param {number} day - Day of Month
     * @param {number} month - Month (0-11)
     * @param {number} year - Full year
     * @returns {boolean} True if the date is today
     */
    const isToday = (day, month, year) => {
        return(
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    /**
     * Check if a date should have an event indicator
     * For demonstration, we'll show events on various days
     * Replace logic later w actual event data
     * @param {number} day - Day of month
     * @returns {boolean} True if day should show event indicator
     */
    const hasEvent = (day) => {
        //Demo
        const eventDays = [2,3,4,5,6,9,10,12,13];
        return eventDays.includes(day);
    };
    /**
     * Navigate to previous month
     */
    const previousMonth = () => {
        if(currentMonth === 0){
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        }else{
            setCurrentMonth(currentMonth - 1);
        }
    };
    /**
     * Navigate to next month
     */
    const nextMonth = () =>{
        if(currentMonth === 11){
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        }else{
            setCurrentMonth(currentMonth + 1);
        }
    };

    /**
     * Generate array of day objects for the calendar grid
     * Includes empty slots for days before the month starts
     * @returns {Array} Array of day objects with day number and empty flag
     */
    const generateCalendarDays = () =>{
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++){
            days.push({day: null, isEmpty: true});
        }

        //Add actual days of month
        for(let day = 1; day <= daysInMonth; day++){
            days.push({day, isEmpty: false});
        }

        return days;
    };

    const calendarDays = generateCalendarDays();

    return(
        <div className="bg-white rounded-[20px] p-7 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
            {/*Calendar Header - Month/Year display and navigation controls*/}
            <div className='flex justify-between items-center mb-6'>
                <div className='text-[24px] font-bold'>
                    {monthNames[currentMonth]} {currentYear}
                </div>

                {/*Navigation Controls*/}
                <div className='flex gap-3'>
                    {/*Previous Month Button*/}
                    <button onClick={previousMonth} className='w-10 h-10 border-0 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]' aria-label="Previous Month">
                        ◀
                    </button>

                    {/*Next Month Button*/}
                    <button onClick={nextMonth} className='w-10 h-10 border-0 rounded-[10px] bg-[#FAFAFA] cursor-pointer text-lg transition-all duration-200 hover:scale-110 hover:bg-[#E4E4E7]' aria-label='Next Month'>
                        ▶
                    </button>
                </div>
            </div>

            {/*Calendar Grid - 7 columns*/}
            <div className='grid grid-cols-7 gap-2'>
                {/*Day Headers*/}
                {dayNames.map((dayNames) =>(
                    <div key={dayNames} className='text-center text-xs font-bold text-[#A1A1AA] py-3 uppercase'>
                        {dayNames}
                        </div>
                ))}

                {/*Calendar Day Cells*/}
                {calendarDays.map((dayObj, index) =>{
                    //Empty cell
                    if(dayObj.isEmpty){
                        return(<div key={`empty-${index}`} className='aspect-square'/>);
                    }

                    //Actual day cell
                    const isTodayDate = isToday(dayObj.day, currentMonth, currentYear);
                    const hasEventIndicator = hasEvent(dayObj.day);

                    return(
                        <div key={`day-${dayObj.day}`} className={`aspect-square rounded-[14px] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 relative ${isTodayDate ? 'bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-bold' : 'bg-[#FAFAFA] hover:scale-105 hover:bg-[#E4E4E7]'}`}>
                                {/*Day Number*/}
                                <div className='text-base font-semibold'>
                                    {dayObj.day}
                                </div>

                                {/*Event Indicator*/}
                                {hasEventIndicator && (
                                    <div className={`absolute bottom-1.5 w-1 h-1 rounded-full ${isTodayDate ? 'bg-white' : 'bg-[#8B5CF6]'}`}/>
                                )}
                            </div>
                            
                    );
                })}
            </div>
        </div>
    )
}